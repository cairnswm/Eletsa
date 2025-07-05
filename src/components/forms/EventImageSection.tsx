import React from 'react';
import { Image, Trash2 } from 'lucide-react';
import { ImageUpload } from '../common/ImageUpload';

interface EventImageSectionProps {
  selectedImageFiles: File[];
  onFilesChange: (files: File[]) => void;
  existingImages?: string[];
  onRemoveExistingImage?: (index: number) => void;
  isEdit?: boolean;
}

export const EventImageSection: React.FC<EventImageSectionProps> = ({
  selectedImageFiles,
  onFilesChange,
  existingImages = [],
  onRemoveExistingImage,
  isEdit = false,
}) => {
  const maxNewImages = 5 - existingImages.length;

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <Image className="w-6 h-6 text-[#489707]" />
        <span>Media</span>
      </h2>

      <div className="space-y-6">
        {/* Existing Images (Edit mode only) */}
        {isEdit && existingImages.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`Event image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {onRemoveExistingImage && (
                    <button
                      type="button"
                      onClick={() => onRemoveExistingImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Upload */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {isEdit ? 'Add New Images' : 'Event Images'}
          </h4>
          <ImageUpload
            onFilesChange={onFilesChange}
            maxImages={maxNewImages}
            className="w-full"
          />
          <p className="mt-1 text-xs text-gray-500">
            {isEdit 
              ? `Add up to ${maxNewImages} more images. Images will be uploaded when you save the event.`
              : 'Select up to 5 images for your event. Images will be uploaded when you save the event. Large images will be automatically resized.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};