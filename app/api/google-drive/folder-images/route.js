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

  const idRegex = /data-id=['"]([^'"]+)['"]/g;

  const links = [];
  let m;
  while ((m = idRegex.exec(html)) !== null) {
    links.push(`https://lh3.googleusercontent.com/d/${m[1]}`);
  }
  return links;
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
