import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Server-side helper to fetch image links from a Google Drive folder
async function fetchFolderImages(folderId) {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  // Use official API when a key is available
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

  // Fallback: scrape the public embedded folder view
  const embeddedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
  const html = await fetch(embeddedUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  }).then((r) => (r.ok ? r.text() : ""));
  if (!html) return [];

  // First try to scrape data-id attributes rendered in the markup
  const idRegex = /data-id=['"]([^'"]+)['"]/g;
  const ids = new Set();
  let m;
  while ((m = idRegex.exec(html)) !== null) {
    ids.add(m[1]);
  }

  // Some folder views lazy-load items via JSON in <script> tags instead of
  // rendering data-id attributes. Fall back to pulling any "id" fields from
  // inline JSON blobs if we didn't get any matches above.
  if (!ids.size) {
    const jsonIdRegex = /"id":"([a-zA-Z0-9_-]{10,})"/g;
    while ((m = jsonIdRegex.exec(html)) !== null) {
      if (m[1] !== folderId) ids.add(m[1]);
    }
  }

  return Array.from(ids).map((id) => `https://lh3.googleusercontent.com/d/${id}`);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get("id");
  if (!folderId) {
    return NextResponse.json({ links: [] }, { status: 400 });
  }
  try {
    const links = await fetchFolderImages(folderId);
    return NextResponse.json({ links });
  } catch (e) {
    return NextResponse.json({ links: [], error: e.message }, { status: 500 });
  }
}
