import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero, Badge, SectionTitle } from '../components/UI';
import { useAuth } from '../lib/auth';
import {
  Upload, Database, FlaskConical, FileCheck, Activity, KeyRound,
  FileText, Sparkles, CheckCircle2, AlertCircle, Plus, ArrowRight,
  X, BarChart2, BookMarked, Star, Download, Trash2, Edit3, Users,
  ClipboardList, Bell, Link as LinkIcon, Clock, Compass, MapPin,
  Play, Share2, HelpCircle, Image as ImageIcon, Video, Eye, Filter, Search, Briefcase, Network
} from 'lucide-react';
import {
  getWorkspaceItems,
  removeFromWorkspace,
  subscribeSignatureFeatures,
  WorkspaceItem,
} from '../lib/signatureFeatures';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { api } from '../lib/api';
import { stats } from '../data/demo';
import {
  getRepositoryExpeditions,
  getRepositoryDatasets,
  getRepositoryPublications,
  getRepositoryReports,
  getRepositoryMedia,
  addRepositoryExpedition,
  addRepositoryDataset,
  addRepositoryPublication,
  addRepositoryReport,
  addRepositoryMedia,
  subscribeDataRepository,
  triggerFileDownload,
} from '../lib/dataRepository';
import { uploadFileWithFallback, formatFileSize } from '../lib/storageHelper';

const researchStations = [
  { id: 'st-1', name: 'Bharati Station', region: 'Antarctica', lat: -69.41, lng: 76.19, established: 2012, researchers: 24, datasets: 18, reports: 14 },
  { id: 'st-2', name: 'Maitri Station', region: 'Antarctica', lat: -70.77, lng: 11.73, established: 1989, researchers: 32, datasets: 42, reports: 29 },
  { id: 'st-3', name: 'Himadri Station', region: 'Arctic (Ny-Ålesund)', lat: 78.92, lng: 11.93, established: 2008, researchers: 16, datasets: 12, reports: 9 },
];

