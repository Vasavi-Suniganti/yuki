interface SceneProps { progress: number; }
export function SceneFour({ progress }: SceneProps) {
  const visible = progress >= 0.58 && progress < 0.78;
  return (
    <div className="pointer-events-none fixed right-[7vw] top-[36vh] z-20 max-w-xl text-right transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-28px)' }}>
      <div className="text-[11px] font-bold tracking-[0.3em] text-[#487b91] uppercase">04 / VALLEYS</div>
      <h2 className="mt-3 text-[clamp(2.4rem,7vw,5rem)] font-light leading-[0.95] tracking-tight text-[#183647]">
        SHADOW<br />& LIGHT
      </h2>
      <p className="ml-auto mt-5 max-w-sm text-sm leading-relaxed text-[#487b91]">
        Deep mountain corridors where cold blue-tinted shadows meet the dazzling brilliance of high-altitude sunlight.
      </p>
    </div>
  );
}
