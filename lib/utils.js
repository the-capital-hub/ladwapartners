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
