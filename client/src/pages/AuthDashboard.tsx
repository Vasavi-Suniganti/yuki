import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { AuthBackgroundVideo } from '../components/AuthBackgroundVideo';

export { AuthDashboard as Login };
import { PageHero, Badge } from '../components/UI';
import { KeyRound, UserPlus, LogIn, ShieldCheck, Mail, ArrowRight, Bookmark, FolderPlus, Clock, BookOpen, Trash2, X } from 'lucide-react';
import { getRoleHomeRoute } from '../components/ProtectedRoute';
import { Role, UserProfile } from '../../../shared/types';
import {
  getShelfItems,
  getShelfCollections,
  getRecentlyViewed,
  createShelfCollection,
  assignItemToCollection,
  removeFromShelf,
  subscribeSignatureFeatures,
  ShelfItem,
  ShelfCollection,
} from '../lib/signatureFeatures';
import { getStudentProgress, subscribeStudentProgress, UserProgress } from '../lib/studentLearning';

function MyPolarShelf({ profile }: { profile: UserProfile }) {
  const [activeTab, setActiveTab] = useState<'saved' | 'collections' | 'recent' | 'learning'>('saved');
  const [shelfItems, setShelfItems] = useState(() => getShelfItems(profile.uid));
  const [collections, setCollections] = useState(() => getShelfCollections(profile.uid));
  const [recentlyViewed, setRecentlyViewed] = useState(() => getRecentlyViewed(profile.uid));

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const unsub = subscribeSignatureFeatures(() => {
      setShelfItems(getShelfItems(profile.uid));
      setCollections(getShelfCollections(profile.uid));
      setRecentlyViewed(getRecentlyViewed(profile.uid));
    });
    return unsub;
  }, [profile.uid]);

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    createShelfCollection(profile.uid, newCollectionName, newCollectionDesc);
    setNewCollectionName('');
    setNewCollectionDesc('');
    setShowCreateModal(false);
  };

  const filteredSavedItems = categoryFilter === 'all'
    ? shelfItems
    : shelfItems.filter((item) => item.type === categoryFilter);

  return (
    <div className="card space-y-6">
      <div className="flex flex-wrap justify-between items-center border-b border-[#183647]/10 pb-4 gap-3">
        <div>
          <h3 className="text-xl font-bold text-[#183647] flex items-center gap-2">
            <Bookmark className="text-[#487b91]" size={22} /> My Polar Shelf
          </h3>
          <p className="text-xs text-[#487b91]">Your personalized polar research library, custom collections, reading history, and study progress.</p>
        </div>

        <div className="flex flex-wrap gap-1 bg-[#dce9ed]/60 p-1 rounded-xl text-xs font-semibold">
          {[
            ['saved', `Saved Items (${shelfItems.length})`, Bookmark],
            ['collections', `Collections (${collections.length})`, FolderPlus],
            ['recent', `Recently Viewed (${recentlyViewed.length})`, Clock],
            ['learning', `Continue Learning`, BookOpen],
          ].map(([id, label, Icon]: any) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === id ? 'bg-[#183647] text-white shadow-sm' : 'text-[#487b91] hover:text-[#183647]'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-VIEW 1: SAVED ITEMS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['all', 'expedition', 'publication', 'report', 'media', 'lesson', 'scientist', 'dataset'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full capitalize font-semibold transition ${
                    categoryFilter === cat ? 'bg-[#183647] text-white' : 'bg-slate-100 text-[#487b91] hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button onClick={() => setShowCreateModal(true)} className="btn-secondary text-xs flex items-center gap-1">
              <FolderPlus size={14} /> + New Collection
            </button>
          </div>

          {filteredSavedItems.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-[#487b91]">
              No saved items found in this category. Click "Save to Shelf" on any expedition, paper, report, or video to bookmark it here!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSavedItems.map((item) => (
                <div key={item.id} className="rounded-2xl p-4 bg-[#edf2f4]/50 border border-[#183647]/12 space-y-3 flex flex-col justify-between hover:border-[#487b91] transition">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">{item.type}</span>
                      {item.collectionName && (
                        <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FolderPlus size={10} /> {item.collectionName}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-[#183647] text-sm leading-snug">{item.title}</h4>
                    {item.subtitle && <p className="text-xs text-[#487b91] line-clamp-2">{item.subtitle}</p>}
                  </div>

                  <div className="pt-3 border-t border-[#183647]/10 flex items-center justify-between text-xs">
                    {item.url ? (
                      <Link to={item.url} className="font-bold text-[#183647] hover:underline flex items-center gap-1">
                        Open Item <ArrowRight size={12} />
                      </Link>
                    ) : (
                      <span className="text-slate-400">Saved</span>
                    )}

                    <div className="flex items-center gap-2">
                      <select
                        value={item.collectionName || ''}
                        onChange={(e) => assignItemToCollection(profile.uid, item.id, e.target.value)}
                        className="text-[10px] rounded-lg border border-slate-300 p-1 bg-white text-[#183647]"
                      >
                        <option value="">Collection...</option>
                        {collections.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeFromShelf(profile.uid, item.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: COLLECTIONS */}
      {activeTab === 'collections' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs font-semibold text-[#487b91]">Organize your research materials into named project folders:</div>
            <button onClick={() => setShowCreateModal(true)} className="btn-primary text-xs flex items-center gap-1">
              <FolderPlus size={14} /> Create Collection
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {collections.map((col) => {
              const colItems = shelfItems.filter((i) => i.collectionName === col.name);
              return (
                <div key={col.id} className="rounded-2xl p-4 bg-[#edf2f4]/60 border border-[#183647]/15 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[#183647] text-base flex items-center gap-2">
                        <FolderPlus size={18} className="text-[#487b91]" /> {col.name}
                      </h4>
                      <p className="text-xs text-[#487b91] mt-1">{col.description}</p>
                    </div>
                    <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">{colItems.length} items</span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-[#183647]/10 text-xs">
                    {colItems.length === 0 ? (
                      <div className="text-[11px] text-slate-400 italic">No items assigned yet</div>
                    ) : (
                      colItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                          <span className="font-semibold truncate max-w-[180px]">{item.title}</span>
                          {item.url && (
                            <Link to={item.url} className="text-[#487b91] hover:text-[#183647] font-bold text-[11px]">
                              View
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: RECENTLY VIEWED */}
      {activeTab === 'recent' && (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-[#487b91]">Items inspected in your current active session:</div>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white overflow-hidden">
            {recentlyViewed.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">{item.type}</span>
                    <h5 className="font-bold text-[#183647] text-sm">{item.title}</h5>
                  </div>
                  {item.subtitle && <p className="text-slate-500 text-[11px]">{item.subtitle}</p>}
                </div>
                {item.url && (
                  <Link to={item.url} className="btn-secondary text-[11px] py-1 px-3">
                    Re-open
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: CONTINUE LEARNING */}
      {activeTab === 'learning' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 border border-[#183647]/15 space-y-2">
            <span className="text-[10px] font-bold text-[#487b91] bg-slate-100 px-2.5 py-0.5 rounded-full">IN PROGRESS · 65%</span>
            <h4 className="font-bold text-[#183647] text-base">Cryosphere Physics & Deep Ice Cores</h4>
            <p className="text-xs text-[#487b91]">Lesson 3: Extracting trapped greenhouse gas bubbles from Antarctic cores.</p>
            <Link to="/education" className="btn-primary text-xs inline-flex mt-2">
              Resume Lesson <ArrowRight size={14} />
            </Link>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-[#183647]/15 space-y-2">
            <span className="text-[10px] font-bold text-[#487b91] bg-slate-100 px-2.5 py-0.5 rounded-full">RECOMMENDED</span>
            <h4 className="font-bold text-[#183647] text-base">Southern Ocean Hydrography & Monsoon Link</h4>
            <p className="text-xs text-[#487b91]">Discover how Indian Ocean density gradients impact summer rainfall.</p>
            <Link to="/discover" className="btn-secondary text-xs inline-flex mt-2">
              Start Module <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* CREATE COLLECTION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
          <form onSubmit={handleCreateCollection} className="w-full max-w-md card space-y-4 bg-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
              <h3 className="text-lg font-bold text-[#183647] flex items-center gap-2">
                <FolderPlus size={18} className="text-[#487b91]" /> Create New Collection
              </h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-[#487b91]"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Collection Name</label>
                <input
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g. Climate Research, For My Project"
                  className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Description (Optional)</label>
                <textarea
                  value={newCollectionDesc}
                  onChange={(e) => setNewCollectionDesc(e.target.value)}
                  placeholder="Brief summary of items in this folder..."
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]"
                />
              </div>
              <button type="submit" className="btn-primary w-full justify-center text-xs">
                Create Collection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export function AuthDashboard() {
  const { login, loginWithGoogle, registerUser, resetPassword, demoMode, profile } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  // Sign In state
  const [email, setEmail] = useState('researcher@demo.org');
  const [password, setPassword] = useState('demo123');

  // Register state (Only public_student, researcher_scientist, media_content can register)
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [institution, setInstitution] = useState('National Centre for Polar and Ocean Research');
  const [roleRequest, setRoleRequest] = useState<Role>('public_student');

  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  // Auto redirect after login/registration based on profile role
  useEffect(() => {
    if (profile) {
      const targetRoute = getRoleHomeRoute(profile.role);
      nav(targetRoute, { replace: true });
    }
  }, [profile, nav]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
    } catch (x: any) {
      if (x?.code === 'auth/configuration-not-found' || x?.message?.includes('configuration-not-found')) {
        setErr('Firebase Auth is not enabled in Firebase Console. Please enable Email/Password under Firebase Console -> Authentication -> Sign-in method, or use Demo Mode.');
      } else {
        setErr(x.message || 'Failed to sign in');
      }
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (regPass !== regConfirmPass) {
      setErr('Passwords do not match!');
      return;
    }
    try {
      await registerUser({
        name,
        email: regEmail,
        password: regPass,
        institution,
        roleRequest,
      });
      setMsg('Account registered successfully!');
    } catch (x: any) {
      if (x?.code === 'auth/configuration-not-found' || x?.message?.includes('configuration-not-found')) {
        setErr('Firebase Auth is not enabled in Firebase Console. Please enable Email/Password under Firebase Console -> Authentication -> Sign-in method, or use Demo Mode.');
      } else {
        setErr(x.message || 'Failed to register account');
      }
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    try {
      await resetPassword(email);
      setMsg('Password reset instructions sent to your email.');
    } catch (x: any) {
      setErr(x.message || 'Failed to send reset email');
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Premium Animated Auth Video Background */}
      <AuthBackgroundVideo src="/video_for_signups.mp4" />

      <div className="relative z-10 mx-auto w-full max-w-md px-2 sm:px-0">
        <div className="rounded-3xl p-7 sm:p-9 shadow-2xl border border-white/50 bg-white/75 backdrop-blur-xl transition-all text-[#183647]">
          <div className="flex justify-between items-center">
            <div className="kicker font-bold tracking-widest text-[#487b91]">Yuki Access Portal</div>
            <div className="flex gap-1 bg-[#183647]/5 p-1 rounded-xl text-xs">
              <button
                onClick={() => setMode('signin')}
                className={`px-3 py-1 rounded-lg font-semibold capitalize transition ${mode === 'signin' ? 'bg-[#183647] text-white shadow-sm' : 'text-[#487b91] hover:text-[#183647]'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`px-3 py-1 rounded-lg font-semibold capitalize transition ${mode === 'signup' ? 'bg-[#183647] text-white shadow-sm' : 'text-[#487b91] hover:text-[#183647]'}`}
              >
                Register
              </button>
            </div>
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#183647]">
            {mode === 'signin' ? 'Sign in to Yuki' : mode === 'signup' ? 'Create Yuki Account' : 'Reset Password'}
          </h1>

          {demoMode && (
            <div className="mt-4 rounded-xl border border-[#487b91]/30 bg-[#487b91]/10 p-3 text-xs text-[#183647] backdrop-blur-sm">
              Demo Mode Active: Test logins for public@demo.org (Public / Student), researcher@demo.org (Researcher / Scientist), admin@demo.org (NCPOR Admin), or media@demo.org (Media / Content Team).
            </div>
          )}

          {err && <div className="mt-3 rounded-xl bg-red-50/90 backdrop-blur-sm p-3 text-xs text-red-600 border border-red-200">{err}</div>}
          {msg && <div className="mt-3 rounded-xl bg-emerald-50/90 backdrop-blur-sm p-3 text-xs text-emerald-800 border border-emerald-200">{msg}</div>}

          {/* MODE: SIGN IN */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#183647]/15 bg-white/70 p-3 text-sm text-[#183647] outline-none focus:border-[#487b91]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#183647]/15 bg-white/70 p-3 text-sm text-[#183647] outline-none focus:border-[#487b91]"
                  required
                />
              </div>

              <div className="flex justify-between items-center text-xs">
                <button type="button" onClick={() => setMode('forgot')} className="text-[#487b91] hover:underline">
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="btn-primary w-full justify-center">
                <KeyRound size={16} /> Sign in
              </button>

              <button
                type="button"
                onClick={async () => {
                  await loginWithGoogle();
                }}
                className="btn-secondary w-full justify-center text-xs"
              >
                Sign in with Google Provider
              </button>
            </form>
          )}

          {/* MODE: SIGN UP */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#183647]/15 bg-white/70 p-2.5 text-xs text-[#183647] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#183647]/15 bg-white/70 p-2.5 text-xs text-[#183647] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Institution</label>
                <input
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#183647]/15 bg-white/70 p-2.5 text-xs text-[#183647] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Select Role</label>
                <select
                  value={roleRequest}
                  onChange={(e) => setRoleRequest(e.target.value as Role)}
                  className="mt-1 w-full rounded-xl border border-[#183647]/15 bg-white/70 p-2.5 text-xs text-[#183647] outline-none font-semibold"
                >
                  <option value="public_student">Public / Student</option>
                  <option value="researcher_scientist">Researcher / Scientist</option>
                  <option value="media_content">Media / Content Team</option>
                </select>
                <span className="text-[10px] text-[#487b91] mt-1 block">
                  Note: NCPOR Admin roles are non-registerable and managed by system administrators.
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#487b91]">Password</label>
                  <input
                    type="password"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#183647]/15 bg-white/70 p-2.5 text-xs text-[#183647] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#487b91]">Confirm Password</label>
                  <input
                    type="password"
                    value={regConfirmPass}
                    onChange={(e) => setRegConfirmPass(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#183647]/15 bg-white/70 p-2.5 text-xs text-[#183647] outline-none"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center mt-4">
                <UserPlus size={16} /> Register Account
              </button>
            </form>
          )}

          {/* MODE: FORGOT */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Your Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#183647]/15 bg-white/70 p-3 text-sm text-[#183647] outline-none"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                <Mail size={16} /> Send Password Reset Email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { profile, demoMode } = useAuth();
  const nav = useNavigate();
  const [learningProg, setLearningProg] = useState<UserProgress>(() => getStudentProgress(profile?.uid));

  useEffect(() => {
    const sync = () => setLearningProg(getStudentProgress(profile?.uid));
    sync();
    return subscribeStudentProgress(sync);
  }, [profile?.uid]);

  if (!profile) {
    return (
      <div className="min-h-screen pt-32 text-center text-[#183647]">
        <h2 className="text-2xl font-bold">Please sign in to access your student workspace.</h2>
        <button onClick={() => nav('/login')} className="btn-primary mt-4">
          Sign In
        </button>
      </div>
    );
  }

  const isStudent = profile.role === 'public_student' || profile.role === 'PUBLIC_USER';
  const homeRoute = getRoleHomeRoute(profile.role);

  return (
    <>
      <PageHero
        kicker="Student & Visitor Portal"
        title={`Welcome back, ${profile.name}.`}
        body="Track your polar science learning progress, inspect earned badges & certificates, access saved research, and continue your polar journey."
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge>ROLE: STUDENT / VISITOR</Badge>
          <Badge>LEVEL {learningProg.level} ({learningProg.xp} XP)</Badge>
          <Badge>{learningProg.unlockedBadges.length} BADGES UNLOCKED</Badge>
          <Badge>{learningProg.streak} DAY STREAK</Badge>
          {demoMode && <Badge>DEMO MODE</Badge>}
        </div>
      </PageHero>

      <section className="section space-y-8">
        {/* Quick Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-center">
          <div className="card space-y-1">
            <div className="text-[#487b91] text-xs font-bold uppercase">Learning Points</div>
            <div className="text-3xl font-black text-[#183647]">{learningProg.xp} XP</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Level {learningProg.level} Scholar</div>
          </div>
          <div className="card space-y-1">
            <div className="text-[#487b91] text-xs font-bold uppercase">Study Streak</div>
            <div className="text-3xl font-black text-amber-600 font-black">{learningProg.streak} Days</div>
            <div className="text-[11px] text-[#487b91]">Active Daily Streak</div>
          </div>
          <div className="card space-y-1">
            <div className="text-[#487b91] text-xs font-bold uppercase">Completed Quizzes</div>
            <div className="text-3xl font-black text-[#183647]">{learningProg.quizHistory.length}</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Accredited Quizzes</div>
          </div>
          <div className="card space-y-1">
            <div className="text-[#487b91] text-xs font-bold uppercase">Completed Modules</div>
            <div className="text-3xl font-black text-[#183647]">{learningProg.completedModules.length}</div>
            <div className="text-[11px] text-[#487b91]">Interactive Lessons</div>
          </div>
        </div>

        {/* SIGNATURE FEATURE: MY POLAR SHELF */}
        <MyPolarShelf profile={profile} />

        {/* Section 1: Continue Learning */}
        <div className="card space-y-4">
          <h3 className="text-xl font-bold text-[#183647]">Continue Learning</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/70 backdrop-blur-md p-4 border border-[#183647]/12 space-y-2">
              <span className="text-[10px] font-bold text-[#487b91] bg-slate-100/80 px-2.5 py-0.5 rounded-full">IN PROGRESS · 65%</span>
              <h4 className="font-bold text-[#183647] text-base">Cryosphere Physics & Deep Ice Cores</h4>
              <p className="text-xs text-[#487b91]">Lesson 3: Extracting trapped greenhouse gas bubbles from Antarctic cores.</p>
              <Link to="/education" className="btn-primary text-xs inline-flex mt-2">
                Resume Lesson <ArrowRight size={14} />
              </Link>
            </div>

            <div className="rounded-2xl bg-white/70 backdrop-blur-md p-4 border border-[#183647]/12 space-y-2">
              <span className="text-[10px] font-bold text-[#487b91] bg-slate-100/80 px-2.5 py-0.5 rounded-full">RECOMMENDED</span>
              <h4 className="font-bold text-[#183647] text-base">Southern Ocean Hydrography & Monsoon Link</h4>
              <p className="text-xs text-[#487b91]">Discover how Indian Ocean density gradients impact summer rainfall.</p>
              <Link to="/discover" className="btn-secondary text-xs inline-flex mt-2">
                Start Module <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Section 2: Badges & Certificates */}
        <div className="card space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#183647]">My Earned Badges & Certificates</h3>
            <button onClick={() => alert('Yuki Student Certificate generated and ready for download!')} className="btn-primary text-xs">
              Download Student Certificate
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-center space-y-2">
              <div className="text-xs font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full inline-block">UNLOCKED</div>
              <h4 className="font-bold text-[#183647] text-sm">Antarctic Explorer</h4>
              <p className="text-[11px] text-slate-600">Completed 3 Antarctic station modules</p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-center space-y-2">
              <div className="text-xs font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full inline-block">UNLOCKED</div>
              <h4 className="font-bold text-[#183647] text-sm">Polar Biodiversity Explorer</h4>
              <p className="text-[11px] text-slate-600">Explored 5 wildlife field media items</p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4 border border-blue-200 text-center space-y-2">
              <div className="text-xs font-bold text-blue-800 bg-blue-200 px-2 py-0.5 rounded-full inline-block">IN PROGRESS</div>
              <h4 className="font-bold text-[#183647] text-sm">Young Polar Scientist</h4>
              <p className="text-[11px] text-slate-600">350 / 500 pts earned</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-center space-y-2">
              <div className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full inline-block">LOCKED</div>
              <h4 className="font-bold text-[#183647] text-sm">Climate Champion</h4>
              <p className="text-[11px] text-slate-600">Complete Virtual Polar Lab</p>
            </div>
          </div>
        </div>

        {/* Section 3: Profile Overview */}
        <div className="card space-y-4">
          <h3 className="text-xl font-bold text-[#183647]">Account Profile</h3>
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div>
              <span className="font-semibold text-[#487b91]">Name:</span> {profile.name}
            </div>
            <div>
              <span className="font-semibold text-[#487b91]">Email:</span> {profile.email}
            </div>
            <div>
              <span className="font-semibold text-[#487b91]">Institution / School:</span> {profile.institution || 'Indian Polar Science Student'}
            </div>
            <div>
              <span className="font-semibold text-[#487b91]">Role:</span> {profile.role}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
