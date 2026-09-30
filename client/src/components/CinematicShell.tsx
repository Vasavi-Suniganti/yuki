import { useEffect, useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const menuLinks = [
  ['01', 'Home', '/'],
  ['02', 'Explore', '/explore'],
  ['03', 'Expeditions', '/expeditions'],
  ['04', 'Science', '/publications'],
  ['05', 'Data', '/datasets'],
  ['06', 'Media', '/media'],
  ['07', 'Contact', '/news'],
];

export function CinematicLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(100, Math.round(((now - start) / 1800) * 100));
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
      else window.setTimeout(() => setVisible(false), 450);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  if (!visible) return null;
  return <div className="cinematic-loader" aria-label={`Loading Yuki ${progress}%`} role="status">
    <div className="loader-mark"><span>Yuki</span><i /></div>
    <div className="loader-progress"><span>{String(progress).padStart(2, '0')}</span><small>Loading polar intelligence</small></div>
  </div>;
}

export function CinematicCursor() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const cursor = document.createElement('div');
    cursor.className = 'cinematic-cursor';
    document.body.appendChild(cursor);
    const move = (event: MouseEvent) => { cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`; };
    const over = (event: MouseEvent) => { if ((event.target as HTMLElement).closest('a,button')) cursor.classList.add('is-link'); };
    const out = () => cursor.classList.remove('is-link');
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mouseout', out);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); window.removeEventListener('mouseout', out); cursor.remove(); };
  }, []);
  return null;
}

export function CinematicMenu() {
  const [open, setOpen] = useState(false);
  return <>
    <button className="cinematic-menu-trigger" onClick={() => setOpen(true)} aria-label="Open navigation menu"><span>MENU</span><MenuIcon size={17} /></button>
    <div className={`cinematic-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="cinematic-menu-top"><span className="menu-kicker">Yuki / FIELD INTELLIGENCE</span><button onClick={() => setOpen(false)} aria-label="Close navigation menu"><X size={20} /></button></div>
      <nav>{menuLinks.map(([number, label, path]) => <Link key={path} to={path} onClick={() => setOpen(false)}><small>{number}</small><span>{label}</span><i>↗</i></Link>)}</nav>
      <div className="menu-footer">ANTARCTICA / ARCTIC / SOUTHERN OCEAN</div>
    </div>
  </>;
}
