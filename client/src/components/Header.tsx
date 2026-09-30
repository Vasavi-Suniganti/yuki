import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, UserRound, LogOut, Snowflake, Bell, X, CheckCircle2, FileText, ShieldCheck, ChevronDown, User, Settings } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { FullscreenMenu } from './FullscreenMenu';
import { getRoleHomeRoute } from './ProtectedRoute';

const mockNotifications = [
  { id: 'n1', type: 'approval', icon: CheckCircle2, title: 'Dataset Approved', message: 'East Antarctic Temperature Series v2.1 is now published.', time: '2h ago', read: false },
  { id: 'n2', type: 'submission', icon: FileText, title: 'Review Feedback', message: 'Dr. Scientific Reviewer left comments on your paper submission.', time: '1d ago', read: false },
  { id: 'n3', type: 'system', icon: ShieldCheck, title: 'Role Updated', message: 'Your account role has been updated to RESEARCHER by Admin.', time: '3d ago', read: true },
];

function NotificationBell() {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!profile) return null;

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button onClick={() => setOpen(o => !o)}
        className="relative p-2 text-[#487b91] hover:text-[#183647] transition"
        aria-label="Notifications">
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#183647] text-white text-[9px] font-bold">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-[#183647]/15 bg-white/95 shadow-2xl backdrop-blur-xl z-50">
          <div className="flex items-center justify-between border-b border-[#183647]/10 px-4 py-3">
            <span className="text-sm font-bold text-[#183647]">Notifications</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                className="text-xs text-[#487b91] hover:text-[#183647]">Mark all read</button>
              <button onClick={() => setOpen(false)} className="text-[#487b91]"><X size={14} /></button>
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-[#183647]/5">
            {notifications.map(n => (
              <div key={n.id} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                className={`flex gap-3 p-4 cursor-pointer transition hover:bg-slate-50 ${!n.read ? 'bg-blue-50/50' : ''}`}>
                <n.icon size={18} className={`mt-0.5 flex-shrink-0 ${n.type === 'approval' ? 'text-emerald-600' : 'text-[#487b91]'}`} />
                <div>
                  <div className="text-sm font-semibold text-[#183647]">{n.title}</div>
                  <div className="text-xs text-[#487b91] mt-0.5">{n.message}</div>
                  <div className="text-xs text-slate-400 mt-1">{n.time}</div>
                </div>
                {!n.read && <div className="ml-auto h-2 w-2 rounded-full bg-[#487b91] flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UserProfileMenu() {
  const { profile, logout, updateProfileData } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [institution, setInstitution] = useState(profile?.institution || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!profile) return null;

  const roleLabel = profile.role === 'ncpor_admin' || profile.role === 'PLATFORM_ADMIN'
    ? 'OFFICIAL'
    : profile.role === 'researcher_scientist' || profile.role === 'RESEARCHER'
    ? 'RESEARCHER'
    : profile.role === 'media_content' || profile.role === 'MEDIA_MANAGER'
    ? 'MEDIA TEAM'
    : 'STUDENT / VISITOR';

  const homeRoute = getRoleHomeRoute(profile.role);

  const handleSignOut = async () => {
    setOpen(false);
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="hidden items-center gap-2 rounded-full border border-[#183647]/20 bg-white/60 px-4 py-2 text-xs font-semibold text-[#183647] backdrop-blur-md transition hover:bg-[#183647] hover:text-white sm:flex"
      >
        <UserRound size={14} />
        <span>{roleLabel}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[#183647]/15 bg-white/95 p-2 shadow-2xl backdrop-blur-xl z-50">
          <div className="border-b border-[#183647]/10 p-3">
            <div className="text-sm font-bold text-[#183647]">{profile.name}</div>
            <div className="text-xs text-[#487b91]">{profile.email}</div>
            <div className="mt-1 text-[10px] font-mono text-[#487b91]">{profile.institution || 'NCPOR'}</div>
          </div>

          <div className="py-1">
            <Link
              to={homeRoute}
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#183647] hover:bg-slate-100 transition"
            >
              <User size={14} className="text-[#487b91]" /> My Workspace Dashboard
            </Link>
            <button
              onClick={() => { setOpen(false); setShowProfileModal(true); }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#183647] hover:bg-slate-100 transition"
            >
              <UserRound size={14} className="text-[#487b91]" /> View Profile Overview
            </button>
            <button
              onClick={() => { setOpen(false); setShowSettingsModal(true); }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#183647] hover:bg-slate-100 transition"
            >
              <Settings size={14} className="text-[#487b91]" /> Account Settings
            </button>
          </div>

          <div className="border-t border-[#183647]/10 pt-1">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Profile Overview Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
          <div className="w-full max-w-md card space-y-4 bg-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
              <h3 className="text-lg font-bold text-[#183647]">Profile Overview</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-[#487b91]"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-xs text-[#183647]">
              <div><span className="font-bold text-[#487b91]">Name:</span> {profile.name}</div>
              <div><span className="font-bold text-[#487b91]">Email:</span> {profile.email}</div>
              <div><span className="font-bold text-[#487b91]">Role:</span> {roleLabel}</div>
              <div><span className="font-bold text-[#487b91]">Institution:</span> {profile.institution || 'NCPOR'}</div>
              <div><span className="font-bold text-[#487b91]">Bio:</span> {profile.bio || 'Polar science researcher and field scientist.'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Account Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
          <div className="w-full max-w-md card space-y-4 bg-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
              <h3 className="text-lg font-bold text-[#183647]">Account Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-[#487b91]"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Display Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Institution</label>
                <input value={institution} onChange={e => setInstitution(e.target.value)} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
              </div>
              <button
                onClick={async () => {
                  await updateProfileData({ name, institution, bio });
                  setShowSettingsModal(false);
                }}
                className="btn-primary w-full justify-center text-xs"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const landingNavLinks: [string, string][] = [
  ['Discovery', 'discovery'],
  ['3D Explorer', 'explorer'],
  ['Expeditions', 'expeditions'],
  ['Learning', 'learning'],
  ['Scientists', 'scientists'],
  ['Global Impact', 'impact'],
  ['Polar AI', 'polar-ai'],
];

const officialNavLinks: [string, string][] = [
  ['Dashboard', '/admin'],
  ['Expeditions', '/expeditions'],
  ['Verification', '/reviewer'],
  ['Repository', '/explore'],
  ['Analytics', '/platform'],
  ['Outreach', '/media-manager'],
  ['3D Map', '/map'],
];

const researcherNavLinks: [string, string][] = [
  ['Dashboard', '/researcher'],
  ['Expeditions', '/expeditions'],
  ['3D Map', '/map'],
  ['Datasets', '/datasets'],
  ['Publications', '/publications'],
  ['Polar AI', '/ai'],
  ['Outreach', '/media-manager'],
];

const mediaNavLinks: [string, string][] = [
  ['Dashboard', '/media-manager?tab=dashboard'],
  ['Content', '/media-manager?tab=content'],
  ['Media Library', '/media-manager?tab=library'],
  ['AI Studio', '/media-manager?tab=aistudio'],
  ['Campaigns', '/media-manager?tab=campaigns'],
  ['Analytics', '/media-manager?tab=analytics'],
];

const studentNavLinks: [string, string][] = [
  ['Dashboard', '/dashboard'],
  ['Explore', '/explore'],
  ['Expeditions', '/expeditions'],
  ['3D Map', '/map'],
  ['Discover', '/discover'],
  ['Learn', '/education'],
  ['Polar AI', '/ai'],
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('discovery');
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver for active landing page section highlighting
  useEffect(() => {
    if (!isHome || profile) return;

    const sectionIds = landingNavLinks.map(([, id]) => id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0.1,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome, profile, location.pathname]);

  // Scroll into view if arriving with hash anchor
  useEffect(() => {
    if (isHome && location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [isHome, location.hash]);

  const handleLandingNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (!isHome) {
      navigate(`/#${targetId}`);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const currentNavLinks = profile?.role === 'ncpor_admin' || profile?.role === 'PLATFORM_ADMIN'
    ? officialNavLinks
    : profile?.role === 'researcher_scientist' || profile?.role === 'RESEARCHER'
    ? researcherNavLinks
    : profile?.role === 'media_content' || profile?.role === 'MEDIA_MANAGER'
    ? mediaNavLinks
    : studentNavLinks;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 h-20 transition-all duration-300 ${scrolled || !isHome
            ? 'border-b border-[#183647]/12 bg-[#edf2f4]/85 backdrop-blur-xl shadow-sm'
            : 'border-b border-[#183647]/10 bg-[#edf2f4]/25 backdrop-blur-md'
          }`}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-10">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-lg font-black tracking-[0.2em] text-[#183647]">
            <Snowflake className="h-6 w-6 text-[#487b91]" />
            <span>Yuki</span>
          </Link>

          {/* Center: Desktop Navigation */}
          {!profile ? (
            /* LANDING PAGE NAVBAR (SIGNED OUT) */
            <nav className="hidden items-center gap-3 xl:gap-6 lg:flex">
              {landingNavLinks.map(([label, targetId]) => {
                const isActive = isHome && activeSection === targetId;
                return (
                  <a
                    key={targetId}
                    href={`/#${targetId}`}
                    onClick={(e) => handleLandingNavClick(e, targetId)}
                    className={`text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                      isActive
                        ? 'text-[#183647] font-bold underline underline-offset-4 decoration-[#487b91]'
                        : 'text-[#487b91] hover:text-[#183647]'
                    }`}
                  >
                    {label}
                  </a>
                );
              })}
            </nav>
          ) : (
            /* ROLE-SPECIFIC PORTAL NAVBAR (SIGNED IN) */
            <nav className="hidden items-center gap-3 xl:gap-6 lg:flex">
              {currentNavLinks.map(([label, path]) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                      isActive
                        ? 'text-[#183647] font-bold underline underline-offset-4 decoration-[#487b91]'
                        : 'text-[#487b91] hover:text-[#183647]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* Right: Actions & User Auth */}
          <div className="flex items-center gap-3">
            {profile ? (
              <div className="flex items-center gap-2">
                <UserProfileMenu />
                <NotificationBell />
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-full border border-[#183647]/20 bg-white/60 px-4 py-2 text-xs font-semibold text-[#183647] backdrop-blur-md transition hover:bg-[#183647] hover:text-white sm:flex"
              >
                Sign in
              </Link>
            )}

            {/* Menu button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-2 rounded-full border border-[#183647]/20 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#183647] backdrop-blur-md transition hover:bg-[#183647] hover:text-white"
              aria-label="Open navigation menu"
            >
              <span>MENU</span>
              <MenuIcon size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Modal Navigation Menu */}
      <FullscreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

