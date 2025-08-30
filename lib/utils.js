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

// Fetches all image files inside a shared Google Drive folder and
// returns direct googleusercontent links for each image.
// Requires a public folder and a valid GOOGLE_DRIVE_API_KEY env variable.
export async function getGoogleDriveFolderImageUrls(folderUrl) {
  if (!folderUrl) return [];

  try {
    const match = folderUrl.match(/(?:folders\/|id=)([a-zA-Z0-9_-]+)/);
    const folderId = match && match[1];
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

    if (!folderId || !apiKey) return [];

    const query = encodeURIComponent(
      `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`
    );
    const fields = encodeURIComponent("files(id)");
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (
      data.files?.map((file) => `https://lh3.googleusercontent.com/d/${file.id}`) || []
    );
  } catch (e) {
    console.error("Failed to fetch images from Drive folder", e);
    return [];
  }
}
