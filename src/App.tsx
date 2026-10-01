import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Upload,
  Camera,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  Film,
} from 'lucide-react';
import { Header } from './components/Header';
import { VideoPlayer } from './components/VideoPlayer';
import { ConceptTimeline } from './components/ConceptTimeline';
import { UploadModal } from './components/UploadModal';
import { PracticeQuizModal } from './components/PracticeQuizModal';
import { ConceptDeepDiveModal } from './components/ConceptDeepDiveModal';
import { VideoRecorderModal } from './components/VideoRecorderModal';
import { NotesExportModal } from './components/NotesExportModal';
import { TNPSCConceptItem, VideoFrameData, SampleVideoPreset } from './types';
import { SAMPLE_VIDEOS } from './data/sampleVideos';
import { createSampleVideoBlob } from './utils/canvasVideoGenerator';
import { extractVideoKeyframes } from './utils/frameExtractor';

export default function App() {
  // Video & Concept states
  const [videoTitle, setVideoTitle] = useState<string>(
    SAMPLE_VIDEOS[0].title
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<TNPSCConceptItem[]>(
    SAMPLE_VIDEOS[0].sampleConcepts
  );
  const [frames, setFrames] = useState<VideoFrameData[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // App settings & analysis status
  const [examFocus, setExamFocus] = useState<string>('All TNPSC (Group 1, 2, 4)');
  const [showTamilTerms, setShowTamilTerms] = useState<boolean>(true);
  const [samplingInterval, setSamplingInterval] = useState<number>(10.0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<{
    percent: number;
    message: string;
  } | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const [isPracticeQuizOpen, setIsPracticeQuizOpen] = useState<boolean>(false);
  const [isNotesExportOpen, setIsNotesExportOpen] = useState<boolean>(false);
  const [deepDiveConcept, setDeepDiveConcept] = useState<TNPSCConceptItem | null>(null);

  // Current active concept based on video playback (continuous corner text HUD)
  const activeConcept = useMemo(() => {
    if (concepts.length === 0) return null;
    const sorted = [...concepts].sort((a, b) => a.timestampSec - b.timestampSec);
    
    // Find the latest concept whose timestampSec <= currentTime
    let current = sorted[0];
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].timestampSec <= currentTime + 0.6) {
        current = sorted[i];
      } else {
        break;
      }
    }
    return current || sorted[0];
  }, [concepts, currentTime]);

  // Initial load: render default sample video blob (Money Heist Tamil scene)
  useEffect(() => {
    let activeUrl = '';
    const initPreset = async () => {
      try {
        const initialPreset = SAMPLE_VIDEOS[0];
        const blob = await createSampleVideoBlob(
          initialPreset.canvasRenderType,
          initialPreset.durationSec
        );
        activeUrl = URL.createObjectURL(blob);
        setVideoUrl(activeUrl);

        // Extract frames from the generated blob at 10s interval
        const extracted = await extractVideoKeyframes(blob, 10.0);
        setFrames(extracted);
      } catch (err) {
        console.error('Failed to initialize sample video:', err);
      }
    };

    initPreset();

    return () => {
      if (activeUrl) URL.revokeObjectURL(activeUrl);
    };
  }, []);

  // Handle Preset selection
  const handleSelectPreset = async (preset: SampleVideoPreset) => {
    try {
      setIsAnalyzing(true);
      setAnalysisProgress({ percent: 20, message: `Generating ${preset.title} scene...` });
      setVideoTitle(preset.title);
      setConcepts(preset.sampleConcepts);
      setCurrentTime(0);

      const blob = await createSampleVideoBlob(preset.canvasRenderType, preset.durationSec);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      const newUrl = URL.createObjectURL(blob);
      setVideoUrl(newUrl);

      setAnalysisProgress({ percent: 60, message: 'Extracting scene keyframes...' });
      const extracted = await extractVideoKeyframes(blob, samplingInterval);
      setFrames(extracted);

      setAnalysisProgress({ percent: 100, message: 'Ready!' });
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(null);
      }, 400);
    } catch (err: any) {
      console.error('Error loading preset:', err);
      setIsAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  // Run full Gemini Vision analysis on a video File or Blob
  const processAndAnalyzeVideo = async (
    videoBlob: File | Blob,
    title: string
  ) => {
    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      setCurrentTime(0);
      setVideoTitle(title);

      if (videoUrl) URL.revokeObjectURL(videoUrl);
      const newUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(newUrl);

      setAnalysisProgress({ percent: 15, message: 'Scanning video duration & scene transitions...' });

      // Step 1: Extract representative keyframes with dense interval
      const extractedFrames = await extractVideoKeyframes(
        videoBlob,
        samplingInterval,
        (percent, message) => {
          setAnalysisProgress({
            percent: Math.min(65, Math.round(15 + percent * 0.5)),
            message,
          });
        }
      );
      setFrames(extractedFrames);

      // Step 2: Send to server-side Gemini 3.8 Flash endpoint
      setAnalysisProgress({
        percent: 70,
        message: 'Analyzing visual scenes & objects with Gemini Vision...',
      });

      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frames: extractedFrames,
          videoTitle: title,
          examFocus,
          preferredLanguage: showTamilTerms ? 'bilingual' : 'english',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze video scenes.');
      }

      setAnalysisProgress({
        percent: 95,
        message: 'Synthesizing TNPSC Samacheer Kalvi syllabus & MCQs...',
      });

      setConcepts(data.concepts);

      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(null);
      }, 500);
    } catch (err: any) {
      console.error('Video analysis failed:', err);
      setAnalysisError(err.message || 'An error occurred during video analysis.');
      setIsAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  // Re-analyze currently loaded frames with Gemini
  const handleReanalyzeCurrent = async () => {
    if (frames.length === 0) return;
    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      setAnalysisProgress({
        percent: 40,
        message: 'Re-analyzing frames with Gemini 3.8 Flash...',
      });

      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frames,
          videoTitle,
          examFocus,
          preferredLanguage: showTamilTerms ? 'bilingual' : 'english',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Re-analysis failed.');
      }

      setConcepts(data.concepts);
      setAnalysisProgress({ percent: 100, message: 'Done!' });
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(null);
      }, 400);
    } catch (err: any) {
      console.error('Re-analysis error:', err);
      setAnalysisError(err.message || 'Re-analysis failed.');
      setIsAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        examFocus={examFocus}
        setExamFocus={setExamFocus}
        showTamilTerms={showTamilTerms}
        setShowTamilTerms={setShowTamilTerms}
        samplingInterval={samplingInterval}
        setSamplingInterval={setSamplingInterval}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenRecord={() => setIsRecordModalOpen(true)}
        onOpenPractice={() => setIsPracticeQuizOpen(true)}
        onOpenExport={() => setIsNotesExportOpen(true)}
        conceptCount={concepts.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Editorial Hero Banner */}
        <section className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>TNPSC Visual Scene-to-Syllabus Learning Engine</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-100 font-serif">
                Connect Real-World Video Scenes Directly to TNPSC Concepts & MCQs
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Upload any educational or real-world video. The AI analyzes visual scenes, detects key objects or events, maps them to TNPSC syllabus units (Science, Geography, History, Polity, Economy, Unit 8 & 9), and generates instant exam-standard MCQs.
              </p>
            </div>

            {/* Visual Flow Indicator */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3 shrink-0 flex flex-wrap sm:flex-nowrap items-center gap-2 text-[11px] text-stone-400">
              <div className="flex items-center gap-1.5 font-medium text-stone-300">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>Video Scene</span>
              </div>
              <ArrowRight className="w-3 h-3 text-stone-600 shrink-0" />
              <div className="flex items-center gap-1.5 font-medium text-stone-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Detected Object</span>
              </div>
              <ArrowRight className="w-3 h-3 text-stone-600 shrink-0" />
              <div className="flex items-center gap-1.5 font-medium text-stone-300">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>TNPSC Unit</span>
              </div>
              <ArrowRight className="w-3 h-3 text-stone-600 shrink-0" />
              <div className="flex items-center gap-1.5 font-medium text-amber-300 font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Exam MCQ</span>
              </div>
            </div>
          </div>
        </section>

        {/* Real-time Analysis Progress Banner */}
        {isAnalyzing && analysisProgress && (
          <div className="bg-stone-900 border border-amber-500/40 rounded-xl p-4 shadow-xl space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                <span>{analysisProgress.message}</span>
              </span>
              <span className="font-mono text-stone-400 font-semibold">
                {analysisProgress.percent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Notification */}
        {analysisError && (
          <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 flex items-start gap-3 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-red-300">Analysis Notification</div>
              <p>{analysisError}</p>
            </div>
          </div>
        )}

        {/* Main Content Workspace: Two-column responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Video Player & Extraction Strip */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            <VideoPlayer
              videoUrl={videoUrl}
              videoTitle={videoTitle}
              concepts={concepts}
              frames={frames}
              currentTime={currentTime}
              onTimeUpdate={(t) => setCurrentTime(t)}
              onSeek={(t) => setCurrentTime(t)}
              activeConcept={activeConcept}
              onReanalyze={handleReanalyzeCurrent}
              isAnalyzing={isAnalyzing}
            />

            {/* Video Quick Stats & Controls */}
            <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400 font-medium">Syllabus Density</span>
                <span className="font-semibold text-stone-200">
                  {concepts.length} Concepts Identified
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-800/80">
                <span className="text-stone-400 font-medium">Target Exam Format</span>
                <span className="text-amber-400 font-medium">{examFocus}</span>
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setIsPracticeQuizOpen(true)}
                  disabled={concepts.length === 0}
                  className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Start Mock Test</span>
                </button>

                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="py-2 px-3 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>New Video</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Concept Timeline & Interactive MCQs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-100 font-serif">
                  Identified TNPSC Syllabus Concepts
                </h3>
                <span className="text-xs font-semibold text-stone-400 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded-full">
                  {concepts.length}
                </span>
              </div>

              <div className="text-xs text-stone-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Click timestamps to jump video</span>
              </div>
            </div>

            <ConceptTimeline
              concepts={concepts}
              currentTime={currentTime}
              onSeekToScene={(sec) => setCurrentTime(sec)}
              showTamilTerms={showTamilTerms}
              onOpenDeepDive={(item) => setDeepDiveConcept(item)}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-6 mt-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-300">TNPSC VidyaLens</span>
            <span>·</span>
            <span>Empowering Tamil Nadu Public Service Commission Aspirants</span>
          </div>
          <div>
            <span>Aligned with Tamil Nadu Samacheer Kalvi Curriculum & TNPSC Exam Patterns</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSelectFile={(file) => processAndAnalyzeVideo(file, file.name)}
        onSelectPreset={handleSelectPreset}
      />

      <VideoRecorderModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onVideoRecorded={(blob) =>
          processAndAnalyzeVideo(blob, `Camera Clip ${new Date().toLocaleTimeString()}`)
        }
      />

      <PracticeQuizModal
        isOpen={isPracticeQuizOpen}
        onClose={() => setIsPracticeQuizOpen(false)}
        concepts={concepts}
      />

      <ConceptDeepDiveModal
        concept={deepDiveConcept}
        onClose={() => setDeepDiveConcept(null)}
      />

      <NotesExportModal
        isOpen={isNotesExportOpen}
        onClose={() => setIsNotesExportOpen(false)}
        videoTitle={videoTitle}
        concepts={concepts}
      />
    </div>
  );
}
