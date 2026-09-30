import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { PageHero, Badge } from '../components/UI';
import { useAuth } from '../lib/auth';
import {
  getStoryForgeItems,
  saveStoryForgeItem,
  deleteStoryForgeItem,
  subscribeSignatureFeatures,
  StoryForgeItem,
} from '../lib/signatureFeatures';
import {
  reports,
  publications,
  datasets,
  expeditions,
  researchers,
} from '../data/demo';
import {
  initialMediaContentItems,
  initialMediaAssets,
  initialMediaCampaigns,
  initialCalendarEvents,
  initialMediaNotifications,
  MediaContentItem,
  MediaAssetRecord,
  MediaCampaign,
  CalendarEventItem,
  MediaNotification,
  ContentType,
  TargetAudience,
  Platform,
  ApprovalStage,
} from '../data/mediaData';
import {
  Newspaper,
  Video,
  Image as ImageIcon,
  CalendarDays,
  Megaphone,
  Sparkles,
  CheckCircle2,
  Plus,
  X,
  Copy,
  BarChart2,
  Globe2,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Clock,
  Edit3,
  Target,
  Bell,
  Users,
  TrendingUp,
  FileText,
  Eye,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Layers,
  Send,
  Upload,
  Tag,
  Share2,
  Check,
  Languages,
  BookOpen,
  HelpCircle,
  Film,
  Download,
  ThumbsUp,
  MessageSquare,
  Lock,
  ChevronRight,
  Play,
  RotateCcw,
  RefreshCw,
  Wand2,
} from 'lucide-react';

const CHANNELS: Platform[] = [
  'Yuki Website',
  'Instagram',
  'LinkedIn',
  'X',
  'Facebook',
  'YouTube',
  'Newsletter',
];

const CONTENT_TYPES: ContentType[] = [
  'Website Article',
  'News',
  'Press Release',
  'Social Media Post',
  'Video Script',
  'Infographic',
  'Data Story',
  'Educational Content',
  'Scientific Explainer',
  'Quiz',
  'Newsletter',
];

const AUDIENCES: TargetAudience[] = [
  'General Public',
  'Students',
  'Researchers',
  'Media',
  'Government',
  'International Audience',
];

const platformIcons: Record<Platform, any> = {
  'Yuki Website': Globe2,
  Instagram: Instagram,
  LinkedIn: Users,
  X: Twitter,
  Facebook: Facebook,
  YouTube: Youtube,
  Newsletter: Bell,
};

const statusColors: Record<ApprovalStage, string> = {
  Published: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Scheduled: 'bg-blue-100 text-blue-800 border-blue-300',
  'Official Approval': 'bg-purple-100 text-purple-800 border-purple-300',
  'Scientific Review': 'bg-amber-100 text-amber-800 border-amber-300',
  'In Review': 'bg-sky-100 text-sky-800 border-sky-300',
  Draft: 'bg-slate-100 text-slate-700 border-slate-300',
  Rejected: 'bg-red-100 text-red-800 border-red-300',
  'Needs Changes': 'bg-orange-100 text-orange-800 border-orange-300',
};

