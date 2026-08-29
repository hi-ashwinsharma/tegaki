import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from './firebase';

export type UploadFolder = 'covers' | 'article_images' | 'avatars' | 'og_images';

/**
 * Reads a File object as a base64 DataURL (offline fallback)
 */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image File to Firebase Storage and returns the public CDN download URL.
 * Falls back to local DataURL if Firebase Storage is unavailable or offline.
 */
export async function uploadImageFile(
  file: File,
  folder: UploadFolder = 'article_images'
): Promise<string> {
  if (!isFirebaseConfigured || !storage) {
    return await readFileAsDataUrl(file);
  }

  try {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${folder}/${Date.now()}_${sanitizedName}`;
    const storageRef = ref(storage, path);

    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.warn(`Firebase Storage upload failed for ${file.name}, using local fallback:`, error);
    return await readFileAsDataUrl(file);
  }
}

/**
 * Uploads a base64 DataURL string to Firebase Storage as a Blob.
 * If already a remote HTTPS URL or if storage is offline, returns the URL as is.
 */
export async function uploadBase64Image(
  dataUrl: string,
  folder: UploadFolder = 'covers',
  filename?: string
): Promise<string> {
  if (!dataUrl.startsWith('data:')) {
    return dataUrl; // Already a remote URL
  }

  if (!isFirebaseConfigured || !storage) {
    return dataUrl;
  }

  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const ext = blob.type.split('/')[1] || 'jpg';
    const name = filename || `${Date.now()}_image.${ext}`;
    const path = `${folder}/${name}`;
    const storageRef = ref(storage, path);

    const snapshot = await uploadBytes(storageRef, blob, {
      contentType: blob.type || 'image/jpeg',
    });

    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.warn('Failed to upload base64 image to Firebase Storage:', error);
    return dataUrl;
  }
}
