const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
 
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
 
// Returns a friendly error message, or null if the file is valid.
export function validateImageFile(file) {
  if (!file) return null;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Please upload a JPG, PNG, or WEBP image.';
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'Image size must be less than 5 MB.';
  }
  return null;
}
 
// Uploads a validated image file to Cloudinary and resolves with its
// public hosted URL (a real https:// link, not base64).
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
 
  const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
  const data = await res.json();
 
  if (!res.ok) {
    throw new Error(data?.error?.message || 'Image upload failed.');
  }
  return data.secure_url;
}
 
// Kept as aliases so existing page code (Profile.jsx, ArticleForm.jsx)
// doesn't need different function names for the two upload spots.
export const uploadArticleImage = (file) => uploadImage(file);
export const uploadProfileImage = (file) => uploadImage(file);
 