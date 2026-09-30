interface SceneProps { progress: number; }
export function SceneTwo({ progress }: SceneProps) {
  const visible = progress >= 0.18 && progress < 0.38;
  return (
    <div className="pointer-events-none fixed right-[7vw] top-[36vh] z-20 max-w-xl text-right transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-28px)' }}>
      <div className="text-[11px] font-bold tracking-[0.3em] text-[#487b91] uppercase">02 / ELEVATION</div>
      <h2 className="mt-3 text-[clamp(2.4rem,7vw,5rem)] font-light leading-[0.95] tracking-tight text-[#183647]">
        RIDGE OF<br />WHISPERS
      </h2>
      <p className="ml-auto mt-5 max-w-sm text-sm leading-relaxed text-[#487b91]">
        Navigating sheer rocky cliff faces where katabatic winds sculpt frozen architectural monuments.
      </p>
    </div>
  );
}
