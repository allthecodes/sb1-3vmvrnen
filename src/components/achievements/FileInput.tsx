import React, { useCallback } from 'react';
import { Upload, X } from 'lucide-react';

interface FileInputProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

export function FileInput({ files, setFiles }: FileInputProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  }, [files, setFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-sage-700">
        Attachments
      </label>
      
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-sage-200 rounded-lg p-4 text-center hover:border-primary-500 transition-colors"
      >
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="h-8 w-8 text-sage-400" />
          <span className="text-sm text-sage-600">
            Drop files here or click to upload
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <ul className="mt-3 divide-y divide-sage-100">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-sage-600">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-sage-400 hover:text-sage-600"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}