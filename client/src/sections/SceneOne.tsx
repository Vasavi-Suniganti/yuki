interface SceneProps {
  progress: number;
}

export function SceneOne({ progress }: SceneProps) {
  const visible = progress >= 0 && progress < 0.18;
  return (
    <div
      className="pointer-events-none fixed left-[7vw] top-[40vh] z-20 max-w-xl transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-28px)' }}
    >
      <div className="text-[11px] font-bold tracking-[0.3em] text-[#487b91] uppercase">01 / EXPEDITIONS</div>
      <h1 className="mt-3 text-[clamp(2.4rem,7vw,5rem)] font-light leading-[0.95] tracking-tight text-[#183647]">
        EXPLORING<br />BEYOND<br />BOUNDARIES
      </h1>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#487b91]">
        Step into a realm shaped by extreme elevation, katabatic winds, and unyielding polar research.
      </p>
    </div>
  );
}
