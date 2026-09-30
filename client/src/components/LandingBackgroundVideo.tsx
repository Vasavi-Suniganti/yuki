import { useEffect, useRef } from 'react';

interface LandingBackgroundVideoProps {
  src?: string;
  className?: string;
}

/**
 * LandingBackgroundVideo
 *
 * Dedicated moving background video strictly for the Public Landing Page:
 * - Plays continuously
 * - Slow and smooth (playbackRate ~0.65)
 * - Autoplay, muted, loop, playsInline
 * - Fixed fullscreen background layer behind all landing page content
 * - Remains visible throughout the entire landing page scroll
 * - No scroll-to-video / playhead scrub logic
 * - Stable playback without rerender restarts
 */
export function LandingBackgroundVideo({
  src = '/polar_scroll_video.mp4',
  className = '',
}: LandingBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setSmoothPlayback = () => {
      video.playbackRate = 0.65;
    };

    video.addEventListener('loadedmetadata', setSmoothPlayback);
    video.addEventListener('canplay', setSmoothPlayback);
    if (video.readyState >= 1) {
      setSmoothPlayback();
    }

    video.play().catch(() => {
      // Browsers allow muted autoplay
    });

    return () => {
      video.removeEventListener('loadedmetadata', setSmoothPlayback);
      video.removeEventListener('canplay', setSmoothPlayback);
    };
  }, []);

  return (
    <div
      className="landing-bg-video-layer fixed inset-0 z-0 h-screen w-screen overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`w-full h-full object-cover pointer-events-none ${className}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src={src} type="video/mp4" />
        <source src="/assets/videos/polar_scroll_video.mp4" type="video/mp4" />
        <source src="/scroll_video/Aerial_view_of_Antarctic_landscape_20260930141922.mp4" type="video/mp4" />
      </video>

      {/* Atmospheric gradient overlay for optimal text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(7, 29, 51, 0.35) 0%, rgba(7, 29, 51, 0.15) 45%, rgba(7, 29, 51, 0.45) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
