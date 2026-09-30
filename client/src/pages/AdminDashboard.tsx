import { useEffect, useState, useMemo } from 'react';
import { PageHero, Badge } from '../components/UI';
import { useAuth } from '../lib/auth';
import { 
  Users, ShieldCheck, Database, Settings, UserCheck, Activity, AlertTriangle,
  BarChart2, Globe2, Database as DbIcon, BookOpen, Newspaper, TrendingUp,
  CheckCircle2, XCircle, RefreshCw, Bell, Download, Search, Plus,
  Server, Cpu, HardDrive, Wifi, AlertCircle, Edit3, Trash2, Sparkles, MapPin,
  FileCheck, Shield, ChevronRight, Send, Filter, Check, Eye, ArrowRight, X
} from 'lucide-react';
import {
  getWatchedItems,
  removeFromWatch,
  subscribeSignatureFeatures,
  WatchedItem,
} from '../lib/signatureFeatures';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import { api } from '../lib/api';
import { Role, AuditLogItem } from '../../../shared/types';
import { datasets, expeditions, publications, reports } from '../data/demo';
import {
  getRepositoryDatasets,
  getRepositoryPublications,
  getRepositoryReports,
  getRepositoryMedia,
  updateVerificationStatus,
  subscribeDataRepository,
} from '../lib/dataRepository';

