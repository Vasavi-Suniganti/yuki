import { X, ArrowUpRight, Snowflake } from 'lucide-react';
import { Link } from 'react-router-dom';

const menuItems = [
  { num: '01', title: 'Home', path: '/' },
  { num: '02', title: 'Discover', path: '/explore' },
  { num: '03', title: 'Expeditions', path: '/expeditions' },
  { num: '04', title: 'Globe', path: '/map' },
  { num: '05', title: 'Datasets', path: '/datasets' },
  { num: '06', title: 'Science Papers', path: '/publications' },
  { num: '07', title: 'Yuki AI', path: '/ai' },
  { num: '08', title: 'Platform Lab', path: '/platform' },
];

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullscreenMenu({ isOpen, onClose }: FullscreenMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#edf2f4]/95 p-6 text-[#183647] backdrop-blur-2xl transition-all duration-500 sm:p-12"
      role="dialog"
      aria-modal="true"
    >
      {/* Menu Header Top Bar */}
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between">
        <Link to="/" onClick={onClose} className="flex items-center gap-2 text-xl font-extrabold tracking-widest text-[#183647]">
          <Snowflake className="h-6 w-6 text-[#487b91]" />
          <span>Yuki</span>
        </Link>
        <span className="hidden text-xs font-semibold tracking-[0.25em] text-[#487b91] md:block">
          POLAR SCIENCE & EXPEDITION INTELLIGENCE
        </span>
        <button
          onClick={onClose}
          aria-label="Close navigation menu"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#183647]/20 text-[#183647] transition hover:bg-[#183647] hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links Grid */}
      <div className="mx-auto my-auto w-full max-w-4xl py-8">
        <nav className="grid gap-2 sm:grid-cols-2 sm:gap-x-12">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="group flex items-center justify-between border-b border-[#183647]/15 py-4 transition-all duration-300 hover:pl-3"
            >
              <div className="flex items-baseline gap-4">
                <span className="text-xs font-mono font-bold text-[#487b91]">{item.num}</span>
                <span className="text-2xl font-light tracking-tight text-[#183647] group-hover:text-[#487b91] sm:text-3xl lg:text-4xl">
                  {item.title}
                </span>
              </div>
              <ArrowUpRight className="h-5 w-5 text-[#487b91] opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </nav>
      </div>

      {/* Menu Footer Bar */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-between border-t border-[#183647]/15 pt-6 text-xs text-[#487b91] sm:flex-row sm:items-center">
        <span>ANTARCTICA / ARCTIC / HIGH ALTITUDE MOUNTAIN REGIONS</span>
        <span className="mt-2 sm:mt-0">© Yuki SCIENTIFIC PLATFORM</span>
      </div>
    </div>
  );
}
