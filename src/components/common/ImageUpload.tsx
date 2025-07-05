import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface ImageUploadProps {
  onFilesChange: (files: File[]) => void;
  maxImages?: number;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onFilesChange,
  maxImages = 5,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const createImageFile = (file: File): ImageFile => ({
    file,
    preview: URL.createObjectURL(file),
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  });

  const handleFiles = useCallback((files: FileList) => {
    if (files.length === 0) return;

    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please select only image files');
      return;
    }

    // Check if adding these images would exceed the limit
    if (selectedImages.length + imageFiles.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setError(null);
    const newImageFiles = imageFiles.map(createImageFile);
    const updatedImages = [...selectedImages, ...newImageFiles];
    
    setSelectedImages(updatedImages);
    onFilesChange(updatedImages.map(img => img.file));
  }, [selectedImages, maxImages, onFilesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  }, [handleFiles]);

  const removeImage = useCallback((id: string) => {
    const imageToRemove = selectedImages.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    const newImages = selectedImages.filter(img => img.id !== id);
    setSelectedImages(newImages);
    onFilesChange(newImages.map(img => img.file));
    setError(null);
  }, [selectedImages, onFilesChange]);

  // Cleanup object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const canAddMore = selectedImages.length < maxImages;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ${
            dragActive
              ? 'border-[#1E30FF] bg-[#1E30FF]/5'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="text-center">
            <div className="flex flex-col items-center space-y-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-[#1E30FF]">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB (will be resized if larger than 200KB)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}

      {/* Image Previews */}
      {selectedImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Selected Images ({selectedImages.length}/{maxImages})
            </h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedImages.map((imageFile) => (
              <div key={imageFile.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imageFile.preview}
                    alt={`Selected ${imageFile.file.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* File Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-1 text-xs truncate rounded-b-lg">
                  {imageFile.file.name}
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => removeImage(imageFile.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Limit Message */}
      {!canAddMore && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-2">
          <ImageIcon className="w-4 h-4 text-blue-600" />
          <span className="text-blue-600 text-sm">
            Maximum of {maxImages} images reached
          </span>
        </div>
      )}
    </div>
  );
};