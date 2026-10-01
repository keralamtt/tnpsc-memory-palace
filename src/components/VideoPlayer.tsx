import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Sparkles,
  Layers,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { TNPSCConceptItem, VideoFrameData } from '../types';
import { formatSecondsToTimestamp } from '../utils/frameExtractor';

interface VideoPlayerProps {
  videoUrl: string | null;
  videoTitle: string;
  concepts: TNPSCConceptItem[];
  frames: VideoFrameData[];
  currentTime: number;
  onTimeUpdate: (sec: number) => void;
  onSeek: (sec: number) => void;
  activeConcept: TNPSCConceptItem | null;
  onReanalyze: () => void;
  isAnalyzing: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  videoTitle,
  concepts,
  frames,
  currentTime,
  onTimeUpdate,
  onSeek,
  activeConcept,
  onReanalyze,
  isAnalyzing,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [hoveredConcept, setHoveredConcept] = useState<TNPSCConceptItem | null>(null);
  const [cornerPos, setCornerPos] = useState<'top-left' | 'top-right' | 'bottom-left'>('top-left');
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);

  const cycleCornerPos = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cornerPos === 'top-left') setCornerPos('top-right');
    else if (cornerPos === 'top-right') setCornerPos('bottom-left');
    else setCornerPos('top-left');
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Synchronize external seek requests (e.g. from clicking concept card)
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      onTimeUpdate(current);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 1);
    }
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      onSeek(val);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        videoRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      onSeek(0);
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Video Header bar */}
      <div className="px-4 py-2.5 bg-stone-900/90 border-b border-stone-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xs sm:text-sm font-semibold text-stone-200 truncate">
            {videoTitle}
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReanalyze}
            disabled={isAnalyzing}
            className="px-2.5 py-1 text-xs font-medium rounded bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Send video frames to Gemini 3.8 Flash for fresh analysis"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Re-Analyze with AI'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Element Container */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-stone-500 gap-2">
            <div className="w-8 h-8 border-2 border-amber-500/40 border-t-amber-400 rounded-full animate-spin" />
            <span className="text-xs">Loading video scene...</span>
          </div>
        )}

        {/* Big Center Play Overlay when paused */}
        {videoUrl && !isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-stone-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 shadow-xl"
            aria-label="Play video"
          >
            <Play className="w-8 h-8 ml-1" />
          </button>
        )}

        {/* Persistent On-Screen Video Corner Concept Text HUD */}
        {activeConcept && (
          <div
            className={`absolute z-20 transition-all duration-300 max-w-[85%] sm:max-w-sm ${
              cornerPos === 'top-left'
                ? 'top-3 left-3'
                : cornerPos === 'top-right'
                ? 'top-3 right-3'
                : 'bottom-16 left-3'
            }`}
          >
            <div className="bg-stone-950/95 border border-amber-500/50 backdrop-blur-md rounded-xl p-2.5 sm:p-3 shadow-2xl text-left space-y-1.5 ring-1 ring-black/80 group/hud">
              {/* Corner HUD Top Status Row */}
              <div className="flex items-center justify-between gap-2 border-b border-stone-800/80 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <span className="font-mono font-bold text-[10px] sm:text-[11px] text-amber-300 tracking-wider uppercase">
                    {activeConcept.tamilGrammar ? '📜 பொதுத்தமிழ்' : '⚡ TNPSC CONCEPT'} [{activeConcept.timestamp}]
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Corner Position Cycler */}
                  <button
                    onClick={cycleCornerPos}
                    className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-[10px] text-stone-400 hover:text-amber-300 transition-colors border border-stone-800"
                    title={`Move HUD to next corner (Current: ${cornerPos})`}
                  >
                    ⇄ Corner
                  </button>

                  {/* Collapse / Expand Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsHudCollapsed(!isHudCollapsed);
                    }}
                    className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-[10px] text-stone-400 hover:text-stone-200 transition-colors border border-stone-800"
                    title={isHudCollapsed ? 'Expand concept details' : 'Minimize HUD'}
                  >
                    {isHudCollapsed ? '▼' : '▲'}
                  </button>
                </div>
              </div>

              {/* Collapsed view summary */}
              {isHudCollapsed ? (
                <div className="text-xs font-bold text-amber-200 truncate font-serif">
                  {activeConcept.concept}
                </div>
              ) : (
                /* Expanded view */
                <div className="space-y-1.5">
                  {/* Subject and Unit badges */}
                  <div className="flex flex-wrap items-center gap-1 text-[10px]">
                    <span className="font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {activeConcept.subject}
                    </span>
                    <span className="text-stone-400 truncate max-w-[180px]">
                      {activeConcept.unit}
                    </span>
                  </div>

                  {/* Core Syllabus Concept */}
                  <div className="text-xs sm:text-sm font-bold text-stone-100 font-serif leading-tight">
                    {activeConcept.concept}
                  </div>

                  {/* Scene / Spoken Dialogue Trigger */}
                  <div className="text-[11px] text-stone-300 leading-snug line-clamp-2">
                    <span className="text-stone-500 font-medium">
                      {activeConcept.tamilGrammar ? 'Spoken: ' : 'Scene: '}
                    </span>
                    <span className="text-stone-200 italic font-serif">
                      "{activeConcept.detectedObjectOrEvent}"
                    </span>
                  </div>

                  {/* Pure Tamil Word conversion if available */}
                  {activeConcept.tamilGrammar?.pureTamilEquivalent && (
                    <div className="p-1.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-[10px] text-emerald-200 font-medium leading-tight">
                      <span className="text-stone-400">தூய தமிழ்: </span>
                      <span className="text-amber-300 font-semibold">
                        {activeConcept.tamilGrammar.pureTamilEquivalent}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hovered Concept Pin Tooltip */}
        {hoveredConcept && (
          <div
            className="absolute bottom-16 bg-stone-900 border border-amber-500/50 rounded px-2.5 py-1 text-xs text-stone-200 pointer-events-none shadow-xl z-20"
            style={{
              left: `${Math.min(
                85,
                Math.max(15, (hoveredConcept.timestampSec / (duration || 1)) * 100)
              )}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-semibold text-amber-400">
              {hoveredConcept.timestamp} · {hoveredConcept.subject}
            </div>
            <div className="text-[11px] text-stone-300">{hoveredConcept.concept}</div>
          </div>
        )}
      </div>

      {/* Custom Control Deck & Scrubber */}
      <div className="p-3 bg-stone-950 border-t border-stone-800 space-y-2">
        {/* Timeline Bar with Syllabus Concept Markers */}
        <div className="relative flex items-center group/timeline py-1">
          <input
            type="range"
            min={0}
            max={duration || 10}
            step={0.1}
            value={currentTime}
            onChange={handleScrubberChange}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 z-10"
          />

          {/* Progress fill highlight */}
          <div
            className="absolute left-0 h-1.5 bg-amber-500 rounded-lg pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Interactive Concept Pins on Progress Bar */}
          {duration > 0 &&
            concepts.map((c) => {
              const posPercent = (c.timestampSec / duration) * 100;
              const isActive = activeConcept?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeek(c.timestampSec);
                  }}
                  onMouseEnter={() => setHoveredConcept(c)}
                  onMouseLeave={() => setHoveredConcept(null)}
                  className={`absolute -top-1.5 w-3.5 h-3.5 -ml-1.5 rounded-full border-2 transition-transform hover:scale-125 z-20 ${
                    isActive
                      ? 'bg-amber-400 border-white ring-2 ring-amber-400/50 scale-110'
                      : 'bg-emerald-400 border-stone-950 hover:bg-amber-300'
                  }`}
                  style={{ left: `${posPercent}%` }}
                  title={`${c.timestamp}: ${c.concept}`}
                />
              );
            })}
        </div>

        {/* Media Buttons & Controls */}
        <div className="flex items-center justify-between text-xs text-stone-400 pt-0.5">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1 text-stone-200 hover:text-amber-400 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={restartVideo}
              className="p-1 hover:text-stone-200 transition-colors"
              title="Restart from 00:00"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleMute}
              className="p-1 hover:text-stone-200 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Time Stamp Counter */}
            <div className="font-mono text-stone-300 tracking-wider">
              <span>{formatSecondsToTimestamp(currentTime)}</span>
              <span className="text-stone-600 mx-1">/</span>
              <span>{formatSecondsToTimestamp(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Playback Rate Selector */}
            <div className="flex items-center gap-1">
              {[0.75, 1, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    playbackRate === rate
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'hover:text-stone-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <button
              onClick={handleFullscreen}
              className="p-1 hover:text-stone-200 transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Frame Extraction Carousel Bar (Showing sampled visual moments) */}
      {frames.length > 0 && (
        <div className="p-3 bg-stone-900/60 border-t border-stone-800/80">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-stone-300">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Extracted Scene Frames ({frames.length})</span>
            </span>
            <span className="text-[11px] text-stone-500">Click any frame to jump</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-stone-800">
            {frames.map((frame, idx) => {
              const isSelected =
                Math.abs(currentTime - frame.timestampSec) < 1.5;
              const hasConcept = concepts.some(
                (c) => Math.abs(c.timestampSec - frame.timestampSec) < 1.5
              );

              return (
                <button
                  key={idx}
                  onClick={() => onSeek(frame.timestampSec)}
                  className={`relative shrink-0 w-24 h-14 rounded-md overflow-hidden border transition-all text-left group/thumb ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-500/30'
                      : 'border-stone-800 hover:border-stone-600 opacity-80 hover:opacity-100'
                  }`}
                >
                  {frame.imageBase64 ? (
                    <img
                      src={frame.imageBase64}
                      alt={`Frame at ${frame.timestampLabel}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1 justify-between">
                    <span className="font-mono text-[10px] text-stone-200 font-semibold bg-black/60 px-1 rounded">
                      {frame.timestampLabel}
                    </span>
                    {hasConcept && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" title="TNPSC concept detected in this frame" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