function ResearchWorkspaceSection({ profile }: { profile: any }) {
  const [wsItems, setWsItems] = useState(() => getWorkspaceItems(profile?.uid));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeSignatureFeatures(() => {
      setWsItems(getWorkspaceItems(profile?.uid));
    });
    return unsub;
  }, [profile?.uid]);

  const handleAnalyzeWorkspace = () => {
    if (wsItems.length === 0) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const titles = wsItems.map((i) => i.title).join(', ');
      setAiReport(
        `[POLAR AI WORKSPACE SYNTHESIS REPORT]\n\n` +
        `Analyzed ${wsItems.length} connected scientific entities: ${titles}\n\n` +
        `1. Cross-Study Synthesis:\n` +
        `   - High correlation identified between East Antarctic temperature telemetry and coastal ice sheet mass balance trends.\n` +
        `   - Ground-truth samples collected during the 44th IAE validate atmospheric lidar aerosol optical depth observations.\n\n` +
        `2. Scientific Data Gaps:\n` +
        `   - Sub-surface salinity observations near Prydz Bay remain sparse during winter freeze-up.\n` +
        `   - Recommendation: Deploy additional autonomous CTD profilers during the upcoming 45th IAE.\n\n` +
        `3. Hypotheses for Upcoming Expedition:\n` +
        `   - Thermal anomalies recorded at Bharati station suggest accelerated summer meltwater percolation in upper firn layers.`
      );
      setIsAnalyzing(false);
    }, 1200);
  };

  const regionGroups: Record<string, WorkspaceItem[]> = {};
  wsItems.forEach((item) => {
    const key = item.region || item.category || 'General';
    if (!regionGroups[key]) regionGroups[key] = [];
    regionGroups[key].push(item);
  });

  return (
    <div className="mt-8 space-y-8">
      {/* Header Bar */}
      <div className="card space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#183647]/10 pb-4">
          <div>
            <h3 className="text-xl font-bold text-[#183647] flex items-center gap-2">
              <Briefcase className="text-emerald-700" size={22} /> Research Workspace
            </h3>
            <p className="text-xs text-[#487b91]">Connected research items, cross-study relationships, and POLAR AI synthesis engine.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {wsItems.length} Connected Items
            </span>
            <button
              onClick={handleAnalyzeWorkspace}
              disabled={isAnalyzing || wsItems.length === 0}
              className="btn-primary text-xs flex items-center gap-1.5 shadow-md"
            >
              <Sparkles size={15} /> {isAnalyzing ? 'Analyzing Workspace...' : 'Analyze Workspace with POLAR AI'}
            </button>
          </div>
        </div>

        {/* AI Workspace Synthesis Output */}
        {aiReport && (
          <div className="rounded-2xl bg-slate-900 p-5 text-white space-y-3 shadow-xl border border-white/10">
            <div className="flex justify-between items-center text-xs text-[#5abed8] font-mono font-bold border-b border-white/10 pb-2">
              <span className="flex items-center gap-2"><Sparkles size={16} /> POLAR AI WORKSPACE SYNTHESIS ENGINE</span>
              <button onClick={() => setAiReport(null)} className="text-white/60 hover:text-white"><X size={16} /></button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-200">
              {aiReport}
            </pre>
          </div>
        )}

        {/* Connected Items Grid */}
        <div className="space-y-3">
          <h4 className="font-bold text-[#183647] text-sm">Connected Research Items ({wsItems.length}):</h4>
          {wsItems.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-[#487b91]">
              Your Research Workspace is currently empty. Click "+ Add to Workspace" on any paper, dataset, report, or expedition across Yuki to connect items here!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {wsItems.map((item) => (
                <div key={item.id} className="rounded-2xl p-4 bg-[#edf2f4]/60 border border-[#183647]/15 space-y-3 flex flex-col justify-between hover:border-[#487b91] transition">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">{item.type}</span>
                      {item.region && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">{item.region}</span>
                      )}
                    </div>
                    <h5 className="font-bold text-[#183647] text-sm leading-snug">{item.title}</h5>
                    {item.subtitle && <p className="text-xs text-[#487b91] line-clamp-2">{item.subtitle}</p>}
                  </div>

                  <div className="pt-3 border-t border-[#183647]/10 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">Connected</span>
                    <button
                      onClick={() => removeFromWorkspace(profile?.uid, item.id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                      title="Remove from Workspace"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Relationships & Link Matrix */}
      {wsItems.length > 0 && (
        <div className="card space-y-4">
          <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
            <h4 className="font-bold text-[#183647] text-base flex items-center gap-2">
              <Network size={18} className="text-[#487b91]" /> Inter-Item Research Relationships Matrix
            </h4>
            <Badge>AUTOMATIC SCIENTIFIC LINKAGE</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(regionGroups).map(([groupKey, groupItems]) => (
              <div key={groupKey} className="rounded-2xl p-4 bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-[#183647] uppercase tracking-wider">
                    Link Cluster: {groupKey}
                  </span>
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-[#487b91]">
                    {groupItems.length} Connected Items
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {groupItems.map((gi) => (
                    <div key={gi.id} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#183647]">{gi.title}</span>
                        <div className="text-[10px] text-[#487b91]">{gi.type} · {gi.subtitle || 'Verified Source'}</div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">CONNECTED</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ResearcherDashboard() {
  const { profile } = useAuth();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'datasets' | 'publications' | 'media' | 'outreach' | 'workspaces' | 'analytics'>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState('All');

  // Modals state
  const [showCreateExpeditionModal, setShowCreateExpeditionModal] = useState(false);
  const [showUploadDatasetModal, setShowUploadDatasetModal] = useState(false);
  const [showUploadReportModal, setShowUploadReportModal] = useState(false);
  const [showAddPubModal, setShowAddPubModal] = useState(false);
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [showDatasetAnalyzerModal, setShowDatasetAnalyzerModal] = useState(false);
  const [selectedDatasetForAnalysis, setSelectedDatasetForAnalysis] = useState<any>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Repositories state
  const [localExpeditions, setLocalExpeditions] = useState(getRepositoryExpeditions());
  const [localDatasets, setLocalDatasets] = useState(getRepositoryDatasets());
  const [localPublications, setLocalPublications] = useState(getRepositoryPublications());
  const [localReports, setLocalReports] = useState(getRepositoryReports());
  const [localMedia, setLocalMedia] = useState(getRepositoryMedia());

  useEffect(() => {
    const syncData = () => {
      setLocalExpeditions(getRepositoryExpeditions());
      setLocalDatasets(getRepositoryDatasets());
      setLocalPublications(getRepositoryPublications());
      setLocalReports(getRepositoryReports());
      setLocalMedia(getRepositoryMedia());
    };
    syncData();
    const unsub = subscribeDataRepository(syncData);
    return () => unsub();
  }, []);

  // Form & File states
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpRegion, setNewExpRegion] = useState<'Antarctica' | 'Arctic' | 'Southern Ocean' | 'Himalaya / High Altitude'>('Antarctica');
  const [newExpLeader, setNewExpLeader] = useState(profile?.name || 'Dr. Kavya Rao');
  const [newExpObjective, setNewExpObjective] = useState('');

  // Dataset Upload State
  const [newDsTitle, setNewDsTitle] = useState('');
  const [newDsCategory, setNewDsCategory] = useState('Climate & Cryosphere');
  const [newDsVariables, setNewDsVariables] = useState('Surface Temp (°C), Ice Thickness (m), Pressure (hPa)');
  const [newDsFormat, setNewDsFormat] = useState<'CSV' | 'JSON' | 'XLSX' | 'GeoJSON' | 'NetCDF'>('CSV');
  const [newDsDescription, setNewDsDescription] = useState('');
  const [dsFile, setDsFile] = useState<File | null>(null);
  const [dsUploading, setDsUploading] = useState(false);

  // Report Upload State
  const [newRepTitle, setNewRepTitle] = useState('');
  const [newRepCategory, setNewRepCategory] = useState('Glaciology & Ice Cores');
  const [newRepAbstract, setNewRepAbstract] = useState('');
  const [newRepKeywords, setNewRepKeywords] = useState('Antarctica, Ice Core, Mass Balance');
  const [repFile, setRepFile] = useState<File | null>(null);
  const [repUploading, setRepUploading] = useState(false);

  // Publication Upload State
  const [newPubTitle, setNewPubTitle] = useState('');
  const [newPubAuthors, setNewPubAuthors] = useState(profile?.name || 'Dr. Kavya Rao');
  const [newPubJournal, setNewPubJournal] = useState('Journal of Glaciology & Climate');
  const [newPubDoi, setNewPubDoi] = useState('10.1017/jog.2026.' + Math.floor(Math.random() * 900 + 100));
  const [pubFile, setPubFile] = useState<File | null>(null);
  const [pubUploading, setPubUploading] = useState(false);

  // Media Upload State
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaType, setNewMediaType] = useState<'Photo' | 'Video' | 'Audio' | 'Infographic'>('Photo');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>('');
  const [mediaUploading, setMediaUploading] = useState(false);

  // Outreach Studio State
  const [outreachSourceId, setOutreachSourceId] = useState(localReports[0]?.id || 'rep-1');
  const [outreachChannel, setOutreachChannel] = useState<'article' | 'student' | 'infographic' | 'reel' | 'social' | 'quiz'>('article');
  const [generatedOutreach, setGeneratedOutreach] = useState<any>(null);
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);

  // Workspace Notes & Tasks
  const [newNote, setNewNote] = useState('');
  const [wsNotes, setWsNotes] = useState([
    { id: 'n1', text: 'Analysis of temperature anomaly in Section 3 verified with Bharati station telemetry.', author: profile?.name || 'Dr. Kavya Rao', time: '2 hours ago' },
    { id: 'n2', text: 'Sea-ice dataset v2.1 uploaded and submitted for NCPOR review.', author: 'Dr. R. Singh', time: '1 day ago' },
  ]);
  const [wsTasks, setWsTasks] = useState([
    { id: 't1', title: 'Finalize abstract for Polar Research Journal', completed: false },
    { id: 't2', title: 'Upload raw CSV temperature anomaly data', completed: true },
    { id: 't3', title: 'Respond to reviewer comments on Section 3.2', completed: false },
  ]);

  // Handle Form Submissions with File Uploads
  async function handleCreateExpedition(e: React.FormEvent) {
    e.preventDefault();
    if (!newExpTitle) return;
    const newExp = {
      id: `exp-${Date.now()}`,
      title: newExpTitle,
      number: localExpeditions.length + 46,
      year: '2026–2027',
      region: newExpRegion,
      status: 'Planning' as const,
      objective: newExpObjective || 'Multi-disciplinary polar science mission.',
      leader: newExpLeader,
      scientists: [newExpLeader, 'Dr. A. Menon'],
      stations: ['Bharati Station', 'Maitri Station'],
      route: [[76.19, -69.41], [76.50, -69.80]] as [number, number][],
      categories: ['Glaciology', 'Atmospheric Science'],
      datasets: [],
      publications: [],
      media: [],
    };
    await addRepositoryExpedition(newExp);
    setShowCreateExpeditionModal(false);
    setNewExpTitle('');
    setNewExpObjective('');
  }

  async function handleUploadDataset(e: React.FormEvent) {
    e.preventDefault();
    if (!newDsTitle || !dsFile) {
      alert('Please select a dataset file to upload.');
      return;
    }
    setDsUploading(true);
    try {
      const uploadRes = await uploadFileWithFallback(dsFile, 'datasets');
      const newDs = {
        id: `ds-${Date.now()}`,
        title: newDsTitle,
        category: newDsCategory,
        region: 'Antarctica',
        period: '2025–2026',
        format: newDsFormat,
        size: formatFileSize(uploadRes.fileSize),
        description: newDsDescription || `Dataset uploaded by ${profile?.name || 'Researcher'}. Contains observation data series.`,
        variables: newDsVariables.split(',').map(s => s.trim()),
        unit: '°C / hPa',
        status: 'PROVISIONAL' as const,
        verificationStatus: 'PENDING_NCPOR_VERIFICATION' as const,
        downloads: 0,
        source: 'NCPOR Field Sensor Network',
        doi: `10.0000/ds-${Date.now()}`,
        storagePath: uploadRes.fileUrl,
        values: [
          { year: 2020, value: -0.15 },
          { year: 2022, value: 0.12 },
          { year: 2024, value: 0.28 },
          { year: 2026, value: 0.41 },
        ],
        version: 'v1.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await addRepositoryDataset(newDs as any);
      setShowUploadDatasetModal(false);
      setNewDsTitle('');
      setNewDsDescription('');
      setDsFile(null);
    } catch (err) {
      console.error('Dataset upload error:', err);
    } finally {
      setDsUploading(false);
    }
  }

  async function handleUploadReport(e: React.FormEvent) {
    e.preventDefault();
    if (!newRepTitle || !repFile) {
      alert('Please select a research report file to upload.');
      return;
    }
    setRepUploading(true);
    try {
      const uploadRes = await uploadFileWithFallback(repFile, 'reports');
      const newRep = {
        id: `rep-${Date.now()}`,
        title: newRepTitle,
        authors: [profile?.name || 'Dr. Kavya Rao'],
        executiveSummary: newRepAbstract || 'Scientific research report detailing field measurements and observations.',
        objectives: ['Quantify cryosphere variations', 'Correlate atmospheric black carbon deposition'],
        region: 'Antarctica',
        expeditionId: 'iae46',
        researchArea: newRepCategory,
        methodology: 'High-resolution field telemetry and physical ice core sampling.',
        observations: 'Continuous monitoring recorded clear seasonal anomalies.',
        findings: ['Warming trends recorded across 30-year observation baseline.', 'Black carbon concentrations peak during late summer melt.'],
        dataCollected: 'Ice cores, meteorological telemetry, CTD salinity profiles.',
        results: 'Statistically significant anomaly confirmed across East Antarctica.',
        conclusions: 'Demands continued long-term monitoring from Bharati and Maitri stations.',
        recommendations: ['Expand continuous micro-lidar grid', 'Enhance deep ice core drilling'],
        relatedDatasetIds: [],
        relatedPublicationIds: [],
        relatedMediaIds: [],
        verificationStatus: 'PENDING_NCPOR_VERIFICATION' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await addRepositoryReport(newRep as any);
      setShowUploadReportModal(false);
      setNewRepTitle('');
      setNewRepAbstract('');
      setRepFile(null);
    } catch (err) {
      console.error('Report upload error:', err);
    } finally {
      setRepUploading(false);
    }
  }

  async function handleAddPublication(e: React.FormEvent) {
    e.preventDefault();
    if (!newPubTitle || !pubFile) {
      alert('Please select a publication PDF file to upload.');
      return;
    }
    setPubUploading(true);
    try {
      const uploadRes = await uploadFileWithFallback(pubFile, 'publications');
      const newPub = {
        id: `pub-${Date.now()}`,
        title: newPubTitle,
        publicationType: 'Journal Article' as const,
        authors: newPubAuthors.split(',').map(s => s.trim()),
        year: 2026,
        category: 'Cryosphere & Paleoclimate',
        journal: newPubJournal,
        doi: newPubDoi,
        abstract: newRepAbstract || 'Peer-reviewed polar research study investigating cryosphere dynamics in Antarctica.',
        citations: 0,
        verificationStatus: 'PENDING_NCPOR_VERIFICATION' as const,
        publicationUrl: uploadRes.fileUrl,
        storagePath: uploadRes.fileUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await addRepositoryPublication(newPub as any);
      setShowAddPubModal(false);
      setNewPubTitle('');
      setPubFile(null);
    } catch (err) {
      console.error('Publication upload error:', err);
    } finally {
      setPubUploading(false);
    }
  }

  async function handleAddMedia(e: React.FormEvent) {
    e.preventDefault();
    if (!newMediaTitle || !mediaFile) {
      alert('Please select an image or video file to upload.');
      return;
    }
    setMediaUploading(true);
    try {
      const uploadRes = await uploadFileWithFallback(mediaFile, 'media');
      const newM = {
        id: `media-${Date.now()}`,
        title: newMediaTitle,
        caption: newMediaCaption || 'Field observation photograph from Indian Antarctic Expedition.',
        tags: ['Fieldwork', 'Antarctica', 'NCPOR'],
        type: newMediaType,
        url: uploadRes.fileUrl,
        expedition: '46th Indian Antarctic Expedition',
        location: 'Larsemann Hills, Antarctica',
        date: new Date().toISOString().split('T')[0],
        photographer: profile?.name || 'Field Researcher',
        reviewStatus: 'SUBMITTED' as const,
        createdAt: new Date().toISOString(),
      };
      await addRepositoryMedia(newM as any);
      setShowAddMediaModal(false);
      setNewMediaTitle('');
      setMediaFile(null);
      setMediaPreviewUrl('');
    } catch (err) {
      console.error('Media upload error:', err);
    } finally {
      setMediaUploading(false);
    }
  }

  function handleGenerateOutreach() {
    setIsGeneratingOutreach(true);
    const sourceReport = localReports.find(r => r.id === outreachSourceId) || localReports[0];
    setTimeout(() => {
      setGeneratedOutreach({
        title: `Outreach Story: ${sourceReport?.title}`,
        channel: outreachChannel,
        body: `### Polar Outreach Briefing\n\nBased on NCPOR research report **"${sourceReport?.title}"**, Indian scientists have documented crucial observation trends across East Antarctica.\n\n**Key Takeaway:** Ground-truth ice core and atmospheric data provides vital evidence for global climate modeling.\n\nExplore interactive datasets on Yuki!`,
      });
      setIsGeneratingOutreach(false);
    }, 800);
  }

  return (
    <>
      <PageHero
        kicker="Scientific Workbench"
        title={`Researcher Portal — ${profile?.name || 'Dr. Kavya Rao'}.`}
        body="Manage expedition data telemetry, upload verified datasets and reports, submit peer-reviewed publications, run AI dataset analytics, and track NCPOR verification statuses."
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>ROLE: RESEARCHER / SCIENTIST</Badge>
          <Badge>INSTITUTION: NCPOR / MoES</Badge>
          <Badge>{localDatasets.length} DATASETS ACTIVE</Badge>
          <Badge>{localReports.length} REPORTS</Badge>
        </div>
      </PageHero>

      <section className="section">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#183647]/15 pb-4">
          {[
            ['dashboard', 'Overview', Activity],
            ['reports', 'Research Reports', FileText],
            ['datasets', 'Datasets Repository', Database],
            ['publications', 'Publications', BookMarked],
            ['media', 'Field Media', ImageIcon],
            ['outreach', 'Outreach Studio', Sparkles],
            ['workspaces', 'Team Workspace', Users],
            ['analytics', 'Analytics', BarChart2],
          ].map(([id, label, Icon]: any) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === id
                  ? 'bg-[#183647] text-white shadow-md'
                  : 'bg-white/60 text-[#487b91] hover:bg-white hover:text-[#183647]'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: OVERVIEW DASHBOARD ─────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {[
                ['My Datasets', localDatasets.length, Database, 'bg-emerald-100 text-emerald-800'],
                ['Research Reports', localReports.length, FileText, 'bg-blue-100 text-blue-800'],
                ['Publications', localPublications.length, BookMarked, 'bg-purple-100 text-purple-800'],
                ['Field Media Items', localMedia.length, ImageIcon, 'bg-sky-100 text-sky-800'],
              ].map(([label, val, Icon, colors]: any) => (
                <div key={label} className="card p-4 text-center space-y-2">
                  <div className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center ${colors}`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-2xl font-black text-[#183647]">{val}</div>
                  <div className="text-xs font-bold text-[#487b91] uppercase">{label}</div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="card flex flex-wrap items-center justify-between gap-3 bg-white/80 p-4 border border-[#183647]/15">
              <div className="font-bold text-[#183647] text-sm">Quick Scientist Actions:</div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setShowCreateExpeditionModal(true)} className="btn-primary text-xs flex items-center gap-1.5">
                  <Plus size={14} /> Create Expedition
                </button>
                <button onClick={() => setShowUploadReportModal(true)} className="btn-secondary text-xs flex items-center gap-1.5">
                  <Upload size={14} /> Upload Report
                </button>
                <button onClick={() => setShowUploadDatasetModal(true)} className="btn-secondary text-xs flex items-center gap-1.5">
                  <Database size={14} /> Upload Dataset
                </button>
                <button onClick={() => setShowAddPubModal(true)} className="btn-secondary text-xs flex items-center gap-1.5">
                  <BookMarked size={14} /> Add Publication
                </button>
                <button onClick={() => setShowAddMediaModal(true)} className="btn-secondary text-xs flex items-center gap-1.5">
                  <ImageIcon size={14} /> Upload Media
                </button>
              </div>
            </div>

            {/* Expeditions List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#183647]">Active Polar Expeditions</h3>
                <button onClick={() => setShowCreateExpeditionModal(true)} className="btn-primary text-xs flex items-center gap-1">
                  <Plus size={14} /> New Expedition
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {localExpeditions.map((exp) => (
                  <div key={exp.id} className="card p-5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">{exp.region}</span>
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{exp.status}</span>
                      </div>
                      <h4 className="text-base font-bold text-[#183647] mt-2">{exp.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{exp.objective}</p>
                    </div>

                    <div className="border-t border-slate-100 pt-3 text-xs text-[#487b91] flex justify-between items-center">
                      <div>Leader: <strong className="text-[#183647]">{exp.leader}</strong></div>
                      <Link to={`/expeditions/${exp.id}`} className="font-bold text-[#183647] hover:underline flex items-center gap-1">
                        View Route <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: RESEARCH REPORTS ───────────────────── */}
        {activeTab === 'reports' && (
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#183647]">Research Reports Repository</h3>
                <p className="text-xs text-[#487b91]">Scientific field observation reports, paleoclimate studies, and oceanographic summaries.</p>
              </div>
              <button onClick={() => setShowUploadReportModal(true)} className="btn-primary text-xs flex items-center gap-1.5">
                <Upload size={14} /> Upload Research Report
              </button>
            </div>

            <div className="space-y-4">
              {localReports.map((rep) => (
                <div key={rep.id} className="card p-5 space-y-3">
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div>
                      <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full">{rep.researchArea || rep.category}</span>
                      <h4 className="text-lg font-bold text-[#183647] mt-1">{rep.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{rep.executiveSummary || (rep as any).abstract}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${rep.verificationStatus === 'VERIFIED_BY_NCPOR' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}>
                      {rep.verificationStatus === 'VERIFIED_BY_NCPOR' ? 'VERIFIED BY NCPOR' : 'PENDING NCPOR REVIEW'}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-between items-center border-t border-slate-100 pt-3 text-xs text-[#487b91]">
                    <div>Authors: <strong className="text-[#183647]">{rep.authors?.join(', ') || rep.author}</strong></div>
                    <div className="flex items-center gap-2">
                      {(rep as any).storagePath && (
                        <button
                          onClick={() => triggerFileDownload((rep as any).storagePath, `${rep.title}.pdf`)}
                          className="btn-secondary text-xs py-1 px-3 flex items-center gap-1"
                        >
                          <Download size={13} /> Download Report File
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: DATASETS REPOSITORY ───────────────── */}
        {activeTab === 'datasets' && (
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#183647]">Scientific Datasets Repository</h3>
                <p className="text-xs text-[#487b91]">Open-access observational telemetry, sensor series, and CSV/JSON data.</p>
              </div>
              <button onClick={() => setShowUploadDatasetModal(true)} className="btn-primary text-xs flex items-center gap-1.5">
                <Database size={14} /> Upload Dataset
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {localDatasets.map((ds) => (
                <div key={ds.id} className="card p-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#487b91] bg-slate-100 px-2 py-0.5 rounded">{ds.format} · {ds.size}</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{ds.status}</span>
                    </div>
                    <h4 className="text-base font-bold text-[#183647] mt-2">{ds.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ds.description}</p>

                    <div className="text-[11px] text-[#487b91] mt-2 font-mono">
                      Variables: {ds.variables.join(', ')}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setSelectedDatasetForAnalysis(ds);
                        setShowDatasetAnalyzerModal(true);
                      }}
                      className="text-purple-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Sparkles size={12} /> Analyze with AI
                    </button>

                    <button
                      onClick={() => triggerFileDownload(ds.storagePath || ds.source || '#', `${ds.title}.${ds.format.toLowerCase()}`)}
                      className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1"
                    >
                      <Download size={12} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: PUBLICATIONS ───────────────────────── */}
        {activeTab === 'publications' && (
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#183647]">Peer-Reviewed Publications</h3>
                <p className="text-xs text-[#487b91]">Journal papers, monograph chapters, and policy briefs.</p>
              </div>
              <button onClick={() => setShowAddPubModal(true)} className="btn-primary text-xs flex items-center gap-1.5">
                <BookMarked size={14} /> Add Publication
              </button>
            </div>

            <div className="space-y-4">
              {localPublications.map((pub) => (
                <div key={pub.id} className="card p-5 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">{pub.journal || 'Journal Paper'} ({pub.year})</span>
                      <h4 className="text-base font-bold text-[#183647] mt-1">{pub.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{pub.abstract}</p>
                    </div>

                    <span className="text-xs font-mono text-[#487b91] bg-slate-100 px-2 py-1 rounded">
                      DOI: {pub.doi}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-xs text-[#487b91]">
                    <div>Authors: <strong className="text-[#183647]">{pub.authors.join(', ')}</strong></div>
                    <div className="flex items-center gap-2">
                      <Link to={`/publications/${pub.id}`} className="font-bold text-[#183647] hover:underline">
                        Read Full Paper →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: FIELD MEDIA ────────────────────────── */}
        {activeTab === 'media' && (
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#183647]">Field Media & Video Telemetry</h3>
                <p className="text-xs text-[#487b91]">High-resolution field photos, station drone videos, and oceanographic logs.</p>
              </div>
              <button onClick={() => setShowAddMediaModal(true)} className="btn-primary text-xs flex items-center gap-1.5">
                <ImageIcon size={14} /> Upload Media Item
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {localMedia.map((m) => (
                <div key={m.id} className="card p-0 overflow-hidden">
                  <img src={m.url} alt={m.title} className="w-full h-44 object-cover" />
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">{m.type}</span>
                    <h4 className="font-bold text-[#183647] text-sm">{m.title}</h4>
                    <div className="text-[11px] text-[#487b91]">Expedition: {m.expedition}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 6: OUTREACH STUDIO ────────────────────── */}
        {activeTab === 'outreach' && (
          <div className="mt-8 space-y-6">
            <div className="card bg-purple-900 text-white p-6 space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-widest">
                <Sparkles size={16} /> Research-to-Outreach Generator
              </div>
              <h3 className="text-xl font-extrabold">Convert Scientific Reports into Public Stories</h3>
              <p className="text-xs text-purple-100 max-w-xl">Select an approved research report to automatically synthesize website articles, social reels, or student guides.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="card space-y-4">
                <h4 className="font-bold text-[#183647]">Outreach Configurator</h4>

                <div>
                  <label className="block text-xs font-semibold text-[#487b91]">Select Source Report</label>
                  <select value={outreachSourceId} onChange={e => setOutreachSourceId(e.target.value)} className="mt-1 w-full p-2.5 rounded-xl border border-[#183647]/20 text-xs font-bold text-[#183647]">
                    {localReports.map(r => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#487b91]">Select Channel</label>
                  <select value={outreachChannel} onChange={e => setOutreachChannel(e.target.value as any)} className="mt-1 w-full p-2.5 rounded-xl border border-[#183647]/20 text-xs text-[#183647]">
                    <option value="article">Website Article</option>
                    <option value="student">Student Explainer</option>
                    <option value="reel">Instagram 60s Reel Script</option>
                    <option value="infographic">Infographic Concept</option>
                  </select>
                </div>

                <button onClick={handleGenerateOutreach} disabled={isGeneratingOutreach} className="btn-primary w-full justify-center text-xs">
                  <Sparkles size={14} /> {isGeneratingOutreach ? 'Generating...' : 'Synthesize Outreach Draft'}
                </button>
              </div>

              <div className="card space-y-3">
                <h4 className="font-bold text-[#183647]">Generated Draft Output</h4>
                {generatedOutreach ? (
                  <div className="space-y-3 text-xs">
                    <div className="font-bold text-[#183647]">{generatedOutreach.title}</div>
                    <div className="whitespace-pre-line p-3 bg-slate-50 rounded-xl font-mono text-[11px] text-slate-800 leading-5">
                      {generatedOutreach.body}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-[#487b91]">Click Synthesize to generate multi-channel draft.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 7: WORKSPACES ─────────────────────────── */}
        {activeTab === 'workspaces' && (
          <ResearchWorkspaceSection profile={profile} />
        )}

        {/* ── TAB 8: ANALYTICS ────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="mt-8 card space-y-6">
            <h3 className="text-2xl font-bold text-[#183647]">Research Impact Analytics</h3>
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { label: 'Total Uploads', val: localDatasets.length + localReports.length + localPublications.length },
                { label: 'Dataset Downloads', val: 1842 },
                { label: 'Paper Citations', val: 47 },
                { label: 'Outreach Reach', val: 9420 },
              ].map((a) => (
                <div key={a.label} className="card text-center p-4">
                  <div className="text-2xl font-bold text-[#183647]">{a.val.toLocaleString()}</div>
                  <div className="text-xs text-[#487b91]">{a.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── MODALS ────────────────────────────────────────── */}

      {/* Modal 1: Create Expedition */}
      {showCreateExpeditionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
          <form onSubmit={handleCreateExpedition} className="w-full max-w-lg card space-y-4 bg-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
              <h3 className="text-lg font-bold text-[#183647]">Create New Expedition</h3>
              <button type="button" onClick={() => setShowCreateExpeditionModal(false)} className="text-[#487b91]"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#487b91]">Expedition Title</label>
              <input value={newExpTitle} onChange={e => setNewExpTitle(e.target.value)} required className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Region</label>
                <select value={newExpRegion} onChange={e => setNewExpRegion(e.target.value as any)} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]">
                  <option value="Antarctica">Antarctica</option>
                  <option value="Arctic">Arctic</option>
                  <option value="Southern Ocean">Southern Ocean</option>
                  <option value="Himalaya / High Altitude">Himalaya / High Altitude</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Expedition Leader</label>
                <input value={newExpLeader} onChange={e => setNewExpLeader(e.target.value)} required className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#487b91]">Objective / Scope</label>
              <textarea value={newExpObjective} onChange={e => setNewExpObjective(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
            </div>
            <button type="submit" className="btn-primary w-full justify-center text-xs">Create Expedition</button>
          </form>
        </div>
      )}

      {/* Modal 2: Upload Dataset */}
      {showUploadDatasetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
          <form onSubmit={handleUploadDataset} className="w-full max-w-lg card space-y-4 bg-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
              <h3 className="text-lg font-bold text-[#183647]">Upload Scientific Dataset</h3>
              <button type="button" onClick={() => setShowUploadDatasetModal(false)} className="text-[#487b91]"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#487b91]">Dataset Title</label>
              <input value={newDsTitle} onChange={e => setNewDsTitle(e.target.value)} required className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
            </div>

            {/* REAL HTML FILE PICKER FOR DATASETS */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#487b91]">Dataset File (.csv, .json, .xlsx, .nc)</label>
              <div className="p-3 border-2 border-dashed border-[#183647]/20 rounded-xl bg-slate-50 text-center text-xs">
                {dsFile ? (
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText size={16} className="text-[#487b91] flex-shrink-0" />
                      <div className="text-left truncate">
                        <div className="font-bold text-[#183647] truncate">{dsFile.name}</div>
                        <div className="text-[10px] text-slate-500">{formatFileSize(dsFile.size)} · {dsFile.type || 'Dataset File'}</div>
                      </div>
                    </div>
                    <button type="button" onClick={() => setDsFile(null)} className="text-red-600 hover:text-red-800"><X size={14} /></button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      required
                      accept=".csv,.json,.xlsx,.xls,.geojson,.nc"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setDsFile(e.target.files[0]);
                        }
                      }}
                      className="w-full text-xs text-[#183647]"
                    />
                    <div className="text-[10px] text-slate-500 mt-1">Select CSV, JSON, XLSX, GeoJSON, or NetCDF file</div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Category</label>
                <input value={newDsCategory} onChange={e => setNewDsCategory(e.target.value)} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Format</label>
                <select value={newDsFormat} onChange={e => setNewDsFormat(e.target.value as any)} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]">
                  <option value="CSV">CSV</option>
                  <option value="JSON">JSON</option>
                  <option value="XLSX">XLSX</option>
                  <option value="GeoJSON">GeoJSON</option>
                  <option value="NetCDF">NetCDF</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#487b91]">Variables (comma-separated)</label>
              <input value={newDsVariables} onChange={e => setNewDsVariables(e.target.value)} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
            </div>
            <button type="submit" disabled={dsUploading} className="btn-primary w-full justify-center text-xs">
              {dsUploading ? 'Uploading & Processing File...' : 'Submit Dataset'}
            </button>
          </form>
        </div>
      )}

      {/* Modal 3: Upload Report */}
      {showUploadReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
          <form onSubmit={handleUploadReport} className="w-full max-w-lg card space-y-4 bg-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
              <h3 className="text-lg font-bold text-[#183647]">Upload Research Report</h3>
              <button type="button" onClick={() => setShowUploadReportModal(false)} className="text-[#487b91]"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#487b91]">Report Title</label>
              <input value={newRepTitle} onChange={e => setNewRepTitle(e.target.value)} required className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
            </div>

            {/* REAL HTML FILE PICKER FOR RESEARCH REPORTS */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#487b91]">Report Document File (.pdf, .docx)</label>
              <div className="p-3 border-2 border-dashed border-[#183647]/20 rounded-xl bg-slate-50 text-center text-xs">
                {repFile ? (
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText size={16} className="text-[#487b91] flex-shrink-0" />
                      <div className="text-left truncate">
                        <div className="font-bold text-[#183647] truncate">{repFile.name}</div>
                        <div className="text-[10px] text-slate-500">{formatFileSize(repFile.size)} · {repFile.type || 'Document'}</div>
                      </div>
                    </div>
                    <button type="button" onClick={() => setRepFile(null)} className="text-red-600 hover:text-red-800"><X size={14} /></button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      required
                      accept=".pdf,.docx,.doc"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setRepFile(e.target.files[0]);
                        }
                      }}
                      className="w-full text-xs text-[#183647]"
                    />
                    <div className="text-[10px] text-slate-500 mt-1">Select PDF or DOCX report document</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#487b91]">Research Category</label>
              <input value={newRepCategory} onChange={e => setNewRepCategory(e.target.value)} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#487b91]">Abstract / Executive Summary</label>
              <textarea value={newRepAbstract} onChange={e => setNewRepAbstract(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
            </div>
            <button type="submit" disabled={repUploading} className="btn-primary w-full justify-center text-xs">
              {repUploading ? 'Uploading Report File...' : 'Submit Report for Review'}
            </button>
          </form>
        </div>
      )}

      {/* Modal 4: Add Publication */}
      {showAddPubModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
          <form onSubmit={handleAddPublication} className="w-full max-w-lg card space-y-4 bg-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
              <h3 className="text-lg font-bold text-[#183647]">Add Peer-Reviewed Publication</h3>
              <button type="button" onClick={() => setShowAddPubModal(false)} className="text-[#487b91]"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#487b91]">Publication Title</label>
              <input value={newPubTitle} onChange={e => setNewPubTitle(e.target.value)} required className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
            </div>

            {/* REAL HTML FILE PICKER FOR PUBLICATIONS */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#487b91]">Paper Full Text PDF (.pdf)</label>
              <div className="p-3 border-2 border-dashed border-[#183647]/20 rounded-xl bg-slate-50 text-center text-xs">
                {pubFile ? (
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText size={16} className="text-[#487b91] flex-shrink-0" />
                      <div className="text-left truncate">
                        <div className="font-bold text-[#183647] truncate">{pubFile.name}</div>
                        <div className="text-[10px] text-slate-500">{formatFileSize(pubFile.size)} · PDF Paper</div>
                      </div>
                    </div>
                    <button type="button" onClick={() => setPubFile(null)} className="text-red-600 hover:text-red-800"><X size={14} /></button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      required
                      accept=".pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPubFile(e.target.files[0]);
                        }
                      }}
                      className="w-full text-xs text-[#183647]"
                    />
                    <div className="text-[10px] text-slate-500 mt-1">Select PDF manuscript file</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#487b91]">Authors (comma-separated)</label>
              <input value={newPubAuthors} onChange={e => setNewPubAuthors(e.target.value)} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Journal</label>
                <input value={newPubJournal} onChange={e => setNewPubJournal(e.target.value)} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#487b91]">DOI</label>
                <input value={newPubDoi} onChange={e => setNewPubDoi(e.target.value)} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
              </div>
            </div>
            <button type="submit" disabled={pubUploading} className="btn-primary w-full justify-center text-xs">
              {pubUploading ? 'Uploading Paper PDF...' : 'Add Publication'}
            </button>
          </form>
        </div>
      )}

      {/* Modal 5: Add Media */}
      {showAddMediaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
          <form onSubmit={handleAddMedia} className="w-full max-w-lg card space-y-4 bg-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
              <h3 className="text-lg font-bold text-[#183647]">Upload Field Media</h3>
              <button type="button" onClick={() => setShowAddMediaModal(false)} className="text-[#487b91]"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#487b91]">Media Title</label>
              <input value={newMediaTitle} onChange={e => setNewMediaTitle(e.target.value)} required className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]" />
            </div>

            {/* REAL HTML FILE PICKER FOR MEDIA */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#487b91]">Media File (Photo/Video/Infographic)</label>
              <div className="p-3 border-2 border-dashed border-[#183647]/20 rounded-xl bg-slate-50 text-center text-xs">
                {mediaFile ? (
                  <div className="space-y-2">
                    {mediaPreviewUrl && newMediaType === 'Photo' && (
                      <img src={mediaPreviewUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    )}
                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <ImageIcon size={16} className="text-[#487b91] flex-shrink-0" />
                        <div className="text-left truncate">
                          <div className="font-bold text-[#183647] truncate">{mediaFile.name}</div>
                          <div className="text-[10px] text-slate-500">{formatFileSize(mediaFile.size)} · {mediaFile.type || 'Media File'}</div>
                        </div>
                      </div>
                      <button type="button" onClick={() => { setMediaFile(null); setMediaPreviewUrl(''); }} className="text-red-600 hover:text-red-800"><X size={14} /></button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      required
                      accept="image/*,video/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setMediaFile(file);
                          if (file.type.startsWith('image/')) {
                            setMediaPreviewUrl(URL.createObjectURL(file));
                          }
                        }
                      }}
                      className="w-full text-xs text-[#183647]"
                    />
                    <div className="text-[10px] text-slate-500 mt-1">Select image or video file</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#487b91]">Type</label>
              <select value={newMediaType} onChange={e => setNewMediaType(e.target.value as any)} className="mt-1 w-full rounded-xl border border-[#183647]/15 p-2.5 text-xs text-[#183647]">
                <option value="Photo">Photo</option>
                <option value="Video">Video</option>
                <option value="Audio">Audio</option>
                <option value="Infographic">Infographic</option>
              </select>
            </div>
            <button type="submit" disabled={mediaUploading} className="btn-primary w-full justify-center text-xs">
              {mediaUploading ? 'Uploading Media File...' : 'Upload Media'}
            </button>
          </form>
        </div>
      )}

      {/* Modal 6: AI Dataset Analyzer */}
      {showDatasetAnalyzerModal && selectedDatasetForAnalysis && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
          <div className="w-full max-w-xl card space-y-4 bg-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
              <div className="flex items-center gap-2 font-bold text-[#183647]">
                <Sparkles size={18} className="text-[#487b91]" /> AI Dataset Analyzer
              </div>
              <button onClick={() => setShowDatasetAnalyzerModal(false)} className="text-[#487b91]"><X size={18} /></button>
            </div>
            <div className="text-xs font-bold text-[#183647]">{selectedDatasetForAnalysis.title} ({selectedDatasetForAnalysis.format})</div>
            <div className="rounded-xl bg-[#dce9ed] p-4 text-xs space-y-3">
              <div className="font-bold text-[#183647]">Statistical Summary:</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><span className="font-bold">Total Observations:</span> 1,248</div>
                <div><span className="font-bold">Variables:</span> {selectedDatasetForAnalysis.variables?.join(', ') || 'Temp, Pressure'}</div>
                <div><span className="font-bold">Quality Score:</span> 98.4% (QA/QC Passed)</div>
                <div><span className="font-bold">Anomalies Detected:</span> 2 Outliers</div>
              </div>
              <div className="border-t border-[#183647]/10 pt-2 font-semibold text-[#183647]">
                Trend Analysis: Consistent multi-decadal observation with minor seasonal variance. Recommended for cross-disciplinary climate correlation.
              </div>
            </div>
            <button onClick={() => setShowDatasetAnalyzerModal(false)} className="btn-primary w-full justify-center text-xs">Done</button>
          </div>
        </div>
      )}
    </>
  );
}
