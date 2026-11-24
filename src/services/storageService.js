import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a file to Firebase Storage.
 * @param {File} file - The file to upload
 * @param {string} path - Path in storage (e.g. 'avatars/uid.jpg', 'recipes/recipeId.jpg')
 * @returns {Promise<string>} Download URL
 */
export async function uploadFile(file, path) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

/**
 * Get download URL for a path (if it exists).
 * @param {string} path - Path in storage
 * @returns {Promise<string|null>}
 */
export async function getFileUrl(path) {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch {
    return null;
  }
}

/**
 * Delete a file from Storage.
 * @param {string} path - Full path in storage
 */
export async function deleteFile(path) {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
