import { VideoFrameData } from '../types';

export function formatSecondsToTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export async function extractVideoKeyframes(
  videoSource: File | Blob | string,
  targetIntervalSec: number = 10.0,
  onProgress?: (percent: number, message: string) => void
): Promise<VideoFrameData[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let videoUrl = '';

    const cleanUp = () => {
      if (typeof videoSource !== 'string' && videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      video.remove();
      canvas.remove();
    };

    if (typeof videoSource === 'string') {
      videoUrl = videoSource;
    } else if (videoSource) {
      videoUrl = URL.createObjectURL(videoSource);
    }

    if (videoUrl) {
      video.src = videoUrl;
    } else {
      cleanUp();
      reject(new Error('Invalid video source provided.'));
      return;
    }

    const frames: VideoFrameData[] = [];

    video.onloadedmetadata = async () => {
      try {
        const duration = Math.max(video.duration || 10, 1);
        // Set canvas dimensions (max width 640 for crisp Gemini multimodal vision processing)
        const scale = Math.min(1, 640 / (video.videoWidth || 640));
        canvas.width = Math.round((video.videoWidth || 640) * scale);
        canvas.height = Math.round((video.videoHeight || 360) * scale);

        // Generate fine-grained timestamp intervals (every 2-3s default)
        const intervals: number[] = [];
        const intervalStep = Math.max(1.5, targetIntervalSec);
        
        // Start near beginning
        intervals.push(0.5);

        for (let t = intervalStep; t < duration - 0.5; t += intervalStep) {
          intervals.push(Number(t.toFixed(1)));
        }

        // Include close to the end if not covered
        if (duration > 3 && intervals[intervals.length - 1] < duration - 2) {
          intervals.push(Number((duration - 0.8).toFixed(1)));
        }

        // Limit maximum frames to 20 to preserve optimal latency
        const finalIntervals = intervals.slice(0, 20);

        onProgress?.(10, `Loaded video (${Math.round(duration)}s). Extracting ${finalIntervals.length} fine-interval frames (every ~${intervalStep}s)...`);

        for (let i = 0; i < finalIntervals.length; i++) {
          const targetTime = finalIntervals[i];
          await seekToTime(video, targetTime);

          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageBase64 = canvas.toDataURL('image/jpeg', 0.75);
            frames.push({
              timestampSec: Math.round(targetTime),
              timestampLabel: formatSecondsToTimestamp(targetTime),
              imageBase64,
            });
          }

          const pct = 10 + Math.round(((i + 1) / finalIntervals.length) * 55);
          onProgress?.(
            pct,
            `Captured frame ${i + 1}/${finalIntervals.length} at ${formatSecondsToTimestamp(targetTime)}`
          );
        }

        cleanUp();
        resolve(frames);
      } catch (err) {
        cleanUp();
        reject(err);
      }
    };

    video.onerror = () => {
      cleanUp();
      reject(new Error('Unable to read video file. Please check video format.'));
    };
  });
}

function seekToTime(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    let resolved = false;

    const onSeeked = () => {
      if (!resolved) {
        resolved = true;
        video.removeEventListener('seeked', onSeeked);
        resolve();
      }
    };

    video.addEventListener('seeked', onSeeked);
    video.currentTime = time;

    // Fallback if seek event stalls
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        video.removeEventListener('seeked', onSeeked);
        resolve();
      }
    }, 1200);
  });
}
