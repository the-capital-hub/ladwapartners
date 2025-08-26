import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Converts a Google Drive share link into a direct image URL
// Example:
//  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
// becomes:
//  https://drive.google.com/uc?export=view&id=FILE_ID
export function getDirectGoogleDriveImageUrl(url) {
  if (!url) return url;

  try {
    const match = url.match(/(?:file\/d\/|id=)([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  } catch (e) {
    // ignore and fall back to original url
  }

  return url;
}