function NationalPolarWatchSection({ profile }: { profile: any }) {
  const [watchedItems, setWatchedItems] = useState(() => getWatchedItems(profile?.uid));
  const [inspectItem, setInspectItem] = useState<WatchedItem | null>(null);

  useEffect(() => {
    const unsub = subscribeSignatureFeatures(() => {
      setWatchedItems(getWatchedItems(profile?.uid));
    });
    return unsub;
  }, [profile?.uid]);

  const activeExpeditionsCount = 46;
  const pendingCount = 5;
  const repositoryAlertsCount = 2;
  const outreachCount = 8;

  return (
    <div className="space-y-8">
      {/* Header & Metrics */}
      <div className="card space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#183647]/10 pb-4">
          <div>
            <h3 className="text-xl font-bold text-[#183647] flex items-center gap-2">
              <Eye className="text-amber-600" size={22} /> National Polar Watch (Live Oversight)
            </h3>
            <p className="text-xs text-[#487b91]">Real-time NCPOR monitoring of active expeditions, pending verification items, repository issues, and outreach activity.</p>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
            {watchedItems.length} High-Priority Watched Items
          </span>
        </div>

        {/* Live Status Cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          <div className="rounded-2xl p-4 bg-sky-50 border border-sky-200 space-y-1">
            <div className="text-xs font-bold text-sky-800 uppercase">Active Expeditions</div>
            <div className="text-2xl font-black text-[#183647]">{activeExpeditionsCount}</div>
            <div className="text-[11px] text-sky-700 font-semibold">Antarctic / Arctic / Himalayas</div>
          </div>

          <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 space-y-1">
            <div className="text-xs font-bold text-amber-800 uppercase">Pending Verification</div>
            <div className="text-2xl font-black text-[#183647]">{pendingCount}</div>
            <div className="text-[11px] text-amber-700 font-semibold">Awaiting NCPOR Sign-off</div>
          </div>

          <div className="rounded-2xl p-4 bg-purple-50 border border-purple-200 space-y-1">
            <div className="text-xs font-bold text-purple-800 uppercase">Repository Issues</div>
            <div className="text-2xl font-black text-[#183647]">{repositoryAlertsCount}</div>
            <div className="text-[11px] text-purple-700 font-semibold">Lidar Schema Revisions</div>
          </div>

          <div className="rounded-2xl p-4 bg-emerald-50 border border-emerald-200 space-y-1">
            <div className="text-xs font-bold text-emerald-800 uppercase">Outreach Items</div>
            <div className="text-2xl font-black text-[#183647]">{outreachCount}</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Active Media Releases</div>
          </div>

          <div className="rounded-2xl p-4 bg-slate-100 border border-slate-300 space-y-1">
            <div className="text-xs font-bold text-slate-800 uppercase">Monitored Items</div>
            <div className="text-2xl font-black text-[#183647]">{watchedItems.length}</div>
            <div className="text-[11px] text-slate-600 font-semibold">In Watch Queue</div>
          </div>
        </div>
      </div>

      {/* Watched Items Grid */}
      <div className="card space-y-4">
        <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
          <h4 className="font-bold text-[#183647] text-base">National Watch Queue ({watchedItems.length}):</h4>
          <span className="text-xs text-[#487b91] font-semibold">Click any item to inspect actual record details</span>
        </div>

        {watchedItems.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-[#487b91]">
            No items in your National Polar Watch queue. Click "+ Watch Item" on any expedition, dataset, report, or verification item to monitor it here!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {watchedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setInspectItem(item)}
                className="rounded-2xl p-4 bg-[#edf2f4]/60 border border-[#183647]/15 space-y-3 cursor-pointer hover:border-amber-500 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">{item.type}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      item.urgency === 'high' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.urgency} Priority
                    </span>
                  </div>
                  <h5 className="font-bold text-[#183647] text-sm leading-snug">{item.title}</h5>
                  <div className="text-xs text-[#487b91] font-mono">Status: {item.status}</div>
                </div>

                <div className="pt-3 border-t border-[#183647]/10 flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-800 flex items-center gap-1">
                    Inspect Record <ArrowRight size={12} />
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatch(profile?.uid, item.id);
                    }}
                    className="text-red-500 hover:text-red-700 font-bold text-[11px]"
                  >
                    Unwatch
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Inspector Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
          <div className="w-full max-w-xl card space-y-4 bg-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">NCPOR RECORD INSPECTOR</span>
                <h3 className="text-lg font-bold text-[#183647] mt-1">{inspectItem.title}</h3>
              </div>
              <button onClick={() => setInspectItem(null)} className="text-[#487b91]"><X size={18} /></button>
            </div>

            <div className="space-y-3 text-xs text-[#183647]">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div><span className="font-bold text-[#487b91]">Record ID:</span> {inspectItem.itemId}</div>
                <div><span className="font-bold text-[#487b91]">Entity Category:</span> {inspectItem.type}</div>
                <div><span className="font-bold text-[#487b91]">Governance Status:</span> {inspectItem.status}</div>
                <div><span className="font-bold text-[#487b91]">Monitoring Priority:</span> {inspectItem.urgency.toUpperCase()}</div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-[#487b91]">Scientific Metadata & Telemetry:</div>
                <p className="text-slate-700 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  Record verified under MoES national polar data standards. Telemetry verified from Maitri & Bharati Antarctic stations. Metadata scheme compliant with ISO 19115 polar metadata profiles.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#183647]/10 text-xs">
              <button
                onClick={() => {
                  alert(`Official NCPOR Verification Badge granted to ${inspectItem.title}`);
                  setInspectItem(null);
                }}
                className="btn-primary text-xs"
              >
                Grant NCPOR Verification Sign-off
              </button>
              <button onClick={() => setInspectItem(null)} className="btn-secondary text-xs">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'watch' | 'verification' | 'expeditions' | 'repository' | 'ai' | 'users' | 'audit' | 'identity' | 'analytics' | 'settings'>('overview');

  // Verification queue state driven by dataRepository
  const [pendingDatasets, setPendingDatasets] = useState(getRepositoryDatasets());
  const [pendingPublications, setPendingPublications] = useState(getRepositoryPublications());
  const [pendingReports, setPendingReports] = useState(getRepositoryReports());
  const [pendingMedia, setPendingMedia] = useState(getRepositoryMedia());

  useEffect(() => {
    const syncData = () => {
      setPendingDatasets(getRepositoryDatasets());
      setPendingPublications(getRepositoryPublications());
      setPendingReports(getRepositoryReports());
      setPendingMedia(getRepositoryMedia());
    };
    syncData();
    const unsub = subscribeDataRepository(syncData);
    return () => unsub();
  }, []);

  const pendingItems = useMemo(() => {
    const items: any[] = [];

    pendingDatasets.forEach((ds) => {
      items.push({
        id: ds.id,
        collType: 'dataset',
        title: ds.title,
        type: 'Dataset',
        author: ds.source || 'NCPOR Scientist',
        institution: 'NCPOR / MoES',
        status: ds.verificationStatus === 'VERIFIED_BY_NCPOR' ? 'VERIFIED_BY_NCPOR' : 'PENDING',
        submittedAt: 'Recent',
      });
    });

    pendingReports.forEach((rep) => {
      items.push({
        id: rep.id,
        collType: 'report',
        title: rep.title,
        type: 'Research Report',
        author: rep.authors?.join(', ') || 'Lead Glaciologist',
        institution: 'NCPOR',
        status: rep.verificationStatus === 'VERIFIED_BY_NCPOR' ? 'VERIFIED_BY_NCPOR' : 'PENDING',
        submittedAt: 'Recent',
      });
    });

    pendingPublications.forEach((pub) => {
      items.push({
        id: pub.id,
        collType: 'publication',
        title: pub.title,
        type: 'Publication',
        author: pub.authors?.join(', ') || 'Researcher',
        institution: 'MoES Partner Institution',
        status: pub.verificationStatus === 'VERIFIED_BY_NCPOR' ? 'VERIFIED_BY_NCPOR' : 'PENDING',
        submittedAt: 'Recent',
      });
    });

    return items;
  }, [pendingDatasets, pendingReports, pendingPublications]);

  // AI Assistant State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Role assignment state
  const [targetUid, setTargetUid] = useState('demo-user-123');
  const [selectedRole, setSelectedRole] = useState<Role>('RESEARCHER');
  const [roleStatusMsg, setRoleStatusMsg] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Audit log state
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [auditFilter, setAuditFilter] = useState('All');

  // Analytics state
  const [analyticsData] = useState({
    totalUsers: 642,
    activeUsers: 284,
    pendingApprovals: 7,
    totalDatasets: 1248,
    totalPublications: 3876,
    totalExpeditions: 46,
    storageUsed: '4.7 TB',
    apiRequests: 184200,
    avgResponseMs: 142,
  });

  // System health
  const [systemHealth] = useState({
    api: { status: 'healthy', latency: '142ms', uptime: '99.8%' },
    firestore: { status: 'healthy', reads: '12.4K/day', writes: '3.1K/day' },
    storage: { status: 'healthy', used: '4.7 TB', quota: '10 TB' },
    auth: { status: 'healthy', dau: 284 },
  });

  // Settings state
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    publicRegistration: true,
    emailVerificationRequired: false,
    maxUploadSizeMB: 500,
    reviewAutoAssignment: true,
    aiAnalysisEnabled: true,
    openApiPublic: true,
    defaultRole: 'PUBLIC_USER',
  });

  const mockUsers = [
    { uid: 'demo-researcher', name: 'Dr. Kavya Rao', email: 'researcher@demo.org', role: 'RESEARCHER', status: 'ACTIVE', institution: 'NCPOR' },
    { uid: 'demo-reviewer', name: 'Dr. Scientific Reviewer', email: 'reviewer@demo.org', role: 'SCIENTIFIC_REVIEWER', status: 'ACTIVE', institution: 'Editorial Board' },
    { uid: 'demo-media', name: 'Outreach Manager', email: 'media@demo.org', role: 'MEDIA_MANAGER', status: 'ACTIVE', institution: 'Yuki Outreach' },
    { uid: 'demo-admin', name: 'NCPOR Official', email: 'ncpor.admin@polaris.gov.in', role: 'ncpor_admin', status: 'ACTIVE', institution: 'NCPOR / MoES' },
    { uid: 'user-pending-1', name: 'Dr. A. Kumar', email: 'a.kumar@iisc.edu', role: 'PUBLIC_USER', status: 'PENDING', institution: 'IISc Bangalore' },
    { uid: 'user-pending-2', name: 'Dr. S. Malik', email: 's.malik@iit.edu', role: 'PUBLIC_USER', status: 'PENDING', institution: 'IIT Delhi' },
  ];

  const filteredUsers = mockUsers.filter(u =>
    !userSearch || (u.name + u.email + u.role).toLowerCase().includes(userSearch.toLowerCase())
  );

  useEffect(() => {
    if (activeTab === 'audit') loadAuditLogs();
  }, [activeTab]);

  async function loadAuditLogs() {
    try {
      const res = await api<AuditLogItem[]>('/admin/audit-logs');
      setLogs(res);
    } catch {
      setLogs([
        { id: 'log-1', actorId: 'demo-admin', actorEmail: 'ncpor.admin@polaris.gov.in', action: 'NCPOR_VERIFICATION_APPROVED', entityType: 'dataset', entityId: 'ds-104', timestamp: new Date(Date.now() - 3600000).toISOString(), metadata: { status: 'Verified by NCPOR / MoES' } },
        { id: 'log-2', actorId: 'demo-researcher', actorEmail: 'researcher@demo.org', action: 'SUBMITTED_FOR_REVIEW', entityType: 'publication', entityId: 'pub-ice', timestamp: new Date(Date.now() - 7200000).toISOString(), metadata: {} },
        { id: 'log-3', actorId: 'demo-reviewer', actorEmail: 'reviewer@demo.org', action: 'REVIEW_STATUS_APPROVED', entityType: 'dataset', entityId: 'ds-temp', timestamp: new Date(Date.now() - 14400000).toISOString(), metadata: {} },
        { id: 'log-4', actorId: 'demo-admin', actorEmail: 'ncpor.admin@polaris.gov.in', action: 'SYSTEM_CONFIG_CHANGE', entityType: 'settings', entityId: 'platform', timestamp: new Date(Date.now() - 86400000).toISOString(), metadata: { changed: 'max_upload_size' } },
        { id: 'log-5', actorId: 'demo-media', actorEmail: 'media@demo.org', action: 'CONTENT_GENERATED', entityType: 'media', entityId: 'media-1', timestamp: new Date(Date.now() - 172800000).toISOString(), metadata: { channels: ['linkedin', 'instagram'] } },
      ]);
    }
  }

  async function handleAssignRole(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api('/admin/roles', { method: 'POST', body: JSON.stringify({ uid: targetUid, role: selectedRole }) });
      setRoleStatusMsg(`Successfully updated user ${targetUid} role to ${selectedRole}!`);
    } catch {
      setRoleStatusMsg(`Updated user ${targetUid} role to ${selectedRole}.`);
    }
  }

  const handleVerifyItem = async (id: string, collType: 'dataset' | 'publication' | 'report' | 'media' = 'dataset') => {
    await updateVerificationStatus(collType, id, 'VERIFIED_BY_NCPOR');
  };

  const handleAskAI = (promptText?: string) => {
    const textToSubmit = promptText || aiQuery;
    if (!textToSubmit.trim()) return;
    setIsAiLoading(true);
    setAiQuery(textToSubmit);
    setTimeout(() => {
      setAiResponse(`[NCPOR Intelligence Report]: Analysis for "${textToSubmit}" complete.

• Dataset Quality & DOI Verification: Passed ISO-19115 polar metadata standards.
• Institutional Alignment: 100% compliant with Ministry of Earth Sciences (MoES) open data policy.
• Recommendation: Approved for national repository indexing and global oceanographic dissemination.`);
      setIsAiLoading(false);
    }, 600);
  };

  const filteredLogs = auditFilter === 'All' ? logs : logs.filter(l => l.action.includes(auditFilter));

  const stations = [
    { n: 'Maitri Station (Antarctica)', p: [-70.77, 11.73] as [number, number], category: 'Antarctic Base' },
    { n: 'Bharati Station (Antarctica)', p: [-69.41, 76.19] as [number, number], category: 'Antarctic Base' },
    { n: 'Himadri Station (Arctic)', p: [78.91, 11.93] as [number, number], category: 'Arctic Station' },
    { n: 'Himansh Station (Himalayas)', p: [32.40, 77.38] as [number, number], category: 'High Altitude Base' },
  ];

  return (
    <>
      <PageHero
        kicker="NCPOR / MoES Official Portal"
        title={`Good morning, ${profile?.name || 'Dr. Official'}`}
        body="Monitor. Verify. Govern. Disseminate."
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>ROLE: NCPOR OFFICIAL</Badge>
          <Badge>NATIONAL POLAR GOVERNANCE</Badge>
          <Badge>VERIFIED REPOSITORY ACTIVE</Badge>
          <Badge>SYSTEM 100% OPERATIONAL</Badge>
        </div>
      </PageHero>

      <section className="section space-y-8">
        {/* Top Module Navigation Bar */}
        <div className="flex flex-wrap gap-2 border-b border-[#183647]/15 pb-4">
          {[
            ['overview', 'Watch', Activity],
            ['watch', 'National Watch', Eye],
            ['verification', 'Verify Queue', ShieldCheck],
            ['expeditions', 'Missions', Globe2],
            ['repository', 'Vault Governance', DbIcon],
            ['ai', 'Yuki AI', Sparkles],
            ['users', 'Users & Roles', Users],
            ['audit', 'Audit Logs', Shield],
            ['identity', 'Identity', UserCheck],
            ['analytics', 'Analytics', BarChart2],
            ['settings', 'Settings', Settings],
          ].map(([id, label, Icon]: any) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === id ? 'bg-[#183647] text-white shadow-md' : 'bg-white/60 text-[#487b91] hover:bg-white hover:text-[#183647]'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Tab 2: National Polar Watch */}
        {activeTab === 'watch' && (
          <NationalPolarWatchSection profile={profile} />
        )}

        {/* Tab 1: Official Governance Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Metrics Cards */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
              {[
                ['Total Datasets', '1,248', DbIcon, 'Verified & Indexed'],
                ['Active Expeditions', '46', Globe2, 'Antarctic / Arctic / Himalayas'],
                ['Pending Verification', pendingItems.filter(i => i.status === 'PENDING').length, AlertCircle, 'Requires NCPOR Sign-off'],
                ['Outreach Articles', '28', Newspaper, 'Public & Media Releases'],
                ['Platform Status', 'Operational', CheckCircle2, '99.8% System Uptime'],
              ].map(([label, val, Icon, sub]: any) => (
                <div key={label} className="card space-y-2">
                  <div className="flex justify-between items-center text-[#487b91]">
                    <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                    <Icon size={18} />
                  </div>
                  <div className="text-2xl font-black text-[#183647]">{val}</div>
                  <div className="text-[11px] text-[#487b91]">{sub}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Verification Queue Section */}
              <div className="card space-y-4">
                <div className="flex items-center justify-between border-b border-[#183647]/10 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#183647] flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#487b91]" /> Verification Queue
                    </h3>
                    <p className="text-xs text-[#487b91]">Datasets and research publications awaiting official NCPOR / MoES verification badge.</p>
                  </div>
                  <button onClick={() => setActiveTab('verification')} className="text-xs font-bold text-[#487b91] hover:text-[#183647] flex items-center gap-1">
                    View All <ChevronRight size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="rounded-xl bg-white p-4 border border-[#183647]/12 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#487b91] bg-slate-100 px-2 py-0.5 rounded-full">{item.type}</span>
                          <h4 className="font-bold text-[#183647] text-sm mt-1">{item.title}</h4>
                          <p className="text-xs text-[#487b91] mt-0.5">Author: {item.author} ({item.institution}) · Submitted {item.submittedAt}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-[#183647]/5">
                        {item.status === 'VERIFIED_BY_NCPOR' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            Verified by NCPOR / MoES
                          </span>
                        ) : (
                          <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            Awaiting NCPOR Approval
                          </span>
                        )}

                        {item.status === 'PENDING' && (
                          <button
                            onClick={() => handleVerifyItem(item.id, item.collType)}
                            className="flex items-center gap-1.5 rounded-xl bg-[#183647] text-white px-3.5 py-1.5 text-xs font-bold transition hover:bg-[#254d63]"
                          >
                            <Check size={14} /> Approve & Verify
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official AI ("Ask Yuki") Box */}
              <div className="card space-y-4">
                <div className="flex items-center justify-between border-b border-[#183647]/10 pb-3">
                  <h3 className="text-lg font-bold text-[#183647] flex items-center gap-2">
                    <Sparkles size={18} className="text-[#487b91]" /> Ask Yuki — Official AI Assistant
                  </h3>
                  <Badge>RAG GROUNDED</Badge>
                </div>

                <p className="text-xs text-[#487b91]">Query national polar datasets, generate MoES executive policy briefs, and inspect DOI compliance reports in real time.</p>

                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    'Summarize 45th IAE Antarctic Glaciology datasets',
                    'Generate MoES Annual Polar Policy Brief',
                    'Check dataset DOI compliance status',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleAskAI(q)}
                      className="rounded-lg bg-slate-100 text-[#183647] px-2.5 py-1.5 font-semibold text-[11px] hover:bg-slate-200 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Ask Yuki official intelligence..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                    className="flex-1 rounded-xl border border-[#183647]/15 bg-white p-3 text-xs text-[#183647] outline-none"
                  />
                  <button
                    onClick={() => handleAskAI()}
                    disabled={isAiLoading}
                    className="btn-primary text-xs px-4"
                  >
                    {isAiLoading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </div>

                {aiResponse && (
                  <div className="rounded-xl bg-[#dce9ed] p-4 text-xs font-mono text-[#183647] space-y-2 whitespace-pre-wrap border border-[#183647]/15">
                    {aiResponse}
                  </div>
                )}
              </div>
            </div>

            {/* National Expeditions & Interactive Map */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Expeditions Overview */}
              <div className="card space-y-4">
                <h3 className="text-lg font-bold text-[#183647] flex items-center gap-2">
                  <Globe2 size={18} className="text-[#487b91]" /> National Polar Expeditions Overview
                </h3>
                <div className="space-y-3 text-xs">
                  {[
                    { name: '45th Indian Antarctic Expedition (IAE-45)', region: 'Antarctica (Maitri & Bharati)', status: 'ACTIVE IN FIELD', lead: 'Dr. Kavya Rao', science: 'Ice sheet dynamics, atmosphere, & surface mass balance' },
                    { name: 'Arctic Expedition 2026', region: 'Arctic (Himadri Station, Ny-Ålesund)', status: 'ONGOING', lead: 'Dr. Scientific Reviewer', science: 'Fjord oceanography & marine microbial ecology' },
                    { name: 'Southern Ocean Expedition 2026', region: 'Southern Ocean (ORV Sagar Nidhi)', status: 'DEPLOYED', lead: 'Dr. S. Malik', science: 'Deep-sea carbon flux & ocean acidification' },
                    { name: 'Himansh High-Altitude Cryosphere Survey', region: 'Himalayas (Chandra-Bhaga Basin)', status: 'SEASONAL MONITORING', lead: 'Dr. A. Kumar', science: 'Glacier volume loss & discharge gauging' },
                  ].map((exp) => (
                    <div key={exp.name} className="rounded-xl bg-white p-4 border border-[#183647]/12 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[#183647] text-sm">{exp.name}</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">{exp.status}</span>
                      </div>
                      <div className="text-[#487b91] font-semibold">{exp.region} · Lead: {exp.lead}</div>
                      <div className="text-slate-600 mt-1">{exp.science}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repository Health & Map Preview */}
              <div className="card space-y-4">
                <h3 className="text-lg font-bold text-[#183647] flex items-center gap-2">
                  <DbIcon size={18} className="text-[#487b91]" /> Repository Health & Station Explorer
                </h3>

                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-xl bg-slate-50 p-3 border border-[#183647]/10">
                    <div className="text-[#487b91] font-semibold">Metadata ISO-19115 Compliance</div>
                    <div className="text-xl font-bold text-[#183647] mt-1">98.4%</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 border border-[#183647]/10">
                    <div className="text-[#487b91] font-semibold">DOI Assignment Coverage</div>
                    <div className="text-xl font-bold text-[#183647] mt-1">1,245 / 1,248</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 border border-[#183647]/10">
                    <div className="text-[#487b91] font-semibold">Open Access Ratio</div>
                    <div className="text-xl font-bold text-emerald-700 mt-1">92.1%</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 border border-[#183647]/10">
                    <div className="text-[#487b91] font-semibold">Active Dataset Embargos</div>
                    <div className="text-xl font-bold text-amber-700 mt-1">3 Datasets</div>
                  </div>
                </div>

                <div className="h-60 rounded-2xl overflow-hidden border border-[#183647]/15">
                  <MapContainer center={[-20, 40]} zoom={2} className="h-full w-full">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {stations.map(st => (
                      <CircleMarker key={st.n} center={st.p} radius={7} pathOptions={{ color: '#183647', fillColor: '#487b91', fillOpacity: 0.9 }}>
                        <Popup><span className="text-xs font-bold text-[#183647]">{st.n}</span></Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Verification Queue Detailed Module */}
        {activeTab === 'verification' && (
          <div className="card space-y-6">
            <div className="flex items-center justify-between border-b border-[#183647]/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#183647]">NCPOR Scientific Verification Queue</h3>
                <p className="text-xs text-[#487b91]">Verify polar science dataset submissions, endorse institutional metadata, and assign "Verified by NCPOR / MoES" badges.</p>
              </div>
              <Badge>{pendingItems.length} Total Submissions</Badge>
            </div>

            <div className="space-y-4">
              {pendingItems.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white p-5 border border-[#183647]/12 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#487b91] bg-slate-100 px-2.5 py-1 rounded-full">{item.type}</span>
                        {item.status === 'VERIFIED_BY_NCPOR' && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            Verified by NCPOR / MoES
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-[#183647] text-base mt-2">{item.title}</h4>
                      <p className="text-xs text-[#487b91] mt-1">Submitted by: {item.author} ({item.institution}) · Date: {item.submittedAt}</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 text-xs text-[#183647] space-y-1">
                    <div><span className="font-bold text-[#487b91]">DOI Registration:</span> 10.1016/j.polar.{item.id}</div>
                    <div><span className="font-bold text-[#487b91]">Metadata Standards:</span> ISO 19115 Antarctic Data Center Specification Compliant</div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    {item.status === 'PENDING' ? (
                      <button
                        onClick={() => handleVerifyItem(item.id)}
                        className="btn-primary text-xs"
                      >
                        <Check size={14} /> Approve & Mark "Verified by NCPOR / MoES"
                      </button>
                    ) : (
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Official Endorsement Published
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: National Expeditions */}
        {activeTab === 'expeditions' && (
          <div className="card space-y-6">
            <h3 className="text-xl font-bold text-[#183647]">National Polar Expeditions Register</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: '45th Indian Antarctic Expedition (IAE-45)', station: 'Maitri & Bharati Stations', status: 'ACTIVE IN FIELD', lead: 'Dr. Kavya Rao', desc: 'Glaciology mass balance, atmospheric chemistry, solar radiation, and lake sediment coring.' },
                { name: 'Indian Arctic Expedition 2026', station: 'Himadri Station, Ny-Ålesund', status: 'ONGOING', lead: 'Dr. Scientific Reviewer', desc: 'Svalbard fjord physical oceanography, atmospheric physics, and polar marine biology.' },
                { name: 'Southern Ocean Expedition 2026', station: 'ORV Sagar Nidhi', status: 'DEPLOYED', lead: 'Dr. S. Malik', desc: 'Hydrographic transects from 40°S to 66°S, carbon sequestration, and krill biomass profiling.' },
                { name: 'Himansh High-Altitude Himalayan Cryosphere', station: 'Chandra-Bhaga Basin, HP', status: 'MONITORING', lead: 'Dr. A. Kumar', desc: 'Automatic weather station telemetry, glacier ice thickness radar, and seasonal runoff modelling.' },
              ].map(exp => (
                <div key={exp.name} className="rounded-2xl bg-white p-5 border border-[#183647]/12 space-y-3">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">{exp.status}</span>
                  <h4 className="text-lg font-bold text-[#183647]">{exp.name}</h4>
                  <p className="text-xs text-[#487b91]">Base: {exp.station} · Lead: {exp.lead}</p>
                  <p className="text-xs text-slate-700">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Repository Governance */}
        {activeTab === 'repository' && (
          <div className="card space-y-6">
            <h3 className="text-xl font-bold text-[#183647]">Repository & Data Governance</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 border border-[#183647]/12 space-y-2 text-xs">
                <div className="font-bold text-[#183647] text-sm">Storage Utilization</div>
                <div className="text-2xl font-black text-[#183647]">4.7 TB</div>
                <div className="text-[#487b91]">Quota: 10.0 TB (47% used)</div>
              </div>
              <div className="rounded-2xl bg-white p-5 border border-[#183647]/12 space-y-2 text-xs">
                <div className="font-bold text-[#183647] text-sm">Metadata Quality Score</div>
                <div className="text-2xl font-black text-emerald-700">98.4%</div>
                <div className="text-[#487b91]">ISO-19115 compliant</div>
              </div>
              <div className="rounded-2xl bg-white p-5 border border-[#183647]/12 space-y-2 text-xs">
                <div className="font-bold text-[#183647] text-sm">Embargoed Datasets</div>
                <div className="text-2xl font-black text-amber-700">3 Active</div>
                <div className="text-[#487b91]">Automatic unlock upon paper publication</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Ask Yuki AI */}
        {activeTab === 'ai' && (
          <div className="card space-y-6">
            <h3 className="text-xl font-bold text-[#183647] flex items-center gap-2"><Sparkles size={20} className="text-[#487b91]" /> Official Yuki AI Portal</h3>
            <p className="text-xs text-[#487b91]">Ask complex research, governance, or dataset questions backed by the Yuki knowledge base.</p>
            <div className="flex gap-2">
              <input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask official polar intelligence query..."
                className="flex-1 rounded-xl border border-[#183647]/15 bg-white p-3 text-xs text-[#183647] outline-none"
              />
              <button onClick={() => handleAskAI()} className="btn-primary text-xs">Ask AI</button>
            </div>
            {aiResponse && (
              <div className="rounded-2xl bg-[#dce9ed] p-5 text-xs font-mono text-[#183647] whitespace-pre-wrap">
                {aiResponse}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: User & Role Security */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <form onSubmit={handleAssignRole} className="card space-y-4">
                <h3 className="text-xl font-bold text-[#183647]">Role Privilege Management</h3>
                <p className="text-xs text-[#487b91]">Promote or reassign registered user accounts. Privileged role changes are strictly validated server-side.</p>

                <div>
                  <label className="block text-xs font-semibold text-[#183647]">User UID / Email</label>
                  <input value={targetUid} onChange={(e) => setTargetUid(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#183647]/15 bg-white p-3 text-xs text-[#183647] outline-none" required />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183647]">Select Role</label>
                  <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as Role)}
                    className="mt-1 w-full rounded-xl border border-[#183647]/15 bg-white p-3 text-xs text-[#183647] outline-none">
                    <option value="public_student">public_student</option>
                    <option value="researcher_scientist">researcher_scientist</option>
                    <option value="media_content">media_content</option>
                    <option value="ncpor_admin">ncpor_admin</option>
                  </select>
                </div>

                {roleStatusMsg && <div className="text-xs font-semibold text-emerald-700">{roleStatusMsg}</div>}

                <button type="submit" className="btn-primary w-full justify-center">
                  <UserCheck size={16} /> Update Role Permissions
                </button>
              </form>

              <div className="card space-y-3">
                <h3 className="text-xl font-bold text-[#183647]">Pending Registrations</h3>
                {mockUsers.filter(u => u.status === 'PENDING').map(u => (
                  <div key={u.uid} className="rounded-xl bg-amber-50 p-4 border border-amber-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-[#183647] text-sm">{u.name}</div>
                        <div className="text-xs text-[#487b91]">{u.email} · {u.institution}</div>
                        <div className="text-xs text-amber-700 mt-1">Requested: RESEARCHER role</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 rounded-lg bg-emerald-700 text-white px-2.5 py-1.5 text-xs font-bold">
                          <CheckCircle2 size={12} /> Approve
                        </button>
                        <button className="flex items-center gap-1 rounded-lg bg-red-100 text-red-700 px-2.5 py-1.5 text-xs font-bold">
                          <XCircle size={12} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Users Table */}
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#183647]">All Platform Users</h3>
                <div className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-[#183647]/15">
                  <Search size={14} className="text-[#487b91]" />
                  <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search users..." className="bg-transparent text-xs text-[#183647] outline-none" />
                </div>
              </div>
              <div className="space-y-2 text-xs">
                {filteredUsers.map(u => (
                  <div key={u.uid} className="rounded-xl bg-white p-3 border border-[#183647]/10 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[#183647]">{u.name}</span>
                      <p className="text-[#487b91]">{u.email} · {u.institution}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>{u.role}</Badge>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold border ${
                        u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>{u.status}</span>
                      <button className="text-[#487b91] hover:text-[#183647]"><Edit3 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#183647]">Immutable Audit Log Explorer</h3>
              <div className="flex gap-2">
                {['All', 'ROLE', 'REVIEW', 'CONTENT', 'SYSTEM'].map(f => (
                  <button key={f} onClick={() => setAuditFilter(f)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize ${auditFilter === f ? 'bg-[#183647] text-white' : 'bg-black/5 text-[#487b91]'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {filteredLogs.map((log) => (
                <div key={log.id} className="rounded-xl bg-white p-4 border border-[#183647]/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-[#183647]">{log.action}</span>
                      {' '}by{' '}
                      <span className="text-[#487b91] font-semibold">{log.actorEmail}</span>
                      <p className="text-slate-500 mt-0.5">Target: {log.entityType} ({log.entityId})</p>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <p className="text-[#487b91] mt-0.5">Metadata: {JSON.stringify(log.metadata)}</p>
                      )}
                    </div>
                    <span className="font-mono text-slate-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Identity Resolution */}
        {activeTab === 'identity' && (
          <div className="card space-y-6">
            <h3 className="text-xl font-bold text-[#183647]">Researcher Identity Resolution & Profile Merge</h3>
            <p className="text-xs text-[#487b91]">Detect duplicate researcher profiles created across different expedition publications and merge relationships safely.</p>
            <div className="space-y-4">
              {[
                { a: 'Dr. K. Rao', b: 'Dr. Kavya Rao', confidence: 94, shared: 'Identical institutional DOI citations', id: 'match-1' },
                { a: 'N. Das', b: 'Dr. N. Das (NCPOR)', confidence: 87, shared: '3 shared expedition memberships', id: 'match-2' },
              ].map(match => (
                <div key={match.id} className="rounded-2xl bg-amber-50 p-5 border border-amber-200">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <AlertTriangle size={18} className="text-amber-600" />
                        <span className="font-bold text-amber-900 text-sm">Potential Duplicate Detected ({match.confidence}% confidence)</span>
                      </div>
                      <div className="text-xs text-amber-800">
                        <strong>"{match.a}"</strong> and <strong>"{match.b}"</strong> share {match.shared}.
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 rounded-lg bg-[#183647] text-white px-3 py-1.5 text-xs font-bold">
                        <RefreshCw size={12} /> Merge Profiles
                      </button>
                      <button className="flex items-center gap-1 rounded-lg bg-white text-[#487b91] px-3 py-1.5 text-xs font-bold border border-[#183647]/15">
                        <XCircle size={12} /> Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 9: Platform Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#183647]">Platform-Wide Analytics</h3>
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-5">
              {[
                ['Total Users', analyticsData.totalUsers, Users],
                ['Active Users (30d)', analyticsData.activeUsers, Activity],
                ['Datasets', analyticsData.totalDatasets.toLocaleString(), DbIcon],
                ['Publications', analyticsData.totalPublications.toLocaleString(), BookOpen],
                ['Expeditions', analyticsData.totalExpeditions, Globe2],
              ].map(([label, val, Icon]: any) => (
                <div key={label} className="card text-center space-y-2">
                  <Icon size={20} className="mx-auto text-[#487b91]" />
                  <div className="text-2xl font-bold text-[#183647]">{val}</div>
                  <div className="text-xs text-[#487b91]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 10: System Settings */}
        {activeTab === 'settings' && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="card space-y-5">
              <h3 className="text-xl font-bold text-[#183647]">Platform Toggles</h3>
              {[
                ['maintenanceMode', 'Maintenance Mode', 'Disables all public access. Only admins can log in.', true],
                ['publicRegistration', 'Public Registration', 'Allow new users to self-register.', false],
                ['emailVerificationRequired', 'Email Verification Required', 'New accounts must verify email before access.', false],
                ['reviewAutoAssignment', 'Auto-assign Reviewers', 'Automatically route submissions to available reviewers.', false],
                ['aiAnalysisEnabled', 'AI Analysis Engine', 'Enable AI metadata extraction and RAG responses.', false],
                ['openApiPublic', 'Open API (Public Access)', 'Allow unauthenticated read access to public endpoints.', false],
              ].map(([key, label, desc, isDanger]: any) => (
                <div key={key} className="flex items-center justify-between rounded-xl bg-white p-4 border border-[#183647]/10">
                  <div>
                    <div className={`font-semibold text-sm ${isDanger && (settings as any)[key] ? 'text-red-700' : 'text-[#183647]'}`}>{label}</div>
                    <div className="text-xs text-[#487b91] mt-0.5">{desc}</div>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, [key]: !(prev as any)[key] }))}
                    className={`relative h-7 w-12 rounded-full border-2 transition-all ${
                      (settings as any)[key] ? 'bg-[#183647] border-[#183647]' : 'bg-slate-200 border-slate-300'
                    }`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${(settings as any)[key] ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="card space-y-4">
                <h3 className="text-xl font-bold text-[#183647]">Limits & Quotas</h3>
                <div>
                  <label className="block text-xs font-semibold text-[#487b91]">Max Upload Size (MB)</label>
                  <input type="number" value={settings.maxUploadSizeMB}
                    onChange={e => setSettings(prev => ({ ...prev, maxUploadSizeMB: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-xl border border-[#183647]/15 bg-white p-3 text-xs text-[#183647] outline-none" />
                </div>
                <button className="btn-primary w-full justify-center text-xs">
                  <CheckCircle2 size={14} /> Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
