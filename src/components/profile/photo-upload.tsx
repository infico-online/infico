'use client';

import {  Camera  } from "lucide-react";

interface PhotoUploadProps {
  onUpload: (file: File) => void;
  label?: string;
}

function PhotoUpload({ onUpload, label = "Upload Photo" }: PhotoUploadProps) {
  return (
    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors">
      <Camera className="h-5 w-5 text-gray-400" />
      <span className="text-xs text-gray-400">{label}</span>
      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
        if (e.target.files?.[0]) {
          onUpload(e.target.files[0]);
        }
      }} />
    </label>
  );
}
