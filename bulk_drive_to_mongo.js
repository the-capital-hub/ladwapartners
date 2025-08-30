#!/usr/bin/env node

const { google } = require('googleapis');
const { MongoClient, GridFSBucket } = require('mongodb');

const {
  GOOGLE_DRIVE_FOLDER_ID,
  MONGODB_URI,
  MONGODB_DB = 'images_db',
  GRIDFS_BUCKET = 'images',
  INCLUDE_SUBFOLDERS = 'true',
  CONCURRENCY = '4',
} = process.env;

if (!GOOGLE_DRIVE_FOLDER_ID || !MONGODB_URI) {
  console.error('GOOGLE_DRIVE_FOLDER_ID and MONGODB_URI are required');
  process.exit(1);
}

const includeSubfolders = INCLUDE_SUBFOLDERS !== 'false';
const concurrency = parseInt(CONCURRENCY, 10) || 4;
const allowedMimes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/tiff',
  'image/bmp',
  'image/heic',
  'image/heif',
  'image/svg+xml',
]);

let drive;
let bucket;
let total = 0;
let uploaded = 0;
let skipped = 0;
let failed = 0;
const images = [];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const shouldRetry = (err) => {
  const status = err?.response?.status;
  if (status && [429, 500, 502, 503, 504].includes(status)) return true;
  const codes = ['ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'ESOCKETTIMEDOUT'];
  return codes.includes(err.code);
};

async function withRetry(fn, desc) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt >= 5 || !shouldRetry(err)) throw err;
      const delay = 2 ** attempt * 1000;
      console.warn(`${desc} failed (attempt ${attempt}), retrying in ${delay}ms: ${err.message}`);
      await sleep(delay);
    }
  }
}

async function listFiles(rootId) {
  const files = [];
  const folders = [rootId];
  while (folders.length) {
    const current = folders.pop();
    let pageToken = null;
    do {
      const res = await withRetry(
        () =>
          drive.files.list({
            q: `'${current}' in parents and trashed=false`,
            fields:
              'nextPageToken, files(id, name, mimeType, md5Checksum, size, webViewLink, createdTime, modifiedTime)',
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            pageSize: 1000,
            pageToken,
          }),
        'files.list'
      );
      pageToken = res.data.nextPageToken;
      for (const file of res.data.files || []) {
        if (file.mimeType === 'application/vnd.google-apps.folder') {
          if (includeSubfolders) folders.push(file.id);
        } else if (allowedMimes.has(file.mimeType)) {
          files.push(file);
        }
      }
    } while (pageToken);
  }
  return files;
}

async function processFile(file) {
  const directLink = `https://lh3.googleusercontent.com/d/${file.id}`;
  const exists = await bucket
    .find({ 'metadata.driveId': file.id })
    .limit(1)
    .toArray();
  if (exists.length) {
    skipped++;
    images.push(directLink);
    return;
  }
  let attempt = 0;
  while (true) {
    try {
      const res = await withRetry(
        () =>
          drive.files.get(
            { fileId: file.id, alt: 'media', supportsAllDrives: true },
            { responseType: 'stream' }
          ),
        `files.get ${file.id}`
      );
      await new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(file.name, {
          contentType: file.mimeType,
          metadata: {
            driveId: file.id,
            mimeType: file.mimeType,
            md5Checksum: file.md5Checksum,
            size: file.size,
            webViewLink: file.webViewLink,
            createdTime: file.createdTime,
            modifiedTime: file.modifiedTime,
            directLink,
          },
        });
        res.data.on('error', (err) => {
          uploadStream.abort();
          reject(err);
        });
        uploadStream.on('error', reject);
        uploadStream.on('finish', resolve);
        res.data.pipe(uploadStream);
      });
      uploaded++;
      images.push(directLink);
      return;
    } catch (err) {
      attempt++;
      if (attempt >= 5 || !shouldRetry(err)) {
        failed++;
        console.error(`Failed to upload ${file.name}: ${err.message}`);
        return;
      }
      const delay = 2 ** attempt * 1000;
      console.warn(`Retry ${attempt} for ${file.name} in ${delay}ms: ${err.message}`);
      await sleep(delay);
    }
  }
}

async function asyncPool(limit, array, iteratorFn) {
  const ret = [];
  const executing = new Set();
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean).catch(clean);
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(ret);
}

(async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    drive = google.drive({ version: 'v3', auth });

    const mongo = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    await mongo.connect();
    const db = mongo.db(MONGODB_DB);
    bucket = new GridFSBucket(db, { bucketName: GRIDFS_BUCKET });

    const files = await listFiles(GOOGLE_DRIVE_FOLDER_ID);
    total = files.length;

    await asyncPool(concurrency, files, processFile);

    await mongo.close();
    console.log(`Summary: Total ${total}, Uploaded ${uploaded}, Skipped ${skipped}, Failed ${failed}`);
    console.log('Images:', images);
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  }
})();
