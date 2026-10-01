import React from 'react';
import { BookOpen, Video, Camera, Award, FileDown, Sparkles } from 'lucide-react';

interface HeaderProps {
  examFocus: string;
  setExamFocus: (focus: string) => void;
  showTamilTerms: boolean;
  setShowTamilTerms: (val: boolean) => void;
  samplingInterval: number;
  setSamplingInterval: (sec: number) => void;
  onOpenUpload: () => void;
  onOpenRecord: () => void;
  onOpenPractice: () => void;
  onOpenExport: () => void;
  conceptCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  examFocus,
  setExamFocus,
  showTamilTerms,
  setShowTamilTerms,
  samplingInterval,
  setSamplingInterval,
  onOpenUpload,
  onOpenRecord,
  onOpenPractice,
  onOpenExport,
  conceptCount,
}) => {
  return (
    <header className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-stone-100 font-serif">
                  TNPSC VidyaLens
                </h1>
                <span className="text-xs text-amber-400 font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  Video → Syllabus AI
                </span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1.5 mt-0.5">
                <span>Visual Scene Analysis</span>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span>Samacheer Kalvi Mapping</span>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span>Exam-Grade MCQs</span>
              </p>
            </div>
          </div>

          {/* Right Controls & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Exam Target Selector */}
            <div className="flex items-center gap-1.5 text-xs text-stone-300 bg-stone-900 border border-stone-800 rounded-md px-2.5 py-1.5">
              <span className="text-stone-500 font-medium">Target:</span>
              <select
                value={examFocus}
                onChange={(e) => setExamFocus(e.target.value)}
                className="bg-transparent text-stone-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All TNPSC (Group 1, 2, 4)" className="bg-stone-900 text-stone-200">
                  All TNPSC (Gr 1, 2, 4)
                </option>
                <option value="Group 1 (Prelims & Mains)" className="bg-stone-900 text-stone-200">
                  TNPSC Group 1
                </option>
                <option value="Group 2 & 2A Services" className="bg-stone-900 text-stone-200">
                  TNPSC Group 2 & 2A
                </option>
                <option value="Group 4 & VAO Examination" className="bg-stone-900 text-stone-200">
                  TNPSC Group 4 & VAO
                </option>
              </select>
            </div>

            {/* Sampling Interval Selector */}
            <div className="flex items-center gap-1 text-xs text-stone-300 bg-stone-900 border border-stone-800 rounded-md px-2 py-1">
              <span className="text-stone-500 font-medium">Interval:</span>
              <button
                onClick={() => setSamplingInterval(samplingInterval === 10 ? 5 : 10)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  samplingInterval === 10
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Extracts concepts at clean 10-second intervals (00:00, 00:10, 00:20...)"
              >
                {samplingInterval === 10 ? '⏱️ 10s Interval' : '⚡ 5s Interval'}
              </button>
            </div>

            {/* Tamil / Bilingual Script Toggle */}
            <button
              onClick={() => setShowTamilTerms(!showTamilTerms)}
              className={`text-xs px-2.5 py-1.5 rounded-md border transition-colors flex items-center gap-1.5 font-medium ${
                showTamilTerms
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="Toggle bilingual Tamil syllabus keywords"
            >
              <span className="font-semibold">தமிழ்</span>
              <span>{showTamilTerms ? 'Active' : 'Bilingual'}</span>
            </button>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 border-l border-stone-800 pl-2">
              <button
                onClick={onOpenUpload}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-stone-800 hover:bg-stone-700 text-stone-100 transition-colors flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5 text-stone-300" />
                <span>Upload</span>
              </button>

              <button
                onClick={onOpenRecord}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-stone-800 hover:bg-stone-700 text-stone-100 transition-colors flex items-center gap-1.5"
                title="Record short video from camera"
              >
                <Camera className="w-3.5 h-3.5 text-stone-300" />
                <span className="hidden sm:inline">Camera</span>
              </button>

              {conceptCount > 0 && (
                <>
                  <button
                    onClick={onOpenPractice}
                    className="px-3 py-1.5 text-xs font-semibold rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Practice Test ({conceptCount})</span>
                  </button>

                  <button
                    onClick={onOpenExport}
                    className="p-1.5 text-xs rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                    title="Export study notes"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
