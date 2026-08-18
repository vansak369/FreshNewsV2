// Firebase Storage layer for article images.
// Images are stored at article-images/{userId}/{uniqueFileName} and the
// resulting download URL is what gets saved as `imageUrl` on the article doc.
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase.js';

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

// Uploads a validated image file to Firebase Storage and resolves with its
// public download URL. `onProgress` (optional) receives 0-100.
export function uploadArticleImage(file, userId, onProgress) {
  return new Promise((resolve, reject) => {
    const uniqueName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `article-images/${userId}/${uniqueName}`);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        }
      },
      (err) => reject(err),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

// Best-effort delete of an old/orphaned article image. Only attempts this for
// URLs that actually point at Firebase Storage — manually-pasted external
// image URLs (from before this feature existed) are left alone.
export async function deleteArticleImageByUrl(url) {
  if (!url || !url.includes('firebasestorage')) return;
  try {
    await deleteObject(ref(storage, url));
  } catch (err) {
    // Non-fatal: the article itself already saved successfully either way.
    console.warn('Could not delete old article image:', err);
  }
}

// Uploads a validated image file to Firebase Storage for use as a user's
// profile photo, and resolves with its public download URL.
export function uploadProfileImage(file, userId, onProgress) {
  return new Promise((resolve, reject) => {
    const uniqueName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `profile-images/${userId}/${uniqueName}`);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        }
      },
      (err) => reject(err),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

// Best-effort delete of an old/orphaned profile image. Only attempts this for
// URLs that actually point at Firebase Storage.
export async function deleteProfileImageByUrl(url) {
  if (!url || !url.includes('firebasestorage')) return;
  try {
    await deleteObject(ref(storage, url));
  } catch (err) {
    // Non-fatal: the profile itself already saved successfully either way.
    console.warn('Could not delete old profile image:', err);
  }
}
