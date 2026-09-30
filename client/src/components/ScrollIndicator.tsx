import { ArrowDown } from 'lucide-react';

interface ScrollIndicatorProps {
  progress: number;
}

export function ScrollIndicator({ progress }: ScrollIndicatorProps) {
  // Fade out as scroll progress increases (hidden past 0.15)
  const opacity = Math.max(0, 1 - progress * 6);

  if (opacity <= 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-10 left-[7vw] z-20 flex flex-col items-start gap-2 transition-opacity duration-300"
      style={{ opacity }}
    >
      <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.25em] text-[#38566a] uppercase">
        <span>SCROLL DOWN TO DISCOVER</span>
        <ArrowDown size={14} className="animate-bounce" />
      </div>

      {/* Thin line indicator animation */}
      <div className="relative h-[2px] w-36 overflow-hidden rounded-full bg-[#183647]/15">
        <div className="absolute inset-y-0 left-0 w-1/2 animate-[pulse-line_2s_infinite] bg-[#487b91]" />
      </div>
    </div>
  );
}
