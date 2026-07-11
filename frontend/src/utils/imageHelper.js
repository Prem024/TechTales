/**
 * Resolves an image path from the backend into a fully qualified URL,
 * handling arrays of strings, relative paths, and default fallbacks.
 * 
 * @param {string|string[]} image - The image URL/path from the backend
 * @returns {string} - The resolved absolute image URL
 */
export const getImageUrl = (image) => {
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  
  if (!image) return defaultAvatar;
  
  // Extract first image if it is an array
  const imgStr = Array.isArray(image) ? image[0] : image;
  
  if (!imgStr || typeof imgStr !== 'string') {
    return defaultAvatar;
  }
  
  // If it's already an absolute HTTP/HTTPS URL
  if (imgStr.startsWith("http://") || imgStr.startsWith("https://")) {
    return imgStr;
  }
  
  // Resolve relative server upload path
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:6002";
  
  // Clean backslashes (common in Windows paths) and leading slashes
  const cleanPath = imgStr.replace(/\\/g, "/").replace(/^\//, "");
  
  return `${baseUrl}/${cleanPath}`;
};
