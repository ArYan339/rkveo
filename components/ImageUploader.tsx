// FIX: Add a triple-slash directive to include DOM library types, resolving errors for DOM interfaces like 'HTMLInputElement' and globals like 'alert'.
/// <reference lib="dom" />

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  image: ImageFile | null;
  onImageChange: (image: ImageFile | null) => void;
  disabled: boolean;
}

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13 10H18.535L13 4.464V10ZM12 2.00002C12.5523 2.00002 13 2.44773 13 3.00002V11L19.535 11C20.2541 11 20.655 11.932 20.1816 12.457L12.9248 20.457C12.4312 20.9992 11.5688 20.9992 11.0752 20.457L3.81836 12.457C3.34498 11.932 3.74588 11 4.46497 11H11V3.00002C11 2.44773 11.4477 2.00002 12 2.00002Z"></path>
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ image, onImageChange, disabled }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image) {
      setImagePreview(`data:${image.mimeType};base64,${image.base64}`);
    } else {
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [image]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onImageChange({ base64: base64String, mimeType: file.type, name: file.name });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageChange]);

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Image (Optional)
      </label>
      <div
        onClick={handleClick}
        className={`relative flex justify-center items-center w-full h-40 px-4 border-2 border-dashed rounded-lg transition-colors duration-200 ${
          disabled ? 'cursor-not-allowed bg-gray-800/50 border-gray-700' : 'cursor-pointer bg-gray-700/50 border-gray-600 hover:border-cyan-400'
        } ${imagePreview ? 'p-0 border-solid' : 'p-4'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          disabled={disabled}
        />
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Preview" className="object-contain w-full h-full rounded-lg" />
            <button
              onClick={handleRemoveImage}
              disabled={disabled}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors disabled:opacity-50"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon className="mx-auto h-8 w-8" />
            <p className="mt-1 text-sm">Click to upload an image</p>
            <p className="text-xs">Enhance your prompt with a visual starting point</p>
          </div>
        )}
      </div>
    </div>
  );
};