import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Play, Square, AlertCircle, RefreshCw } from 'lucide-react';

interface VideoRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoRecorded: (blob: Blob) => void;
}

export const VideoRecorderModal: React.FC<VideoRecorderModalProps> = ({
  isOpen,
  onClose,
  onVideoRecorded,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' },
        audio: false,
      });
      setStream(s);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = s;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setErrorMsg(
        'Unable to access camera. Please check camera permissions in your browser or device settings.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    setRecordedBlob(null);
  };

  const startRecording = () => {
    if (!stream) return;
    recordedChunksRef.current = [];
    setRecordedBlob(null);
    setRecordingSeconds(0);

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : 'video/mp4';

    try {
      const mr = new MediaRecorder(stream, { mimeType });
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mr.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: mr.mimeType || 'video/webm',
        });
        setRecordedBlob(blob);
      };

      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 20) {
            stopRecording();
            return 20;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      setErrorMsg(`Recording failed to initialize: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const handleUseVideo = () => {
    if (recordedBlob) {
      onVideoRecorded(recordedBlob);
      stopCamera();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-950 border border-stone-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-stone-100 font-serif">
              Record Scene with Camera
            </h2>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg ? (
          <div className="p-6 bg-stone-900/80 border border-red-500/30 rounded-xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-xs text-red-200">{errorMsg}</p>
            <button
              onClick={startCamera}
              className="px-3 py-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Camera</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Live Camera Viewfinder */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-stone-800">
              <video
                ref={videoPreviewRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Recording Status Badge */}
              {isRecording && (
                <div className="absolute top-3 left-3 bg-red-600/90 text-white font-mono text-xs px-2.5 py-1 rounded-md flex items-center gap-2 shadow-lg animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>REC 00:{recordingSeconds.toString().padStart(2, '0')}</span>
                </div>
              )}

              {/* Target Guidelines */}
              <div className="absolute inset-4 border border-dashed border-white/20 rounded-lg pointer-events-none flex items-center justify-center">
                <span className="text-[11px] text-white/50 bg-black/40 px-2 py-0.5 rounded">
                  Point at plants, leaves, water flow, machines or landmarks
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-stone-400">
                {recordedBlob ? 'Video recorded!' : isRecording ? 'Recording (max 20s)...' : 'Ready to record'}
              </div>

              <div className="flex items-center gap-2">
                {!isRecording && !recordedBlob && (
                  <button
                    onClick={startRecording}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-red-600/20"
                  >
                    <span className="w-3 h-3 rounded-full bg-white" />
                    <span>Start Recording</span>
                  </button>
                )}

                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Square className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    <span>Stop Recording</span>
                  </button>
                )}

                {recordedBlob && (
                  <button
                    onClick={handleUseVideo}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-stone-950" />
                    <span>Analyze This Clip</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
