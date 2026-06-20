import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function DropZone({ onFilesSelected }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeBytes = 50 * 1024 * 1024; // 50MB limit

  const handleFiles = (files) => {
    setError(null);
    const validFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type)) {
        setError(`File "${file.name}" has an unsupported format. Please upload JPG, PNG, or WebP.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        setError(`File "${file.name}" exceeds the 50MB size limit.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 scale-[1.01] shadow-lg shadow-brand-500/10'
            : 'border-gray-300 dark:border-gray-700 bg-white hover:border-brand-400 dark:bg-darkbg-200 hover:bg-gray-50/50 dark:hover:bg-darkbg-100/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={handleFileInputChange}
        />

        {/* Upload Icon Container */}
        <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
          isDragActive 
            ? 'bg-brand-500 text-white scale-110' 
            : 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 group-hover:scale-105'
        }`}>
          {isDragActive ? (
            <Upload className="h-8 w-8 animate-bounce" />
          ) : (
            <ImageIcon className="h-8 w-8 transition-transform duration-300 group-hover:-rotate-3" />
          )}
        </div>

        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          Drag & drop your images here
        </h3>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
          Or <span className="font-semibold text-brand-600 dark:text-brand-400 underline decoration-brand-600/30 group-hover:decoration-brand-600">browse local files</span> from your computer
        </p>

        {/* File Formats Badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {['PNG', 'JPEG', 'JPG', 'WEBP'].map((ext) => (
            <span
              key={ext}
              className="rounded-md border border-gray-200/60 dark:border-gray-800 bg-gray-50/50 dark:bg-darkbg-300 px-2 py-1 text-xxs font-semibold text-gray-400 dark:text-gray-500 tracking-wider transition-all duration-200 group-hover:border-brand-200/50 dark:group-hover:border-brand-900/50"
            >
              {ext}
            </span>
          ))}
        </div>

        {/* Extra info */}
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          Max file size: 50MB. All compression runs locally.
        </p>
      </div>

      {/* Error feedback */}
      {error && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950/30 p-4 text-rose-800 dark:text-rose-300 animate-fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}
    </div>
  );
}