function StoryForgeStudio({ profile }: { profile: any }) {
  const [searchParams] = useSearchParams();
  const initialSourceId = searchParams.get('sourceId') || 'pub-ice';
  const initialSourceTitle = searchParams.get('sourceTitle') || 'Decadal Glaciological Mass Balance of Coastal East Antarctica';
  const initialSourceType = (searchParams.get('sourceType') as any) || 'publication';

  const [sourceId, setSourceId] = useState(initialSourceId);
  const [sourceTitle, setSourceTitle] = useState(initialSourceTitle);
  const [sourceType, setSourceType] = useState<'publication' | 'dataset' | 'report' | 'expedition'>(initialSourceType);

  const [selectedFormat, setSelectedFormat] = useState<'article' | 'instagram' | 'linkedin' | 'videoscript' | 'infographic' | 'student' | 'press' | 'quiz'>('article');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [stories, setStories] = useState(() => getStoryForgeItems(profile?.uid));

  useEffect(() => {
    const unsub = subscribeSignatureFeatures(() => {
      setStories(getStoryForgeItems(profile?.uid));
    });
    return unsub;
  }, [profile?.uid]);

  useEffect(() => {
    if (searchParams.get('sourceId')) {
      setSourceId(searchParams.get('sourceId')!);
      setSourceTitle(searchParams.get('sourceTitle') || 'Verified Research Source');
      if (searchParams.get('sourceType')) {
        setSourceType(searchParams.get('sourceType') as any);
      }
    }
  }, [searchParams]);

  const verifiedSources = [
    { id: 'pub-ice', type: 'publication', title: 'Decadal Glaciological Mass Balance of Coastal East Antarctica', doi: '10.1029/2024GL012345', author: 'Dr. Kavya Rao et al.' },
    { id: 'ds-temp', type: 'dataset', title: 'East Antarctic Surface Temperature Series v2.1', doi: 'NCPOR Met Telemetry', author: 'Maitri & Bharati AWS' },
    { id: 'rep-44', type: 'report', title: '44th Indian Scientific Expedition Field Science Report', doi: 'NCPOR Expedition Monograph', author: 'Expedition Science Team' },
    { id: 'iae44', type: 'expedition', title: '44th Indian Scientific Expedition to Antarctica', doi: 'NCPOR/MoES Mission', author: 'Dr. Expedition Leader' },
  ];

  const handleSelectSource = (s: typeof verifiedSources[0]) => {
    setSourceId(s.id);
    setSourceTitle(s.title);
    setSourceType(s.type as any);
  };

  const handleGenerateStory = (fmt?: typeof selectedFormat) => {
    const formatToUse = fmt || selectedFormat;
    setSelectedFormat(formatToUse);
    setIsGenerating(true);

    setTimeout(() => {
      let t = '';
      let c = '';

      switch (formatToUse) {
        case 'article':
          t = `Deciphering Polar History: What ${sourceTitle} Reveals`;
          c = `NEW DELHI / NCPOR GOA — Groundbreaking findings from "${sourceTitle}" reveal critical insights into Earth's climate system.\n\n` +
              `Indian polar scientists observing at Maitri and Bharati stations documented detailed environmental signals over multiple seasons.\n\n` +
              `Scientific Takeaway: Trapped atmospheric indicators provide unprecedented high-resolution records for ocean-atmosphere climate modeling.`;
          break;
        case 'instagram':
          t = `❄️ POLAR DISCOVERY: ${sourceTitle.slice(0, 45)}...`;
          c = `Did you know? Indian scientists at Bharati Station extracted ice cores preserving climate data from thousands of years ago!\n\n` +
              `🔬 Source: ${sourceTitle}\n` +
              `📍 Location: East Antarctica\n\n` +
              `Swipe to see raw field photos! Link in bio for verified NCPOR data. #PolarScience #NCPOR #Antarctica #ScienceFacts`;
          break;
        case 'linkedin':
          t = `Yuki Research Insights: ${sourceTitle}`;
          c = `Translating complex polar observation into policy & scientific action.\n\n` +
              `Key findings from the recent study "${sourceTitle}":\n` +
              `1. High-precision telemetry tracking atmospheric and glaciological parameters.\n` +
              `2. Direct teleconnections with Indian summer monsoon pressure gradients.\n\n` +
              `Full verified dataset indexed on Yuki repository.`;
          break;
        case 'videoscript':
          t = `Video Script (60s): Understanding ${sourceTitle}`;
          c = `[SCENE 1 - VISUAL: Aerial footage of Bharati Station]\n` +
              `NARRATOR: High above the icy slopes of Antarctica, Indian scientists are reading Earth's climate clock.\n\n` +
              `[SCENE 2 - VISUAL: Close-up of ice core sample in lab]\n` +
              `NARRATOR: Based on "${sourceTitle}", ancient air bubbles preserved in ice tell a story thousands of years in the making.\n\n` +
              `[SCENE 3 - VISUAL: Yuki logo & web link]\n` +
              `NARRATOR: Explore the verified science on Yuki today!`;
          break;
        case 'infographic':
          t = `Infographic Concept: ${sourceTitle}`;
          c = `VISUAL LAYOUT & DATA CARDS:\n` +
              `• Header: Key Metrics from "${sourceTitle}"\n` +
              `• Section 1 (Map): Maitri & Bharati Station location markers\n` +
              `• Section 2 (Chart): Decadal temperature trend curve (-40°C to -10°C)\n` +
              `• Section 3 (Callout): 70% of global freshwater stored in polar ice sheets\n` +
              `• Footer: Verified by NCPOR / Ministry of Earth Sciences`;
          break;
        case 'student':
          t = `Student Explainer: ${sourceTitle}`;
          c = `Hey young polar explorers! Have you ever wondered how scientists know what the weather was like thousands of years ago?\n\n` +
              `In "${sourceTitle}", scientists at India's Antarctic station used special tools to look deep into glaciers.\n\n` +
              `Fun Fact: Ice acts like a natural time capsule!`;
          break;
        case 'press':
          t = `PRESS RELEASE: Ministry of Earth Sciences Highlights Findings from ${sourceTitle}`;
          c = `FOR IMMEDIATE RELEASE\n\n` +
              `GOA, INDIA — The National Centre for Polar and Ocean Research (NCPOR) has published verified scientific observations titled "${sourceTitle}".\n\n` +
              `The research highlights critical ice-ocean-atmosphere interactions supporting India's commitment to climate observation under the Antarctic Treaty System.`;
          break;
        case 'quiz':
          t = `Interactive Quiz: Test Your Knowledge on ${sourceTitle}`;
          c = `Q1: Where were the primary field observations in "${sourceTitle}" conducted?\n` +
              `A) Bharati & Maitri Stations (Antarctica) [CORRECT]\n` +
              `B) Tropical Indian Ocean\n` +
              `C) Bay of Bengal\n\n` +
              `Q2: What key parameter was monitored in this study?\n` +
              `A) Cryosphere temperature & mass balance [CORRECT]\n` +
              `B) Desert sand movement`;
          break;
      }

      setStoryTitle(t);
      setStoryContent(c);
      setIsGenerating(false);
    }, 800);
  };

  const handleSaveStory = () => {
    if (!storyTitle || !storyContent) return;
    saveStoryForgeItem(profile?.uid, {
      sourceId,
      sourceType,
      sourceTitle,
      sourceAuthorOrDoi: 'Verified NCPOR Research',
      format: selectedFormat,
      title: storyTitle,
      content: storyContent,
      status: 'DRAFT',
    });
    alert('Story Forge draft created and linked to original research source for traceability!');
  };

  return (
    <div className="space-y-8 mt-8">
      {/* Studio Header */}
      <div className="card space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#183647]/10 pb-4">
          <div>
            <h3 className="text-xl font-bold text-[#183647] flex items-center gap-2">
              <Sparkles className="text-purple-600" size={22} /> Story Forge (Multi-Format Remix Studio)
            </h3>
            <p className="text-xs text-[#487b91]">Transform verified research publications, datasets, and reports into 8 multi-channel media formats with guaranteed scientific traceability.</p>
          </div>
          <Badge>SCIENTIFIC TRACEABILITY ENGINE ACTIVE</Badge>
        </div>

        {/* Source Research Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#183647] uppercase">1. Select Verified Scientific Research Source:</label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {verifiedSources.map((s) => (
              <div
                key={s.id}
                onClick={() => handleSelectSource(s)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition text-xs space-y-1.5 ${
                  sourceId === s.id
                    ? 'bg-purple-50 border-purple-500 shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold uppercase px-2 py-0.5 rounded bg-white text-purple-700 border border-purple-200">{s.type}</span>
                  <span className="font-mono text-emerald-700">VERIFIED</span>
                </div>
                <h5 className="font-bold text-[#183647] line-clamp-2">{s.title}</h5>
                <div className="text-[10px] text-[#487b91] truncate">{s.author} · {s.doi}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Source Traceability Card */}
        <div className="rounded-2xl p-4 bg-purple-50/70 border border-purple-200 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={16} /> Selected Scientific Source for Traceability:
            </span>
            <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-purple-200 text-purple-800">
              Source ID: {sourceId}
            </span>
          </div>
          <div className="font-bold text-[#183647] text-sm">{sourceTitle}</div>
          <div className="text-[11px] text-purple-800">
            Every story format generated below will embed an explicit citation link to this verified research document.
          </div>
        </div>

        {/* Format Selector (8 Formats) */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-[#183647] uppercase">2. Choose Story Format (8 Multi-Channel Formats):</label>
          <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-8 text-xs font-bold">
            {[
              ['article', '🌐 Website Article'],
              ['instagram', '📸 Instagram Post'],
              ['linkedin', '💼 LinkedIn Post'],
              ['videoscript', '🎬 Video Script'],
              ['infographic', '📊 Infographic'],
              ['student', '🎓 Student Explainer'],
              ['press', '📰 Press Release'],
              ['quiz', '🧩 Interactive Quiz'],
            ].map(([fmt, label]: any) => (
              <button
                key={fmt}
                onClick={() => handleGenerateStory(fmt)}
                className={`p-2.5 rounded-xl border transition text-center text-[11px] ${
                  selectedFormat === fmt
                    ? 'bg-[#183647] text-white shadow-md border-[#183647]'
                    : 'bg-white text-[#487b91] hover:bg-slate-100 border-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor & Output Box */}
      <div className="card space-y-4">
        <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
          <h4 className="font-bold text-[#183647] text-base flex items-center gap-2">
            <Sparkles size={18} className="text-purple-600" /> Remixed Story Output ({selectedFormat.toUpperCase()})
          </h4>

          <div className="flex gap-2">
            <button
              onClick={() => handleGenerateStory()}
              disabled={isGenerating}
              className="btn-secondary text-xs flex items-center gap-1"
            >
              <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} /> {isGenerating ? 'Remixing...' : 'Regenerate Draft'}
            </button>
            <button
              onClick={handleSaveStory}
              disabled={!storyTitle || !storyContent}
              className="btn-primary text-xs flex items-center gap-1"
            >
              <Check size={14} /> Save to Story Forge Library
            </button>
          </div>
        </div>

        {storyTitle ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#487b91]">Headline / Title</label>
              <input
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#183647]/20 p-3 text-sm font-bold text-[#183647]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#487b91]">Story Body Content</label>
              <textarea
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                rows={8}
                className="mt-1 w-full rounded-xl border border-[#183647]/20 p-3 text-xs font-mono text-[#183647] leading-relaxed"
              />
            </div>

            {/* Traceability Footer */}
            <div className="rounded-xl p-3 bg-slate-100 border border-slate-200 text-xs flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#487b91]">
                <ShieldCheck size={16} className="text-emerald-700" />
                <span>Source Traceability: Linked to verified research <strong>"{sourceTitle}"</strong> ({sourceId})</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${storyTitle}\n\n${storyContent}\n\n[Source Citation: ${sourceTitle} - ${sourceId}]`);
                  alert('Remixed story & traceability citation copied to clipboard!');
                }}
                className="btn-secondary text-[11px] py-1 px-3"
              >
                Copy Story + Citation
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-[#487b91]">
            Click any of the 8 format buttons above to instantly generate a story remixed from the selected research source!
          </div>
        )}
      </div>

      {/* Saved Stories Gallery */}
      <div className="card space-y-4 bg-white border border-[#183647]/15">
        <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
          <h4 className="font-bold text-[#183647] text-base">Story Forge Library ({stories.length}):</h4>
          <span className="text-xs text-[#487b91]">All remixed content linked back to original scientific papers/datasets</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {stories.map((st) => (
            <div key={st.id} className="rounded-2xl p-4 bg-[#edf2f4]/60 border border-[#183647]/15 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">{st.format}</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{st.status}</span>
                </div>
                <h5 className="font-bold text-[#183647] text-sm leading-snug">{st.title}</h5>
                <p className="text-xs text-slate-700 line-clamp-3 whitespace-pre-line">{st.content}</p>
              </div>

              <div className="pt-3 border-t border-[#183647]/10 flex flex-wrap justify-between items-center text-xs gap-2">
                <div className="text-[10px] text-[#487b91] truncate max-w-[200px]">
                  Traceability: {st.sourceTitle}
                </div>
                <button
                  onClick={() => deleteStoryForgeItem(profile?.uid, st.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-[11px]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MediaManagerDashboard() {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const nav = useNavigate();

  // Tab State
  const tabParam = searchParams.get('tab') as
    | 'dashboard'
    | 'storyforge'
    | 'content'
    | 'library'
    | 'aistudio'
    | 'campaigns'
    | 'analytics'
    | null;
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'storyforge' | 'content' | 'library' | 'aistudio' | 'campaigns' | 'analytics'
  >(tabParam || 'dashboard');

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const changeTab = (
    tab: 'dashboard' | 'storyforge' | 'content' | 'library' | 'aistudio' | 'campaigns' | 'analytics'
  ) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Master State Records
  const [contentItems, setContentItems] = useState<MediaContentItem[]>(initialMediaContentItems);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetRecord[]>(initialMediaAssets);
  const [campaigns, setCampaigns] = useState<MediaCampaign[]>(initialMediaCampaigns);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>(initialCalendarEvents);
  const [notifications, setNotifications] = useState<MediaNotification[]>(initialMediaNotifications);

  // Content Workspace Filters & Search
  const [contentSearch, setContentSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPlatform, setFilterPlatform] = useState<string>('ALL');

  // Modals & Active Selections
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeEditorItem, setActiveEditorItem] = useState<MediaContentItem | null>(null);
  const [showAccuracyCheck, setShowAccuracyCheck] = useState<MediaContentItem | null>(null);
  const [showMediaDetail, setShowMediaDetail] = useState<MediaAssetRecord | null>(null);
  const [showUploadTagModal, setShowUploadTagModal] = useState(false);
  const [showTurnIntoStoryModal, setShowTurnIntoStoryModal] = useState<any | null>(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);

  // Multi-Language Translation State for Editor
  const [editorLanguage, setEditorLanguage] = useState<'English' | 'Hindi' | 'Bengali' | 'Telugu' | 'Tamil'>('English');
  const [copiedNotice, setCopiedNotice] = useState('');

  // AI Studio State
  const [selectedSourceId, setSelectedSourceId] = useState<string>(reports[0].id);
  const [checkedFormats, setCheckedFormats] = useState<ContentType[]>([
    'Website Article',
    'Social Media Post',
    'Video Script',
    'Infographic',
    'Press Release',
  ]);
  const [studioAudience, setStudioAudience] = useState<TargetAudience>('General Public');
  const [studioLanguage, setStudioLanguage] = useState<'English' | 'Hindi' | 'Bengali' | 'Telugu' | 'Tamil'>('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStudioOutputs, setGeneratedStudioOutputs] = useState<Record<string, string> | null>(null);

  // Smart Media Search State
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // New Content Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ContentType>('Website Article');
  const [newSourceId, setNewSourceId] = useState(reports[0].id);
  const [newAudience, setNewAudience] = useState<TargetAudience>('General Public');
  const [newPlatform, setNewPlatform] = useState<Platform>('Yuki Website');
  const [newLanguage, setNewLanguage] = useState<'English' | 'Hindi' | 'Bengali' | 'Telugu' | 'Tamil'>('English');

  // New Campaign Form State
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [newCampaignObj, setNewCampaignObj] = useState('');
  const [newCampaignAudience, setNewCampaignAudience] = useState<TargetAudience>('General Public');

  // AI Media Tagging Form State
  const [uploadTitle, setUploadTitle] = useState('Antarctic Field Observation Photo');
  const [uploadCategory, setUploadCategory] = useState<MediaAssetRecord['category']>('Photographs');
  const [uploadPhotographer, setUploadPhotographer] = useState(profile?.name || 'Media Team');
  const [uploadExpedition, setUploadExpedition] = useState('46th Indian Antarctic Expedition (IAE-46)');
  const [uploadTags, setUploadTags] = useState<string[]>(['Antarctica', 'Field Work', 'Ice Sheet', 'NCPOR']);
  const [aiTaggingActive, setAiTaggingActive] = useState(false);

  // Helper copy function
  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(label);
    setTimeout(() => setCopiedNotice(''), 2500);
  };

  // Filtered Content Items
  const filteredContent = useMemo(() => {
    return contentItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(contentSearch.toLowerCase()) ||
        item.summary.toLowerCase().includes(contentSearch.toLowerCase()) ||
        item.author.toLowerCase().includes(contentSearch.toLowerCase());

      const matchesType = filterType === 'ALL' || item.contentType === filterType;
      const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
      const matchesPlatform = filterPlatform === 'ALL' || item.platform === filterPlatform;

      return matchesSearch && matchesType && matchesStatus && matchesPlatform;
    });
  }, [contentItems, contentSearch, filterType, filterStatus, filterPlatform]);

  // Filtered Media Assets
  const filteredAssets = useMemo(() => {
    return mediaAssets.filter((asset) => {
      const matchesSearch =
        asset.title.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
        asset.tags.some((t) => t.toLowerCase().includes(mediaSearchQuery.toLowerCase())) ||
        asset.photographer.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
        asset.location.toLowerCase().includes(mediaSearchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'ALL' || asset.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [mediaAssets, mediaSearchQuery, selectedCategory]);

  // Handle Creating Content
  const handleCreateContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceReport = reports.find((r) => r.id === newSourceId) || reports[0];
    const newItem: MediaContentItem = {
      id: `cnt-${Date.now()}`,
      title: newTitle || 'Untitled Scientific Outreach Story',
      contentType: newType,
      sourceResearchId: sourceReport.id,
      sourceResearchTitle: sourceReport.title,
      sourceType: 'Research Report',
      author: profile?.name || 'Media Team Member',
      targetAudience: newAudience,
      platform: newPlatform,
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      language: newLanguage,
      contentBody: `Draft story based on ${sourceReport.title}.\n\nExecutive Summary: ${sourceReport.executiveSummary}\n\nKey Findings:\n${sourceReport.findings.map((f) => `• ${f}`).join('\n')}`,
      summary: sourceReport.executiveSummary.slice(0, 150) + '...',
      tags: [newType, sourceReport.region, 'Polar Outreach'],
      accuracyVerified: false,
      accuracyScore: 85,
      verificationNotes: ['Auto-generated draft. Awaiting scientific review.'],
      expeditionId: sourceReport.expeditionId,
      expeditionName: sourceReport.expeditionId === 'iae46' ? '46th Indian Antarctic Expedition' : 'Indian Polar Campaign',
      views: 0,
      shares: 0,
      likes: 0,
    };

    setContentItems((prev) => [newItem, ...prev]);
    setShowCreateModal(false);
    setActiveEditorItem(newItem);
  };

  // Handle AI Studio Multi-Format Generation
  const handleGenerateStudioAll = () => {
    setIsGenerating(true);
    const sourceReport = reports.find((r) => r.id === selectedSourceId) || reports[0];

    setTimeout(() => {
      const outputs: Record<string, string> = {};

      if (checkedFormats.includes('Website Article')) {
        outputs['Website Article'] = `### ${sourceReport.title}\n\nScientists from India's polar program have conducted extensive observation across ${sourceReport.region}.\n\n**Executive Summary:**\n${sourceReport.executiveSummary}\n\n**Key Findings:**\n${sourceReport.findings.map((f) => `• ${f}`).join('\n')}\n\n**Scientific Impact:**\n${sourceReport.results}`;
      }
      if (checkedFormats.includes('Social Media Post')) {
        outputs['Social Media Post'] = `🧊 NEW POLAR SCIENCE BREAKTHROUGH!\n\n${sourceReport.title}\n\nKey takeaway:\n${sourceReport.findings[0] || 'Unprecedented climate data recorded by NCPOR researchers.'}\n\nExplore interactive datasets on Yuki! 📊 #PolarScience #NCPOR #ClimateResearch #${sourceReport.region.replace(/\s+/g, '')}`;
      }
      if (checkedFormats.includes('Video Script')) {
        outputs['Video Script'] = `HOOK (0-5s): "What is happening to the ice in ${sourceReport.region}?"\n\nSCENE 1 (5-20s): Drone aerial view of research station → Voiceover: "${sourceReport.executiveSummary.slice(0, 100)}..."\n\nSCENE 2 (20-45s): Researcher deploying instruments → Voiceover: "Key finding: ${sourceReport.findings[0]}"\n\nCTA (45-60s): "View full verified datasets on Yuki."`;
      }
      if (checkedFormats.includes('Infographic')) {
        outputs['Infographic'] = `INFOGRAPHIC TITLE: ${sourceReport.title}\n\nKEY STAT 1: 120m Ice Core Depth\nKEY STAT 2: +0.31°C Surface Warming\nKEY STAT 3: 342 Samples Collected\n\nLOCATION: ${sourceReport.region}\nCITATION: NCPOR Open Data Repository`;
      }
      if (checkedFormats.includes('Press Release')) {
        outputs['Press Release'] = `FOR IMMEDIATE RELEASE\n\nNCPOR ANNOUNCES MAJOR FINDINGS IN ${sourceReport.region.toUpperCase()}\n\nLead Scientists: ${sourceReport.authors.join(', ')}\n\n${sourceReport.executiveSummary}`;
      }
      if (checkedFormats.includes('Educational Content')) {
        outputs['Educational Content'] = `STUDENT GUIDE: Understanding ${sourceReport.researchArea}\n\nDid you know? Scientists at Bharati Base measure trapped air bubbles inside deep ice cores to read ancient atmosphere layers!\n\nQuestion for Students: Why do ice cores act as time capsules?`;
      }

      setGeneratedStudioOutputs(outputs);
      setIsGenerating(false);
    }, 1000);
  };

  // Translations Map
  const translateText = (text: string, lang: string): string => {
    if (lang === 'Hindi') {
      return `[हिंदी अनुवाद] ${text}\n\nनोट: वैज्ञानिक शब्दावली (NCPOR, Bharati Station, Glaciology) मूल रूप में संरक्षित है।`;
    }
    if (lang === 'Bengali') {
      return `[বাংলা অনুবাদ] ${text}\n\nনোট: বৈজ্ঞানিক परिभाषा (NCPOR, Maitri Station) অপরিবর্তিত রাখা হয়েছে।`;
    }
    if (lang === 'Telugu') {
      return `[తెలుగు అనువాదం] ${text}\n\nగమనిక: శాస్త్రీయ పదజాలం (NCPOR, Ice Core) మార్చబడలేదు.`;
    }
    if (lang === 'Tamil') {
      return `[தமிழ் மொழிபெயர்ப்பு] ${text}\n\nகுறிப்பு: அறிவியல் கலைச்சொற்கள் (NCPOR, Glaciology) மாற்றப்படவில்லை.`;
    }
    return text;
  };

  return (
    <>
      <PageHero
        kicker="Yuki Media & Public Outreach Secretariat"
        title={`Good morning, ${profile?.name && profile.name.length > 3 && profile.name !== 'med' ? profile.name : 'Content Team'}.`}
        body="Turn India's polar research into stories that everyone can understand. Transforming verified scientific datasets, publications, and expeditions into engaging public narratives."
      >
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>ROLE: MEDIA & CONTENT TEAM</Badge>
            <Badge>AI STUDIO READY</Badge>
            <Badge>ACCURACY ENGINE ACTIVE</Badge>
            <Badge>{contentItems.filter((c) => c.status === 'Published').length} PUBLISHED STORIES</Badge>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus size={15} /> Create Content
          </button>
        </div>
      </PageHero>

      <section className="section pb-24">
        {/* Module Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#183647]/15 pb-4 mb-8">
          {[
            ['dashboard', 'Media Dashboard', FileText],
            ['storyforge', 'Story Forge Studio (8 Formats)', Sparkles],
            ['content', 'Content Items Workspace', Edit3],
            ['library', 'Media Asset Library', ImageIcon],
            ['aistudio', 'AI Generator Studio', Wand2],
            ['campaigns', 'Campaign Manager', CalendarDays],
            ['analytics', 'Media Analytics', BarChart2],
          ].map(([id, label, Icon]: any) => (
            <button
              key={id}
              onClick={() => changeTab(id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === id ? 'bg-[#183647] text-white shadow-md' : 'bg-white/60 text-[#487b91] hover:bg-white hover:text-[#183647]'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* ==================================================
            STORY FORGE STUDIO VIEW
            ================================================== */}
        {activeTab === 'storyforge' && (
          <StoryForgeStudio profile={profile} />
        )}

        {/* ==================================================
            1. MEDIA DASHBOARD VIEW
            ================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Populated Rich Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {[
                ['Draft Content', contentItems.filter((c) => c.status === 'Draft').length, FileText, 'text-slate-700 bg-slate-100'],
                ['Pending Approval', contentItems.filter((c) => c.status === 'Official Approval' || c.status === 'Scientific Review').length, Clock, 'text-amber-800 bg-amber-100'],
                ['Published', contentItems.filter((c) => c.status === 'Published').length, CheckCircle2, 'text-emerald-800 bg-emerald-100'],
                ['Media Assets', mediaAssets.length, ImageIcon, 'text-sky-800 bg-sky-100'],
                ['AI Generated', contentItems.length + 18, Sparkles, 'text-purple-800 bg-purple-100'],
                ['Scheduled Posts', contentItems.filter((c) => c.status === 'Scheduled').length, CalendarDays, 'text-blue-800 bg-blue-100'],
              ].map(([label, val, Icon, colors]: any) => (
                <div key={label} className="card p-4 text-center space-y-2">
                  <div className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center ${colors}`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-2xl font-black text-[#183647]">{val}</div>
                  <div className="text-[11px] font-bold text-[#487b91] uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>

            {/* VISUAL CONTENT PIPELINE DIAGRAM */}
            <div className="card space-y-4">
              <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#183647]">Yuki Institutional Content Pipeline</h3>
                  <p className="text-xs text-[#487b91]">End-to-end editorial verification workflow for public polar communication</p>
                </div>
                <Badge>STRICT SCIENTIFIC GOVERNANCE</Badge>
              </div>

              <div className="overflow-x-auto pb-2">
                <div className="flex items-center justify-between min-w-[900px] gap-2 text-center text-xs">
                  {[
                    ['Scientific Research', '12 Sources Available', BookOpen, 'bg-slate-100 border-slate-300 text-slate-800'],
                    ['AI Content Generation', 'Multi-Format Engine', Sparkles, 'bg-purple-50 border-purple-300 text-purple-800'],
                    ['Human Review', 'Content Team Edit', Edit3, 'bg-sky-50 border-sky-300 text-sky-800'],
                    ['Scientific Verification', 'Scientist Check', ShieldCheck, 'bg-amber-50 border-amber-300 text-amber-800'],
                    ['Official Approval', 'NCPOR / MoES Sign-off', CheckCircle2, 'bg-purple-50 border-purple-300 text-purple-800'],
                    ['Scheduled', 'Calendar Queue', CalendarDays, 'bg-blue-50 border-blue-300 text-blue-800'],
                    ['Published', 'Public Platform', Globe2, 'bg-emerald-50 border-emerald-300 text-emerald-800'],
                  ].map(([stage, desc, Icon, classes]: any, idx, arr) => (
                    <div key={stage} className="flex items-center gap-2 flex-1">
                      <div className={`flex-1 rounded-2xl p-3 border ${classes} space-y-1 shadow-sm`}>
                        <Icon size={18} className="mx-auto" />
                        <div className="font-bold text-xs">{stage}</div>
                        <div className="text-[10px] opacity-80">{desc}</div>
                      </div>
                      {idx < arr.length - 1 && <ChevronRight size={16} className="text-[#487b91] flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DASHBOARD WIDGETS GRID */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Widget 1: Recent Content */}
              <div className="card space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[#183647] text-base">Recent Content Items</h4>
                  <button onClick={() => changeTab('content')} className="text-xs font-bold text-[#487b91] hover:underline flex items-center gap-1">
                    View All <ArrowRight size={12} />
                  </button>
                </div>
                <div className="space-y-3">
                  {contentItems.slice(0, 4).map((item) => (
                    <div key={item.id} className="rounded-xl bg-white p-3.5 border border-[#183647]/10 flex items-center justify-between gap-3 text-xs">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[item.status]}`}>{item.status}</span>
                          <span className="text-[10px] font-semibold text-[#487b91] bg-slate-100 px-2 py-0.5 rounded-full">{item.contentType}</span>
                        </div>
                        <h5 className="font-bold text-[#183647]">{item.title}</h5>
                        <div className="text-[11px] text-[#487b91]">
                          Source: <span className="font-semibold text-[#183647]">{item.sourceResearchTitle}</span>
                        </div>
                      </div>
                      <button onClick={() => setActiveEditorItem(item)} className="btn-secondary text-[11px] py-1.5 px-3">
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 2: Yuki Recommends Research for Outreach */}
              <div className="card space-y-4 border-purple-200 bg-gradient-to-br from-purple-50/50 to-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-purple-600" size={18} />
                    <h4 className="font-bold text-[#183647] text-base">Yuki AI Outreach Recommendations</h4>
                  </div>
                  <Badge>NEW VERIFIED RESEARCH</Badge>
                </div>

                <div className="space-y-3 text-xs">
                  {reports.slice(0, 2).map((rep) => (
                    <div key={rep.id} className="rounded-xl bg-white p-4 border border-purple-200 space-y-3">
                      <div>
                        <div className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">NCPOR VERIFIED REPORT #{rep.id}</div>
                        <h5 className="font-bold text-[#183647] text-sm mt-0.5">{rep.title}</h5>
                        <p className="text-slate-600 text-[11px] mt-1">{rep.executiveSummary.slice(0, 120)}...</p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                        <span className="text-[10px] font-semibold text-[#487b91]">Recommended Formats:</span>
                        <button
                          onClick={() => {
                            setSelectedSourceId(rep.id);
                            changeTab('aistudio');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 text-[10px] font-bold transition flex items-center gap-1"
                        >
                          <Sparkles size={11} /> Generate Multi-Channel Package
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 3: Upcoming Scheduled Content */}
              <div className="card space-y-4">
                <h4 className="font-bold text-[#183647] text-base">Upcoming Scheduled Outreach</h4>
                <div className="space-y-3 text-xs">
                  {calendarEvents.slice(0, 3).map((cal) => (
                    <div key={cal.id} className="rounded-xl bg-white p-3 border border-[#183647]/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-center bg-[#dce9ed] px-3 py-1.5 rounded-lg">
                          <div className="font-bold text-[#183647]">{cal.date.split('-')[2]}</div>
                          <div className="text-[9px] font-bold text-[#487b91] uppercase">SEP/OCT</div>
                        </div>
                        <div>
                          <div className="font-bold text-[#183647]">{cal.title}</div>
                          <div className="text-[11px] text-[#487b91]">
                            {cal.platform} · {cal.time}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${statusColors[cal.status]}`}>{cal.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 4: Media Assets Needing Metadata */}
              <div className="card space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[#183647] text-base">Media Needing Metadata</h4>
                  <button onClick={() => setShowUploadTagModal(true)} className="text-xs text-[#487b91] font-bold hover:underline">
                    + Upload Asset
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {mediaAssets.filter((a) => !a.hasMetadata || a.approvalStatus === 'Pending Review').map((asset) => (
                    <div key={asset.id} className="rounded-xl bg-amber-50 p-3 border border-amber-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={asset.url} alt={asset.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-[#183647]">{asset.title}</div>
                          <div className="text-[11px] text-amber-800">Missing photographer / copyright metadata</div>
                        </div>
                      </div>
                      <button onClick={() => setShowMediaDetail(asset)} className="btn-secondary text-[11px] py-1 px-2.5">
                        Add Metadata
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            2. CONTENT WORKSPACE VIEW
            ================================================== */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#183647]">Polar Communication Content Workspace</h3>
                <p className="text-xs text-[#487b91]">Manage website articles, news releases, social posts, scripts, infographics, and data stories.</p>
              </div>

              <button onClick={() => setShowCreateModal(true)} className="btn-primary text-xs flex items-center gap-1.5">
                <Plus size={16} /> Create Content
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="card space-y-4 bg-white/80 p-4 border border-[#183647]/15">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-3 text-[#487b91]" />
                  <input
                    type="text"
                    placeholder="Search by title, summary, author..."
                    value={contentSearch}
                    onChange={(e) => setContentSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#183647]/15 outline-none bg-white"
                  />
                </div>

                <div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-[#183647]/15 outline-none bg-white font-semibold text-[#183647]"
                  >
                    <option value="ALL">All Content Types</option>
                    {CONTENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-[#183647]/15 outline-none bg-white font-semibold text-[#183647]"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="In Review">In Review</option>
                    <option value="Scientific Review">Scientific Review</option>
                    <option value="Official Approval">Official Approval</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filterPlatform}
                    onChange={(e) => setFilterPlatform(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-[#183647]/15 outline-none bg-white font-semibold text-[#183647]"
                  >
                    <option value="ALL">All Platforms</option>
                    {CHANNELS.map((ch) => (
                      <option key={ch} value={ch}>{ch}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Content List Table */}
            <div className="space-y-3">
              {filteredContent.map((item) => {
                const PlatformIcon = platformIcons[item.platform] || Globe2;
                return (
                  <div key={item.id} className="card p-4 space-y-3 bg-white hover:border-[#487b91] transition shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-[300px]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[item.status]}`}>
                            {item.status}
                          </span>
                          <span className="text-xs font-bold text-[#487b91] bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <PlatformIcon size={12} /> {item.platform}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            {item.contentType}
                          </span>
                          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                            Audience: {item.targetAudience}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-[#183647]">{item.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{item.summary}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right text-[11px] text-[#487b91]">
                          <div>Updated: <span className="font-semibold text-[#183647]">{item.updatedAt}</span></div>
                          <div>By: <span className="font-semibold text-[#183647]">{item.author}</span></div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => setActiveEditorItem(item)}
                            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                          >
                            <Edit3 size={13} /> Edit in Studio
                          </button>
                          <button
                            onClick={() => setShowAccuracyCheck(item)}
                            className="btn-secondary text-xs py-1.5 px-3 text-emerald-700 flex items-center gap-1"
                          >
                            <ShieldCheck size={13} /> Check Accuracy
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Traceability Footer */}
                    <div className="border-t border-slate-100 pt-2.5 flex flex-wrap items-center justify-between text-[11px] text-[#487b91]">
                      <div className="flex items-center gap-1">
                        <BookOpen size={12} className="text-[#487b91]" />
                        <span>Source:</span>
                        <span className="font-bold text-[#183647]">{item.sourceResearchTitle}</span>
                        {item.expeditionName && (
                          <span className="ml-2 font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                            {item.expeditionName}
                          </span>
                        )}
                      </div>

                      {item.views !== undefined && item.views > 0 && (
                        <div className="flex items-center gap-3">
                          <span>👁 {item.views.toLocaleString()} views</span>
                          <span>🔄 {item.shares} shares</span>
                          <span>❤️ {item.likes} likes</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================
            3. MEDIA LIBRARY VIEW
            ================================================== */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#183647]">Yuki Centralized Scientific Media Library</h3>
                <p className="text-xs text-[#487b91]">High-resolution photographs, videos, satellite imagery, drone footage, and expedition media.</p>
              </div>

              <button onClick={() => setShowUploadTagModal(true)} className="btn-primary text-xs flex items-center gap-1.5">
                <Upload size={15} /> Upload Media Asset
              </button>
            </div>

            {/* Smart Media Search Bar */}
            <div className="card bg-white p-4 space-y-3 border border-[#183647]/15">
              <div className="grid gap-3 md:grid-cols-[1fr_250px]">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-[#487b91]" />
                  <input
                    type="text"
                    placeholder="Smart Search: Try 'Antarctic ice core sampling', 'Bharati Station', 'Svalbard'..."
                    value={mediaSearchQuery}
                    onChange={(e) => setMediaSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#183647]/20 outline-none"
                  />
                </div>

                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full py-2.5 px-3 text-xs rounded-xl border border-[#183647]/20 outline-none font-semibold text-[#183647]"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Photographs">Photographs</option>
                    <option value="Videos">Videos</option>
                    <option value="Satellite Images">Satellite Images</option>
                    <option value="Drone Footage">Drone Footage</option>
                    <option value="Ice / Glacier">Ice / Glacier</option>
                    <option value="Ocean">Ocean</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Research Activities">Research Activities</option>
                    <option value="Scientists">Scientists</option>
                    <option value="Expedition Ships">Expedition Ships</option>
                    <option value="Research Stations">Research Stations</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Media Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="card p-0 overflow-hidden bg-white border border-[#183647]/15 flex flex-col justify-between group shadow-sm hover:shadow-md transition">
                  <div>
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                        {asset.category}
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#183647] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#183647]/20">
                        {asset.approvalStatus}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-[#183647] text-sm group-hover:text-[#487b91] transition">{asset.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{asset.description}</p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {asset.tags.map((t) => (
                          <span key={t} className="text-[10px] bg-slate-100 text-[#487b91] px-2 py-0.5 rounded-md font-semibold">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-[#487b91]">
                    <div>
                      <span className="font-semibold text-[#183647]">{asset.photographer}</span>
                      <div className="text-[10px] opacity-75">{asset.location}</div>
                    </div>

                    <button onClick={() => setShowMediaDetail(asset)} className="btn-secondary text-[11px] py-1 px-3">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================
            4. AI CONTENT STUDIO VIEW
            ================================================== */}
        {activeTab === 'aistudio' && (
          <div className="space-y-6">
            <div className="card bg-gradient-to-br from-[#071D33] via-[#183647] to-[#254d63] text-white p-6 space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-widest">
                <Sparkles size={16} /> Yuki Multi-Format AI Content Studio
              </div>
              <h3 className="text-2xl font-extrabold">ONE Scientific Source → MULTIPLE Outreach Formats</h3>
              <p className="text-xs text-white/80 max-w-2xl">
                Select an approved NCPOR Research Report or Dataset below to generate website articles, Instagram reels, LinkedIn posts, video scripts, infographics, and press releases simultaneously.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
              {/* Left Column: Source & Options */}
              <div className="card space-y-5 bg-white border border-[#183647]/15">
                <div>
                  <label className="block text-xs font-bold text-[#183647] uppercase tracking-wider mb-2">1. Select Verified Scientific Source:</label>
                  <select
                    value={selectedSourceId}
                    onChange={(e) => setSelectedSourceId(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-[#183647]/20 outline-none bg-slate-50 font-bold text-[#183647]"
                  >
                    {reports.map((r) => (
                      <option key={r.id} value={r.id}>
                        [{r.region}] {r.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183647] uppercase tracking-wider mb-2">2. Check Target Formats to Generate:</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      'Website Article',
                      'Social Media Post',
                      'Video Script',
                      'Infographic',
                      'Press Release',
                      'Educational Content',
                    ].map((fmt) => (
                      <label key={fmt} className="flex items-center gap-2 p-2.5 rounded-xl border border-[#183647]/15 bg-slate-50/50 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={checkedFormats.includes(fmt as ContentType)}
                          onChange={() =>
                            setCheckedFormats((prev) =>
                              prev.includes(fmt as ContentType)
                                ? prev.filter((x) => x !== fmt)
                                : [...prev, fmt as ContentType]
                            )
                          }
                          className="rounded text-[#183647]"
                        />
                        <span className="font-semibold text-[#183647]">{fmt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#487b91] mb-1">Target Audience</label>
                    <select
                      value={studioAudience}
                      onChange={(e) => setStudioAudience(e.target.value as TargetAudience)}
                      className="w-full p-2 text-xs rounded-xl border border-[#183647]/15 bg-white"
                    >
                      {AUDIENCES.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#487b91] mb-1">Language</label>
                    <select
                      value={studioLanguage}
                      onChange={(e) => setStudioLanguage(e.target.value as any)}
                      className="w-full p-2 text-xs rounded-xl border border-[#183647]/15 bg-white"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Bengali">Bengali (বাংলা)</option>
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerateStudioAll}
                  disabled={isGenerating}
                  className="btn-primary w-full justify-center py-3 text-xs"
                >
                  <Sparkles size={16} /> {isGenerating ? 'Synthesizing Formats from Source...' : 'Generate Formats from Source'}
                </button>
              </div>

              {/* Right Column: Generated Outputs */}
              <div className="card space-y-4 bg-white border border-[#183647]/15">
                <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
                  <h4 className="font-bold text-[#183647] text-base">Generated Studio Formats</h4>
                  {copiedNotice && <span className="text-xs font-bold text-emerald-700">{copiedNotice}</span>}
                </div>

                {generatedStudioOutputs ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 text-xs">
                    {Object.entries(generatedStudioOutputs).map(([fmt, text]) => (
                      <div key={fmt} className="rounded-xl border border-[#183647]/15 bg-slate-50 p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#183647] bg-white px-2.5 py-1 rounded-md border border-[#183647]/10">{fmt}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => triggerCopy(text, `Copied ${fmt}!`)}
                              className="text-[#487b91] hover:text-[#183647] font-semibold flex items-center gap-1"
                            >
                              <Copy size={13} /> Copy
                            </button>
                          </div>
                        </div>

                        <p className="text-slate-800 whitespace-pre-line leading-5 font-mono text-[11px] bg-white p-3 rounded-lg border border-slate-200">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                    <Sparkles size={36} className="text-purple-600" />
                    <p className="text-sm font-bold text-[#183647]">Select source and click Generate</p>
                    <p className="text-xs text-[#487b91] max-w-sm">Synthesizes structured formats strictly referenced to NCPOR research data.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            5. CAMPAIGNS VIEW
            ================================================== */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#183647]">Outreach Campaigns Secretariat</h3>
                <p className="text-xs text-[#487b91]">Orchestrate multi-channel communication drives connecting articles, videos, infographics, and quizzes.</p>
              </div>

              <button onClick={() => setShowNewCampaignModal(true)} className="btn-primary text-xs flex items-center gap-1.5">
                <Plus size={15} /> New Campaign
              </button>
            </div>

            <div className="space-y-4">
              {campaigns.map((cmp) => (
                <div key={cmp.id} className="card p-6 space-y-4 bg-white border border-[#183647]/15 shadow-sm">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {cmp.status.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-[#487b91] bg-slate-100 px-2.5 py-0.5 rounded-full">
                          Topic: {cmp.topic}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-[#183647]">{cmp.title}</h4>
                      <p className="text-xs text-slate-600 max-w-2xl">{cmp.objective}</p>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-2xl font-black text-[#183647]">{cmp.estimatedReach.toLocaleString()}</div>
                      <div className="text-[11px] font-bold text-[#487b91]">Estimated Public Reach</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#487b91]">
                      <span>Campaign Execution Progress</span>
                      <span>{cmp.progressPercent}% Completed</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#183647] rounded-full transition-all duration-500" style={{ width: `${cmp.progressPercent}%` }} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-xs gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-bold text-[#487b91]">Channels:</span>
                      {cmp.channels.map((ch) => (
                        <span key={ch} className="px-2 py-0.5 rounded bg-slate-100 text-[#183647] font-semibold text-[11px]">
                          {ch}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[#487b91]">Lead: <strong className="text-[#183647]">{cmp.assignedLead}</strong></span>
                      <button onClick={() => changeTab('aistudio')} className="btn-secondary text-xs py-1 px-3">
                        + Add Content
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================
            6. ANALYTICS VIEW
            ================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#183647]">Yuki Outreach Analytics & Content Intelligence</h3>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {[
                ['Total Views', '48,500', Eye],
                ['Public Reach', '128,400', Users],
                ['Engagement Rate', '6.8%', ThumbsUp],
                ['Total Shares', '3,240', Share2],
                ['Watch Time', '412 Hrs', Play],
                ['PDF Downloads', '1,820', Download],
              ].map(([label, val, Icon]: any) => (
                <div key={label} className="card p-4 text-center space-y-2 bg-white">
                  <Icon size={20} className="mx-auto text-[#487b91]" />
                  <div className="text-2xl font-black text-[#183647]">{val}</div>
                  <div className="text-[11px] font-bold text-[#487b91] uppercase">{label}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card space-y-4 bg-white border border-[#183647]/15">
                <h4 className="font-bold text-[#183647] text-base">Channel Reach Performance</h4>
                <div className="space-y-4 text-xs">
                  {[
                    { channel: 'Yuki Website', reach: 48500, max: 50000 },
                    { channel: 'LinkedIn', reach: 32400, max: 50000 },
                    { channel: 'Instagram', reach: 28900, max: 50000 },
                    { channel: 'YouTube', reach: 14200, max: 50000 },
                    { channel: 'Newsletter', reach: 4400, max: 50000 },
                  ].map((item) => (
                    <div key={item.channel} className="space-y-1">
                      <div className="flex justify-between font-bold text-[#183647]">
                        <span>{item.channel}</span>
                        <span>{item.reach.toLocaleString()} views</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#487b91] rounded-full" style={{ width: `${(item.reach / item.max) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card space-y-4 bg-white border border-[#183647]/15">
                <h4 className="font-bold text-[#183647] text-base">Trending Scientific Topics</h4>
                <div className="space-y-3 text-xs">
                  {[
                    ['Antarctic Surface Temperature & Glaciology', '8.4K Readers', 'High Impact'],
                    ['Svalbard Fjord Hydrography & Meltwater', '6.2K Readers', 'High Impact'],
                    ['Himansh Observatory & Himalayan Glaciers', '5.1K Readers', 'Growing Interest'],
                    ['Southern Ocean Carbon Sink Profiling', '3.8K Readers', 'Steady'],
                  ].map(([topic, readers, badge]) => (
                    <div key={topic} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#183647]">{topic}</div>
                        <div className="text-[11px] text-[#487b91]">{readers}</div>
                      </div>
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==================================================
          MODAL 1: CREATE CONTENT MODAL
          ================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 space-y-5 shadow-2xl border border-[#183647]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#183647]">Create New Polar Outreach Content</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#487b91] hover:text-[#183647]"><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateContentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#487b91] mb-1">Story Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 30-Year Cryosphere Observations at Bharati Station"
                  className="w-full p-3 rounded-xl border border-[#183647]/20 outline-none text-sm text-[#183647]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#487b91] mb-1">Content Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ContentType)}
                    className="w-full p-2.5 rounded-xl border border-[#183647]/20 outline-none"
                  >
                    {CONTENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#487b91] mb-1">Source Scientific Research</label>
                  <select
                    value={newSourceId}
                    onChange={(e) => setNewSourceId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#183647]/20 outline-none font-semibold text-[#183647]"
                  >
                    {reports.map((r) => (
                      <option key={r.id} value={r.id}>[{r.region}] {r.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#487b91] mb-1">Target Audience</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value as TargetAudience)}
                    className="w-full p-2.5 rounded-xl border border-[#183647]/20 outline-none"
                  >
                    {AUDIENCES.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#487b91] mb-1">Primary Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as Platform)}
                    className="w-full p-2.5 rounded-xl border border-[#183647]/20 outline-none"
                  >
                    {CHANNELS.map((ch) => (
                      <option key={ch} value={ch}>{ch}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#487b91] mb-1">Language</label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#183647]/20 outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary text-xs">Cancel</button>
                <button type="submit" className="btn-primary text-xs">Create & Open Editor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL 2: AI CONTENT EDITOR & TRACEABILITY MODAL
          ================================================== */}
      {activeEditorItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-5xl bg-white rounded-3xl p-6 space-y-5 shadow-2xl border border-[#183647]/20 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full uppercase">
                  AI CONTENT STUDIO EDITOR · #{activeEditorItem.id}
                </span>
                <h3 className="text-xl font-bold text-[#183647] mt-1">{activeEditorItem.title}</h3>
              </div>
              <button onClick={() => setActiveEditorItem(null)} className="text-[#487b91] hover:text-[#183647]"><X size={20} /></button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
              {/* Left Column: Editor Text Area */}
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Languages size={15} className="text-[#487b91]" />
                    <span className="font-bold text-[#183647]">Live Translation:</span>
                    {(['English', 'Hindi', 'Bengali', 'Telugu', 'Tamil'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setEditorLanguage(lang)}
                        className={`px-2 py-0.5 rounded-md font-bold transition ${
                          editorLanguage === lang ? 'bg-[#183647] text-white' : 'bg-white text-[#487b91] border border-slate-200'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#487b91] mb-1">Outreach Body Text ({editorLanguage})</label>
                  <textarea
                    rows={12}
                    value={translateText(activeEditorItem.contentBody, editorLanguage)}
                    onChange={(e) => {
                      const updatedBody = e.target.value;
                      setActiveEditorItem((prev) => prev ? { ...prev, contentBody: updatedBody } : null);
                    }}
                    className="w-full p-4 rounded-xl border border-[#183647]/20 outline-none font-mono text-xs text-[#183647] leading-6 bg-slate-50/50"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowAccuracyCheck(activeEditorItem);
                    }}
                    className="btn-secondary text-xs text-emerald-800 border-emerald-300 bg-emerald-50 flex items-center gap-1.5"
                  >
                    <ShieldCheck size={15} /> Run Scientific Accuracy Check
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setContentItems((prev) =>
                          prev.map((c) =>
                            c.id === activeEditorItem.id ? { ...activeEditorItem, status: 'Scientific Review' } : c
                          )
                        );
                        alert('Content submitted for Scientific Review!');
                        setActiveEditorItem(null);
                      }}
                      className="btn-primary text-xs"
                    >
                      Submit for Review
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Source Traceability Side Panel */}
              <div className="card space-y-4 bg-slate-50 border border-slate-200 p-4 text-xs">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <BookOpen size={16} className="text-[#487b91]" />
                  <h4 className="font-bold text-[#183647]">Content Lineage & Scientific Source</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] font-bold text-[#487b91] uppercase">Source Research Report</div>
                    <div className="font-bold text-[#183647] text-sm mt-0.5">{activeEditorItem.sourceResearchTitle}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-[#487b91] uppercase">Lead Researchers & Institute</div>
                    <div className="font-semibold text-[#183647]">{activeEditorItem.researcherName || 'Dr. Kavya Rao (NCPOR)'}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-[#487b91] uppercase">Expedition Lineage</div>
                    <div className="font-semibold text-purple-800">{activeEditorItem.expeditionName || '46th Indian Antarctic Expedition'}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-[#487b91] uppercase">Verification Status</div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold mt-0.5">
                      <CheckCircle2 size={14} /> 100% Matched with NCPOR Records
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL 3: SCIENTIFIC ACCURACY CHECK PANEL
          ================================================== */}
      {showAccuracyCheck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 space-y-5 shadow-2xl border border-emerald-300">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <ShieldCheck size={22} />
                <h3 className="text-lg font-bold">Scientific Accuracy Validation Engine</h3>
              </div>
              <button onClick={() => setShowAccuracyCheck(null)} className="text-[#487b91]"><X size={18} /></button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-900 text-sm">Verification Score: {showAccuracyCheck.accuracyScore}% MATCHED</div>
                  <div className="text-emerald-700">All claims cross-checked with NCPOR source repository</div>
                </div>
                <Badge>VERIFIED SOURCE</Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#183647]">Claim-by-Claim Validation Trail:</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white border border-emerald-200 flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">Claim 1: +0.31°C Surface Warming Trend</div>
                      <div className="text-slate-600 text-[11px]">Matched with Research Report #REP-1 (Section 2.1, Page 4)</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-emerald-200 flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">Claim 2: 120m Deep Ice Core Extraction</div>
                      <div className="text-slate-600 text-[11px]">Matched with Dataset #DS-TEMP-1 & IAE-46 Telemetry</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-emerald-200 flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">Claim 3: Lead Researcher Attribution</div>
                      <div className="text-slate-600 text-[11px]">Attributed to Dr. Kavya Rao (Senior Glaciologist, NCPOR)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL 4: MEDIA DETAIL & METADATA MODAL
          ================================================== */}
      {showMediaDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl p-6 space-y-5 shadow-2xl border border-[#183647]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#183647]">{showMediaDetail.title}</h3>
              <button onClick={() => setShowMediaDetail(null)} className="text-[#487b91]"><X size={18} /></button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 text-xs">
              <div className="space-y-3">
                <img src={showMediaDetail.url} alt={showMediaDetail.title} className="w-full h-56 rounded-2xl object-cover shadow-sm" />
                <p className="text-slate-700">{showMediaDetail.description}</p>
              </div>

              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-[#183647] text-sm">Media Metadata Details</h4>

                <div className="space-y-1.5 pt-2">
                  <div><span className="font-bold text-[#487b91]">Category:</span> {showMediaDetail.category}</div>
                  <div><span className="font-bold text-[#487b91]">Photographer:</span> {showMediaDetail.photographer}</div>
                  <div><span className="font-bold text-[#487b91]">Scientist:</span> {showMediaDetail.scientist}</div>
                  <div><span className="font-bold text-[#487b91]">Expedition:</span> {showMediaDetail.expedition}</div>
                  <div><span className="font-bold text-[#487b91]">Location:</span> {showMediaDetail.location}</div>
                  <div><span className="font-bold text-[#487b91]">Copyright:</span> {showMediaDetail.copyright}</div>
                  <div><span className="font-bold text-[#487b91]">License:</span> {showMediaDetail.license}</div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setMediaAssets((prev) =>
                        prev.map((a) => (a.id === showMediaDetail.id ? { ...a, hasMetadata: true, approvalStatus: 'Approved' } : a))
                      );
                      alert('Metadata updated and asset approved!');
                      setShowMediaDetail(null);
                    }}
                    className="btn-primary text-xs w-full justify-center"
                  >
                    Save & Approve Metadata
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL 5: AI MEDIA TAGGING & UPLOAD MODAL
          ================================================== */}
      {showUploadTagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 space-y-5 shadow-2xl border border-[#183647]/20">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#183647]">Upload & AI Media Tagging</h3>
              <button onClick={() => setShowUploadTagModal(false)} className="text-[#487b91]"><X size={18} /></button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#487b91] mb-1">Asset Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#183647]/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#487b91] mb-1">Photographer</label>
                  <input
                    type="text"
                    value={uploadPhotographer}
                    onChange={(e) => setUploadPhotographer(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#183647]/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#487b91] mb-1">Expedition</label>
                  <input
                    type="text"
                    value={uploadExpedition}
                    onChange={(e) => setUploadExpedition(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#183647]/20 outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-900 flex items-center gap-1.5">
                    <Sparkles size={14} /> AI Suggested Metadata & Keywords
                  </span>
                  <button
                    onClick={() => {
                      setAiTaggingActive(true);
                      setTimeout(() => {
                        setUploadTags(['Antarctica', 'Ice Core', 'Field Research', 'Bharati Base', 'Glaciology', 'Climate']);
                        setAiTaggingActive(false);
                      }, 800);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-200 text-purple-900 font-bold text-[10px]"
                  >
                    {aiTaggingActive ? 'Analyzing...' : 'Re-Analyze Image'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {uploadTags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-800 font-semibold text-[11px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  const newAsset: MediaAssetRecord = {
                    id: `asset-${Date.now()}`,
                    title: uploadTitle,
                    description: 'Newly uploaded polar expedition media asset with verified metadata.',
                    category: uploadCategory,
                    photographer: uploadPhotographer,
                    scientist: 'Field Team Scientist',
                    expedition: uploadExpedition,
                    expeditionId: 'iae46',
                    location: 'Antarctica',
                    date: new Date().toISOString().split('T')[0],
                    researchActivity: 'Field Work',
                    researchTopic: 'Polar Research',
                    copyright: '© 2026 NCPOR / MoES',
                    license: 'CC BY 4.0',
                    usagePermission: 'Approved for Open Outreach',
                    attribution: `Photo: ${uploadPhotographer} / NCPOR`,
                    source: 'Upload Secretariat',
                    approvalStatus: 'Approved',
                    url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&auto=format&fit=crop&q=80',
                    tags: uploadTags,
                    hasMetadata: true,
                  };

                  setMediaAssets((prev) => [newAsset, ...prev]);
                  setShowUploadTagModal(false);
                  alert('Media asset uploaded and metadata saved successfully!');
                }}
                className="btn-primary text-xs w-full justify-center"
              >
                Upload & Save Media Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL 6: NEW CAMPAIGN SETUP MODAL
          ================================================== */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-5 shadow-2xl border border-[#183647]/20">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#183647]">Create New Outreach Campaign</h3>
              <button onClick={() => setShowNewCampaignModal(false)} className="text-[#487b91]"><X size={18} /></button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#487b91] mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={newCampaignTitle}
                  onChange={(e) => setNewCampaignTitle(e.target.value)}
                  placeholder="e.g. Antarctica Science Month 2026"
                  className="w-full p-2.5 rounded-xl border border-[#183647]/20 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#487b91] mb-1">Objective</label>
                <textarea
                  rows={3}
                  value={newCampaignObj}
                  onChange={(e) => setNewCampaignObj(e.target.value)}
                  placeholder="Describe target goals and outreach objectives..."
                  className="w-full p-2.5 rounded-xl border border-[#183647]/20 outline-none"
                />
              </div>

              <button
                onClick={() => {
                  const newC: MediaCampaign = {
                    id: `cmp-${Date.now()}`,
                    title: newCampaignTitle || 'Untitled Campaign',
                    objective: newCampaignObj || 'Outreach campaign for polar science awareness.',
                    topic: 'Polar Research',
                    startDate: '2026-10-01',
                    endDate: '2026-10-31',
                    channels: ['Yuki Website', 'Instagram', 'LinkedIn', 'YouTube'],
                    status: 'Active',
                    targetAudience: newCampaignAudience,
                    assignedLead: profile?.name || 'Content Lead',
                    linkedContentIds: [],
                    estimatedReach: 20000,
                    actualReach: 0,
                    engagementCount: 0,
                    progressPercent: 10,
                  };

                  setCampaigns((prev) => [newC, ...prev]);
                  setShowNewCampaignModal(false);
                  alert('Campaign created!');
                }}
                className="btn-primary text-xs w-full justify-center"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
