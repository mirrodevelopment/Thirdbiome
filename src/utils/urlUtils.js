/**
 * Utility to format image URLs from the backend
 * @param {string} path - The relative path from the API
 * @returns {string} - The full URL
 */
export const formatImageUrl = (path) => {
  if (!path) return "";
  
  // If it's already a full URL, return it
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }
  
  // If it's a local asset (Vite dev or public folder), return it as is
  if (
    path.startsWith("/src/") ||
    path.startsWith("/assets/") ||
    path.startsWith("/images/") ||
    path.startsWith("@fs/") ||
    path.includes("/node_modules/")
  ) {
    return path;
  }

  // If it's a relative path to a local asset from an import (e.g. "../../assets/...")
  // and we are in dev mode, it might look different. 
  // But usually imports are resolved to absolute paths from root.
  
  // Base URL for the admin/storage
  const baseUrl = "https://admin.thirdbiome.com";
  
  // Ensure we don't have double slashes
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  
  // If the path already looks like it's pointing to a standard storage location but without the domain
  if (normalizedPath.startsWith("/storage/") || normalizedPath.startsWith("/uploads/")) {
     return `${baseUrl}${normalizedPath}`;
  }

  // Default: prepend baseUrl for paths that are likely from the backend
  // but if it looks like a local file path (e.g. starts with /src), skip it.
  if (normalizedPath.startsWith("/src")) return path;

  return `${baseUrl}${normalizedPath}`;
};
