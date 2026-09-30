import { useEffect, useRef } from 'react';

interface AuthBackgroundVideoProps {
  src?: string;
  className?: string;
}

/**
 * AuthBackgroundVideo
 *
 * Dedicated ambient moving background video strictly for Authentication (Sign In & Sign Up):
 * - Continuous smooth autoplay (muted, loop, playsInline)
 * - Calibrated playback speed (0.75x) for a calm, premium scientific feel
 * - Full viewport fixed coverage behind the auth card
 * - Atmospheric glass tint for optimal readability
 * - Isolated exclusively to authentication screens
 */
export function AuthBackgroundVideo({
  src = '/video_for_signups.mp4',
  className = '',
}: AuthBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setSmoothPlayback = () => {
      video.playbackRate = 0.75;
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
      className="auth-bg-video-layer fixed inset-0 z-0 h-screen w-screen overflow-hidden pointer-events-none"
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
        <source src="/assets/videos/video_for_signups.mp4" type="video/mp4" />
        <source src="/scroll_video/video_for_signups.mp4" type="video/mp4" />
      </video>

      {/* Subtle polar ambient overlay for depth and card contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(220, 233, 237, 0.25) 0%, rgba(24, 54, 71, 0.15) 50%, rgba(220, 233, 237, 0.3) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
