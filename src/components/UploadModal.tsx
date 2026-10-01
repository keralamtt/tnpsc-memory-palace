import React, { useRef, useState } from 'react';
import { Upload, X, Film, Check, Sparkles } from 'lucide-react';
import { SAMPLE_VIDEOS } from '../data/sampleVideos';
import { SampleVideoPreset } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (file: File) => void;
  onSelectPreset: (preset: SampleVideoPreset) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSelectFile,
  onSelectPreset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        onSelectFile(file);
        onClose();
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onSelectFile(e.target.files[0]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-950 border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-100 font-serif">
              Upload or Select Video for TNPSC Analysis
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Gemini Vision analyzes each visual scene, detects real-world objects/events, and maps them to TNPSC syllabus topics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-amber-500 bg-amber-500/10'
              : 'border-stone-800 hover:border-stone-700 bg-stone-900/40 hover:bg-stone-900/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/mkv,video/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400 mx-auto mb-3 shadow-inner">
            <Upload className="w-6 h-6" />
          </div>

          <h3 className="text-sm font-semibold text-stone-200">
            Click to upload or drag & drop video
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Supports MP4, WebM, MOV (Educational clips, nature recordings, documentaries, campus walk-throughs)
          </p>
          <div className="text-[11px] text-stone-500 mt-2">
            Frames will be sampled automatically for TNPSC syllabus object detection.
          </div>
        </div>

        {/* Curated Sample Videos (Ready-to-test) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Or Choose a Curated TNPSC Syllabus Sample Video</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SAMPLE_VIDEOS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-900 text-left transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-semibold text-amber-400">
                    {preset.category}
                  </span>
                  <span className="font-mono text-[10px] text-stone-500 bg-stone-950 px-1.5 py-0.5 rounded border border-stone-800">
                    00:0{preset.durationSec}
                  </span>
                </div>
                <div className="text-xs font-semibold text-stone-200 group-hover:text-amber-300 transition-colors">
                  {preset.title}
                </div>
                <p className="text-[11px] text-stone-400 line-clamp-2 mt-1">
                  {preset.description}
                </p>
                <div className="text-[10px] text-stone-500 mt-2 flex items-center gap-1.5">
                  <Film className="w-3 h-3 text-stone-400" />
                  <span>{preset.sampleConcepts.length} syllabus concepts mapped</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
