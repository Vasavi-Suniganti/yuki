interface SceneProps { progress: number; }
export function SceneThree({ progress }: SceneProps) {
  const visible = progress >= 0.38 && progress < 0.58;
  return (
    <div className="pointer-events-none fixed left-[7vw] top-[36vh] z-20 max-w-xl transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-28px)' }}>
      <div className="text-[11px] font-bold tracking-[0.3em] text-[#487b91] uppercase">03 / PERSPECTIVE</div>
      <h2 className="mt-3 text-[clamp(2.4rem,7vw,5rem)] font-light leading-[0.95] tracking-tight text-[#183647]">
        GLACIAL<br />SANCTUARY
      </h2>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#487b91]">
        Rising above silent alpine valleys reveals ancient glacial flows and pristine summits untouched by time.
      </p>
    </div>
  );
}
