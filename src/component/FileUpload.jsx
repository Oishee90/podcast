"use client";

import { useState, useRef } from "react";
import { FiUpload, FiX } from "react-icons/fi";

export default function FileUpload({ onUpload, resetAll }) {
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null); // 🔥 input access korar jonno

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setFileName(file.name);
    onUpload(file);
  };

  const handleRemove = () => {
    setFileName(null);
    onUpload(null);
    resetAll(); // 🔥 This will abort + reset everything
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {!fileName ? (
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="
            cursor-pointer flex flex-col items-center justify-center
            border-2 border-dashed border-gray-300 
            rounded-xl p-12 w-full
            transition hover:border-blue-500 bg-white
          "
        >
          <FiUpload className="text-5xl text-gray-400 mb-4" />

          <p className="text-lg font-semibold text-gray-700">
            Select Audio File
          </p>

          <p className="text-gray-500 text-sm mt-1">
            Drag and drop or click to browse
          </p>

          <div className="mt-4 bg-gray-100 px-4 py-1 rounded-full text-sm text-gray-600">
            Supported formats: <span className="font-semibold">MP3, WAV</span>
          </div>

          <input
            ref={fileInputRef} // 🔥 reference added
            type="file"
            accept="audio/mp3,audio/wav"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl border border-gray-300">
          <p className="text-gray-700 font-medium truncate max-w-[70%]">
            {fileName}
          </p>

          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 transition"
          >
            <FiX className="text-2xl" />
          </button>
        </div>
      )}
    </div>
  );
}
