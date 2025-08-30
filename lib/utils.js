import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Converts a Google Drive share link into a direct image URL
// Example:
//  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
// becomes:

export function getDirectGoogleDriveImageUrl(url) {
  if (!url) return url;

  try {
    // Extract the file ID from various Google Drive URL formats
    const match = url.match(/(?:file\/d\/|id=|open\?id=)([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      // Use lh3.googleusercontent.com which serves the raw file reliably
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  } catch (e) {
    // ignore and fall back to original url
  }

  return url;
}

// Fetches all image files inside a shared Google Drive folder and returns
// direct googleusercontent links for each image. Uses the Drive API when an
// API key is available and falls back to scraping the public embedded folder
// view when it's not.
export async function getGoogleDriveFolderImageUrls(folderUrl) {
  if (!folderUrl) return [];

  try {
    const match = folderUrl.match(/(?:folders\/|id=)([a-zA-Z0-9_-]+)/);
    const folderId = match && match[1];
    if (!folderId) return [];
    // On the client we proxy the request through our API route to avoid CORS
    if (typeof window !== "undefined") {
      const res = await fetch(`/api/google-drive/folder-images?id=${folderId}`);
      if (res.ok) {
        const data = await res.json();
        return data.links || [];
      }
      return [];
    }

    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

    // Prefer the official Google Drive API when a key is present
    if (apiKey) {
      const query = encodeURIComponent(
        `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`
      );
      const fields = encodeURIComponent("files(id)");
      const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&key=${apiKey}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const links =
          data.files?.map((file) => `https://lh3.googleusercontent.com/d/${file.id}`) || [];
        if (links.length) return links;
      }
    }

    // Fallback: use the public embedded folder view and scrape image sources
    const embeddedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
    const html = await fetch(embeddedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    }).then((r) => (r.ok ? r.text() : ""));
    if (!html) return [];

    // Extract each file's id from the markup and convert to a direct image link
    const idRegex = /data-id=['"]([^'"]+)['"]/g;
    const links = [];
    let m;
    while ((m = idRegex.exec(html)) !== null) {
      links.push(`https://lh3.googleusercontent.com/d/${m[1]}`);
    }

    return links;
  } catch (e) {
    console.error("Failed to fetch images from Drive folder", e);
    return [];
  }
}
