import React, { useState } from 'react';
import { User, Mail, Save, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useImageUpload } from '../../hooks/useImageUpload';

export const ProfileTab: React.FC = () => {
  const { user, updateProfile, loading, error } = useAuth();
  const { uploadImages, uploading: imageUploading } = useImageUpload();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    avatar: user?.avatar || '',
  });
  const [saved, setSaved] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalAvatarUrl = formData.avatar;
      
      // Upload new image if one is selected
      if (selectedImageFile) {
        try {
          const uploadedUrls = await uploadImages([selectedImageFile]);
          if (uploadedUrls.length > 0) {
            finalAvatarUrl = uploadedUrls[0];
          }
        } catch (uploadError) {
          console.error('Failed to upload avatar:', uploadError);
          // Continue with form submission even if image upload fails
        }
      }
      
      await updateProfile(formData);
      await updateProfile({ ...formData, avatar: finalAvatarUrl });
      setSaved(true);
      
      // Clear image selection after successful save
      setSelectedImageFile(null);
      setImagePreview(null);
      
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      // Error is handled by context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear image selection if avatar URL is manually changed
    if (e.target.name === 'avatar') {
      setSelectedImageFile(null);
      setImagePreview(null);
    }
    
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear the avatar URL field since we're uploading a new image
      setFormData(prev => ({ ...prev, avatar: '' }));
    }
  };

  const removeSelectedImage = () => {
    setSelectedImageFile(null);
    setImagePreview(null);
  };

  if (!user) return null;

  return (
    <>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-600 text-sm">Profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Profile Picture
          </label>
          
          <div className="flex items-start space-x-6">
            {/* Current/Preview Avatar */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-200">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : user.avatar ? (
                  <img src={user.avatar} alt="Current avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              
              {selectedImageFile && (
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="text-xs text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  Remove selected image
                </button>
              )}
            </div>
            
            {/* Upload Controls */}
            <div className="flex-1">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors duration-200">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Camera className="w-8 h-8 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-[#1E30FF]">Click to upload</span> a new profile picture
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB (will be resized if needed)
                    </p>
                  </div>
                </label>
              </div>
              
              {selectedImageFile && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Selected:</strong> {selectedImageFile.name}
                  </p>
                  <p className="text-xs text-blue-600">
                    This image will be uploaded when you save your profile
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
              placeholder="Enter your username"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            A username and/or first/last name is required to interact with other users through messages.
          </p>
        </div>

        {/* First Name */}
        <div>
          <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
            placeholder="Enter your first name"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
            placeholder="Enter your last name"
          />
        </div>

        {/* Avatar URL */}
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
            Avatar URL (Alternative)
          </label>
          <input
            id="avatar"
            name="avatar"
            type="url"
            value={formData.avatar}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
            placeholder="https://example.com/avatar.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter a URL to your profile image, or upload an image above
          </p>
        </div>

        {/* Save Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading || imageUploading}
            className="w-full bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:ring-2 focus:ring-[#1E30FF] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>
              {imageUploading ? 'Uploading Image...' : loading ? 'Saving...' : 'Save Changes'}
            </span>
          </button>
        </div>
      </form>
    </>
  );
};