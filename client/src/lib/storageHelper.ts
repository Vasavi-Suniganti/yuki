import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadResult {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  uploadedAt: string;
}

export async function uploadFileWithFallback(file: File, folder: string = 'uploads'): Promise<UploadResult> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-[#0-9]\.\-_]/gi, '_');
  const storagePath = `${folder}/${timestamp}_${safeName}`;

  if (storage) {
    try {
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const downloadUrl = await getDownloadURL(storageRef);
      return {
        fileUrl: downloadUrl,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size,
        storagePath,
        uploadedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('Firebase Storage upload warning, using local Blob URL fallback:', err);
    }
  }

  // Fallback: Create Object URL for live preview and download
  const fileUrl = URL.createObjectURL(file);
  return {
    fileUrl,
    fileName: file.name,
    fileType: file.type || 'application/octet-stream',
    fileSize: file.size,
    storagePath: `local/${safeName}`,
    uploadedAt: new Date().toISOString(),
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
