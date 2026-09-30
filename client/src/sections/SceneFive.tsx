import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Database, Compass } from 'lucide-react';

interface SceneProps { progress: number; }
export function SceneFive({ progress }: SceneProps) {
  const visible = progress >= 0.78;
  return (
    <div className={`fixed left-[7vw] top-[30vh] z-20 max-w-2xl transition-all duration-700 ${visible ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-28px)' }}>
      <div className="text-[11px] font-bold tracking-[0.3em] text-[#487b91] uppercase">05 / HORIZON</div>
      <h2 className="mt-3 text-[clamp(2.4rem,7vw,5rem)] font-light leading-[0.95] tracking-tight text-[#183647]">
        THE SUMMIT<br />REVEAL
      </h2>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-[#487b91]">
        An endless panorama of polar mountain ranges. Discover expeditions, scientific datasets, and interactive exploration tools.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/explore" className="inline-flex items-center gap-2 rounded-full bg-[#183647] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#254d63]">
          <Compass size={16} /> Explore <ArrowRight size={14} />
        </Link>
        <Link to="/map" className="inline-flex items-center gap-2 rounded-full border border-[#183647]/25 bg-white/50 px-5 py-3 text-sm font-semibold text-[#183647] backdrop-blur-md transition hover:bg-white/70">
          <Globe size={16} /> Globe
        </Link>
        <Link to="/datasets" className="inline-flex items-center gap-2 rounded-full border border-[#183647]/25 bg-white/50 px-5 py-3 text-sm font-semibold text-[#183647] backdrop-blur-md transition hover:bg-white/70">
          <Database size={16} /> Datasets
        </Link>
      </div>
    </div>
  );
}
