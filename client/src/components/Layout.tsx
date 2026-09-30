import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Snowflake } from 'lucide-react';
import { useLenis } from '../hooks/useLenis';
import { Header } from './Header';

/* Custom cursor for all pages */
function Cursor() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = document.createElement('div');
    el.className = 'cinematic-cursor';
    document.body.appendChild(el);
    const move = (e: MouseEvent) => { el.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`; };
    const over = (e: MouseEvent) => { if ((e.target as HTMLElement).closest('a,button')) el.classList.add('is-link'); };
    const out = () => el.classList.remove('is-link');
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mouseout', out);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); window.removeEventListener('mouseout', out); el.remove(); };
  }, []);
  return null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const isHome = loc.pathname === '/';

  useLenis();

  /* Home page renders its own complete layout with 3D canvas header & footer */
  if (isHome) return <main><Cursor />{children}</main>;

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#dce9ed] via-[#eaf4f8] to-[#d8e8ee] text-[#183647]">
      <Cursor />

      {/* Top Navigation Header */}
      <Header />

      {/* Main content */}
      <main className="relative z-10 pt-20 min-h-[calc(100vh-80px)]">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#183647]/12 bg-[#183647]/90 backdrop-blur-md text-white">
        <div className="section grid gap-8 !py-14 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-lg font-black tracking-[.18em]">
              <Snowflake className="text-[#5abed8]" /> Yuki
            </div>
            <p className="mt-4 max-w-sm text-sm text-white/55 leading-relaxed">
              An immersive, evidence-backed polar science knowledge and outreach ecosystem.
            </p>
          </div>
          <div>
            <div className="text-xs tracking-widest uppercase text-[#5abed8] font-bold mb-4">Explore</div>
            <div className="grid grid-cols-2 gap-2 text-sm text-white/60">
              {[
                ['Expeditions', '/expeditions'],
                ['Datasets', '/datasets'],
                ['Science Papers', '/publications'],
                ['Globe', '/map'],
                ['Yuki AI', '/ai'],
                ['Learn', '/education'],
                ['Platform Lab', '/platform'],
                ['Media', '/news'],
              ].map(([l, p]) => (
                <Link key={p} to={p} className="hover:text-white transition">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs tracking-widest uppercase text-[#5abed8] font-bold mb-4">Platform</div>
            <p className="text-sm text-white/55 leading-relaxed">
              React · Vite · TypeScript · Three.js · React Three Fiber · GSAP · Lenis
            </p>
            <p className="mt-3 text-xs text-white/30 leading-relaxed">
              Demo scientific values are clearly marked and must be replaced with validated institutional sources for production.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
