import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UploadResponse {
  success: boolean;
  files: Array<{
    name: string;
    size: number;
    url: string;
  }>;
  errors: string[];
}

export const useImageUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resizeImage = (file: File, maxSizeKB: number = 200): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const maxDimension = 1200; // Max width or height
        
        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Start with high quality and reduce if needed
        let quality = 0.9;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Reduce quality until under size limit
        while (dataUrl.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) { // 1.37 is base64 overhead factor
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!user) {
      throw new Error('User must be logged in to upload images');
    }

    setUploading(true);
    setError(null);

    try {
      const base64Images: string[] = [];

      // Process each file
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image`);
        }

        // Check if file needs resizing (200KB = 200 * 1024 bytes)
        if (file.size > 200 * 1024) {
          console.log(`Resizing ${file.name} from ${(file.size / 1024).toFixed(1)}KB`);
          const resizedBase64 = await resizeImage(file);
          base64Images.push(resizedBase64);
        } else {
          const base64 = await fileToBase64(file);
          base64Images.push(base64);
        }
      }

      // Upload to server
      const response = await fetch('https://eletsa.cairns.co.za/php/files/upload.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id.toString(),
          images: base64Images,
        }),
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result: UploadResponse = await response.json();

      if (!result.success) {
        throw new Error(result.errors.join(', ') || 'Upload failed');
      }

      if (result.errors.length > 0) {
        console.warn('Upload warnings:', result.errors);
      }

      // Return the full URLs
      const baseUrl = 'https://eletsa.cairns.co.za';
      return result.files.map(file => `${baseUrl}${file.url}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImages,
    uploading,
    error,
    clearError: () => setError(null),
  };
};