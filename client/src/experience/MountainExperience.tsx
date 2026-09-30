import { useRef, useState } from 'react';
import { Header } from '../components/Header';
import { Loader } from '../components/Loader';
import { ScrollIndicator } from '../components/ScrollIndicator';
import { HomeContent } from '../components/HomeContent';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { LandingBackgroundVideo } from '../components/LandingBackgroundVideo';

export function MountainExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress } = useScrollProgress(containerRef);
  const [isLoaded, setIsLoaded] = useState(false);

  const p = Math.max(0, Math.min(1, progress));

  return (
    <div className="relative bg-transparent text-[#183647]">
      {/* Fullscreen cinematic preloader */}
      <Loader onLoaded={() => setIsLoaded(true)} />

      {/* Transparent fixed header */}
      <Header />

      {/* Scroll-down indicator (fades after scroll starts) */}
      <ScrollIndicator progress={p} />

      {/* ─── Fixed Fullscreen Background Continuous Moving Polar Video (Landing Page Only) ─── */}
      <LandingBackgroundVideo
        src="/polar_scroll_video.mp4"
        className="opacity-90"
      />

      {/* ─── Virtual Scroll Space & Landing Page Content ─── */}
      <div ref={containerRef} className="relative z-10 w-full">
        <HomeContent />
      </div>
    </div>
  );
}
