import { useEffect, useState } from 'react';
import * as THREE from 'three';

interface LoaderProps {
  onLoaded: () => void;
}

export function Loader({ onLoaded }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let currentProgress = 0;

    THREE.DefaultLoadingManager.onProgress = (_, itemsLoaded, itemsTotal) => {
      const p = Math.round((itemsLoaded / itemsTotal) * 100);
      currentProgress = Math.max(currentProgress, p);
      setProgress(currentProgress);
    };

    THREE.DefaultLoadingManager.onLoad = () => {
      setProgress(100);
    };

    // Fast step sequence ensuring smooth progress display 0 -> 17 -> 39 -> 63 -> 82 -> 100
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const steps = [0, 17, 39, 63, 82, 100];
        const nextStep = steps.find((s) => s > prev) ?? 100;
        return nextStep;
      });
    }, 180);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer1 = setTimeout(() => setFade(true), 250);
      const timer2 = setTimeout(() => {
        setHidden(true);
        onLoaded();
      }, 750);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [progress, onLoaded]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#edf2f4] text-[#183647] transition-opacity duration-500 ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      <div className="flex items-center gap-4 text-[#183647]">
        <span className="text-sm font-black tracking-[0.35em]">Yuki</span>
        <div className="h-6 w-[1px] animate-pulse bg-[#487b91]" />
      </div>

      <div className="mt-8 flex items-baseline gap-4">
        <span className="text-6xl font-light tracking-tighter sm:text-8xl">
          {String(progress).padStart(2, '0')}
        </span>
        <span className="text-xs font-semibold tracking-[0.2em] text-[#487b91] uppercase">
          LOADING CINEMATIC MOUNTAIN
        </span>
      </div>

      <div className="mt-10 h-[2px] w-48 overflow-hidden rounded-full bg-[#183647]/10">
        <div
          className="h-full bg-[#487b91] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
