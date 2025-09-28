
import React, { useCallback, useState } from 'react';
import { ImageFile } from '../types';
import { ImageIcon, DeleteIcon } from './icons/Icons';

interface ImageUploaderProps {
  label: string;
  image: ImageFile | null;
  onImageChange: (imageFile: ImageFile | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onImageChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange({ dataUrl: reader.result as string, file });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageChange]);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  if (image) {
    return (
      <div className="relative">
        <img src={image.dataUrl} alt="Preview" className="w-full h-32 object-cover rounded-md" />
        <button
          onClick={() => onImageChange(null)}
          className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
          title="Remove Image"
        >
          <DeleteIcon className="w-4 h-4" />
        </button>
        <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-xs text-center p-1 rounded-b-md truncate">{image.file.name}</div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative flex justify-center items-center w-full h-32 px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-indigo-500' : 'border-slate-600'} border-dashed rounded-md`}
      >
        <div className="space-y-1 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-slate-400" />
          <div className="flex text-sm text-slate-400">
            <label
              htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
              className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none"
            >
              <span>Upload a file</span>
              <input
                id={`file-upload-${label.replace(/\s+/g, '-')}`}
                name={`file-upload-${label.replace(/\s+/g, '-')}`}
                type="file"
                className="sr-only"
                onChange={onFileChange}
                accept="image/*"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
};
