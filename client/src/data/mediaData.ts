import { ReviewStatus, Role } from '../../../shared/types';

export type ContentType =
  | 'Website Article'
  | 'News'
  | 'Press Release'
  | 'Social Media Post'
  | 'Video Script'
  | 'Infographic'
  | 'Data Story'
  | 'Educational Content'
  | 'Scientific Explainer'
  | 'Quiz'
  | 'Newsletter';

export type TargetAudience =
  | 'General Public'
  | 'Students'
  | 'Researchers'
  | 'Media'
  | 'Government'
  | 'International Audience';

export type Platform =
  | 'Yuki Website'
  | 'Instagram'
  | 'LinkedIn'
  | 'X'
  | 'Facebook'
  | 'YouTube'
  | 'Newsletter';

export type ApprovalStage =
  | 'Draft'
  | 'In Review'
  | 'Scientific Review'
  | 'Official Approval'
  | 'Scheduled'
  | 'Published'
  | 'Rejected'
  | 'Needs Changes';

export interface MediaContentItem {
  id: string;
  title: string;
  contentType: ContentType;
  sourceResearchId: string;
  sourceResearchTitle: string;
  sourceType: 'Research Report' | 'Publication' | 'Dataset' | 'Expedition';
  author: string;
  targetAudience: TargetAudience;
  platform: Platform;
  status: ApprovalStage;
  createdAt: string;
  updatedAt: string;
  language: 'English' | 'Hindi' | 'Bengali' | 'Telugu' | 'Tamil';
  contentBody: string;
  summary: string;
  tags: string[];
  accuracyVerified: boolean;
  accuracyScore: number;
  verificationNotes?: string[];
  expeditionId?: string;
  expeditionName?: string;
  researcherId?: string;
  researcherName?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  views?: number;
  shares?: number;
  likes?: number;
}

export interface MediaAssetRecord {
  id: string;
  title: string;
  description: string;
  category:
    | 'Photographs'
    | 'Videos'
    | 'Satellite Images'
    | 'Drone Footage'
    | 'Ice / Glacier'
    | 'Ocean'
    | 'Landscape'
    | 'Research Activities'
    | 'Scientists'
    | 'Expedition Ships'
    | 'Research Stations';
  photographer: string;
  scientist: string;
  expedition: string;
  expeditionId: string;
  location: string;
  date: string;
  researchActivity: string;
  researchTopic: string;
  copyright: string;
  license: string;
  usagePermission: string;
  attribution: string;
  source: string;
  approvalStatus: 'Approved' | 'Pending Review' | 'Draft';
  url: string;
  tags: string[];
  hasMetadata: boolean;
}

export interface MediaCampaign {
  id: string;
  title: string;
  objective: string;
  topic: string;
  startDate: string;
  endDate: string;
  channels: Platform[];
  status: 'Draft' | 'In Review' | 'Official Approval' | 'Scheduled' | 'Active' | 'Completed';
  targetAudience: TargetAudience;
  assignedLead: string;
  linkedContentIds: string[];
  estimatedReach: number;
  actualReach: number;
  engagementCount: number;
  progressPercent: number;
}

export interface CalendarEventItem {
  id: string;
  contentId: string;
  title: string;
  contentType: ContentType;
  platform: Platform;
  date: string;
  time: string;
  status: ApprovalStage;
  targetAudience: TargetAudience;
}

export interface MediaNotification {
  id: string;
  type: 'research' | 'review' | 'approval' | 'rejection' | 'schedule' | 'metadata';
  title: string;
  message: string;
  timestamp: string;
  targetId: string;
  targetType: 'content' | 'research' | 'media' | 'campaign';
  read: boolean;
}

// Initial Sample Data for Yuki Media Portal
export const initialMediaContentItems: MediaContentItem[] = [
  {
    id: 'cnt-1',
    title: '30-Year East Antarctic Surface Temperature Anomaly Discovered',
    contentType: 'Website Article',
    sourceResearchId: 'rep-1',
    sourceResearchTitle: 'Larsemann Hills Ice Core Paleoclimate Report',
    sourceType: 'Research Report',
    author: 'Outreach Team (Ananya Sharma)',
    targetAudience: 'General Public',
    platform: 'Yuki Website',
    status: 'Published',
    createdAt: '2026-09-20',
    updatedAt: '2026-09-22',
    language: 'English',
    contentBody: `Researchers from the National Centre for Polar and Ocean Research (NCPOR) at Bharati Station have uncovered a critical 30-year climate trend in East Antarctica.

Through continuous atmospheric measurements and deep ice core paleoclimate analysis, scientists documented a surface temperature anomaly trend of +0.31°C per decade across Princess Elizabeth Land.

"This dataset provides vital ground-truth evidence connecting Antarctic cryosphere dynamics with global climate patterns," stated lead glaciologist Dr. Kavya Rao.

Key Takeaways:
• +0.31°C mean surface warming documented across 30 years of observations.
• 120-meter deep ice core extracted at Princess Elizabeth Land traverse waypoint.
• Open-access dataset now available on the Yuki portal for global researchers.`,
    summary: 'NCPOR glaciologists publish 30-year climate warming trends in East Antarctica with open-access datasets.',
    tags: ['Antarctica', 'Climate Change', 'NCPOR', 'Ice Core', 'Bharati Station'],
    accuracyVerified: true,
    accuracyScore: 100,
    verificationNotes: [
      'Claims matched with Research Report #REP-1 (Page 4, Section 2.1)',
      'Statistics verified against Dataset #DS-TEMP-1',
      'Researcher attribution confirmed (Dr. Kavya Rao - NCPOR)',
    ],
    expeditionId: 'iae46',
    expeditionName: '46th Indian Antarctic Expedition (IAE-46)',
    researcherId: 'res-1',
    researcherName: 'Dr. Kavya Rao',
    scheduledDate: '2026-09-22',
    scheduledTime: '10:00 AM',
    views: 14200,
    shares: 890,
    likes: 2150,
  },
  {
    id: 'cnt-2',
    title: 'Behind the Ice: Daily Life & Science at Bharati Station',
    contentType: 'Social Media Post',
    sourceResearchId: 'rep-1',
    sourceResearchTitle: 'Larsemann Hills Ice Core Paleoclimate Report',
    sourceType: 'Expedition',
    author: 'Rahul Verma (Social Lead)',
    targetAudience: 'Students',
    platform: 'Instagram',
    status: 'Published',
    createdAt: '2026-09-24',
    updatedAt: '2026-09-25',
    language: 'English',
    contentBody: `Living at -40°C in East Antarctica! 🧊✨

How do Indian scientists measure ice thickness and weather patterns every single day? At Bharati Station in Larsemann Hills, researchers launch weather balloons, analyze deep ice cores, and map sub-glacial bedrock.

Swipe to see:
1️⃣ Deep ice core drilling in progress
2️⃣ Launching the continuous micro-lidar
3️⃣ Sunset over Prydz Bay ice shelf

Explore the live data on Yuki! Link in bio. 📊

#Antarctica #PolarScience #NCPOR #BharatiStation #ClimateAction #SciComm`,
    summary: 'Instagram multi-carousel post showcasing station life and field research at Bharati Base.',
    tags: ['Instagram', 'Bharati Station', 'Polar Science', 'Students'],
    accuracyVerified: true,
    accuracyScore: 98,
    verificationNotes: [
      'Station location and temperature range verified against Bharati Station telemetry log.',
      'Field photographs verified under NCPOR media license.',
    ],
    expeditionId: 'iae46',
    expeditionName: '46th Indian Antarctic Expedition (IAE-46)',
    researcherId: 'res-1',
    researcherName: 'Dr. Kavya Rao',
    scheduledDate: '2026-09-25',
    scheduledTime: '06:00 PM',
    views: 28500,
    shares: 1420,
    likes: 4800,
  },
  {
    id: 'cnt-3',
    title: 'Svalbard Fjord Hydrography & Glacier Meltwater Runoff Study',
    contentType: 'News',
    sourceResearchId: 'rep-2',
    sourceResearchTitle: 'Kongsfjorden Glacier Meltwater & Hydrography Study',
    sourceType: 'Publication',
    author: 'Science Press Desk',
    targetAudience: 'Media',
    platform: 'Yuki Website',
    status: 'Official Approval',
    createdAt: '2026-09-26',
    updatedAt: '2026-09-27',
    language: 'English',
    contentBody: `NY-ÅLESUND, SVALBARD — Indian researchers operating from Himadri Station in the High Arctic have published findings on glacier meltwater discharge into Kongsfjorden.

The study, led by Dr. R. Banerjee of CSIR-NIO, documents seasonal salinity drops of 4.2 PSU in upper fjord waters during summer melt peaks, directly impacting Arctic marine food webs.`,
    summary: 'Arctic summer campaign reveals significant freshwater injection into Svalbard fjords.',
    tags: ['Arctic', 'Svalbard', 'Himadri Station', 'Oceanography'],
    accuracyVerified: true,
    accuracyScore: 95,
    verificationNotes: ['Hydrographic data verified against Dataset #DS-PERMAFROST-3'],
    expeditionId: 'arctic26',
    expeditionName: 'Indian Arctic Expedition 2026',
    researcherId: 'res-4',
    researcherName: 'Dr. R. Banerjee',
    scheduledDate: '2026-09-30',
    scheduledTime: '09:00 AM',
    views: 5400,
    shares: 320,
    likes: 640,
  },
  {
    id: 'cnt-4',
    title: 'Antarctic Sea Ice Dynamics 60-Second Video Explainer',
    contentType: 'Video Script',
    sourceResearchId: 'ds-temp-1',
    sourceResearchTitle: 'East Antarctic Surface Temperature Anomaly Dataset',
    sourceType: 'Dataset',
    author: 'Video Production Team',
    targetAudience: 'General Public',
    platform: 'YouTube',
    status: 'Scheduled',
    createdAt: '2026-09-27',
    updatedAt: '2026-09-28',
    language: 'English',
    contentBody: `HOOK (0-5s): "What happens when Antarctic sea ice retreats by 6.4%?"

SCENE 1 (5-20s): Aerial drone footage over fast ice near Larsemann Hills → Voiceover: "Satellite radar data collected by Indian expeditions shows sea ice concentration changes across Prydz Bay."

SCENE 2 (20-45s): Split screen graph showing 30-year trends vs CTD ocean depth temperature profiles → Voiceover: "Warming surface waters directly influence ice shelf stability and Southern Ocean currents."

CTA (45-60s): "Discover interactive 3D climate charts on the Yuki portal. Subscribe for more polar science stories!"`,
    summary: '60-second vertical video script breaking down Antarctic sea ice measurements.',
    tags: ['Video', 'YouTube', 'Sea Ice', 'Antarctica'],
    accuracyVerified: true,
    accuracyScore: 100,
    verificationNotes: ['All video statistics cross-referenced with Dataset #DS-TEMP-1'],
    expeditionId: 'iae46',
    expeditionName: '46th Indian Antarctic Expedition (IAE-46)',
    researcherId: 'res-5',
    researcherName: 'Dr. S. Malik',
    scheduledDate: '2026-10-01',
    scheduledTime: '07:00 PM',
    views: 0,
    shares: 0,
    likes: 0,
  },
  {
    id: 'cnt-5',
    title: 'Himansh Observatory: Monitoring Himalayan Glacier Mass Balance',
    contentType: 'Educational Content',
    sourceResearchId: 'rep-4',
    sourceResearchTitle: 'Chandra Basin Glacial Hydrology Survey',
    sourceType: 'Research Report',
    author: 'Education Desk',
    targetAudience: 'Students',
    platform: 'Yuki Website',
    status: 'Scientific Review',
    createdAt: '2026-09-27',
    updatedAt: '2026-09-28',
    language: 'English',
    contentBody: `At 13,500 feet in the Lahaul-Spiti valley of Himachal Pradesh, Indian glaciologists at Himansh Observatory track glacier retreat and seasonal snowpack runoff.

This educational guide explains how automatic weather stations (AWS) measure solar radiation, wind speed, and ice ablation rates in the High Himalayas.`,
    summary: 'Student guide on Himalayan glaciology and high-altitude weather monitoring.',
    tags: ['Himalayas', 'Himansh', 'Glacier', 'Education'],
    accuracyVerified: true,
    accuracyScore: 92,
    verificationNotes: ['Pending scientific review by Dr. A. Kumar'],
    expeditionId: 'himansh26',
    expeditionName: 'Himalayan Glacier Expedition 2026',
    researcherId: 'res-6',
    researcherName: 'Dr. A. Kumar',
    scheduledDate: '2026-10-05',
    scheduledTime: '11:00 AM',
    views: 0,
    shares: 0,
    likes: 0,
  },
  {
    id: 'cnt-6',
    title: 'Official Press Release: NCPOR Releases Open Polar Science Repository',
    contentType: 'Press Release',
    sourceResearchId: 'rep-1',
    sourceResearchTitle: 'Larsemann Hills Ice Core Paleoclimate Report',
    sourceType: 'Publication',
    author: 'MoES / NCPOR Media Office',
    targetAudience: 'Government',
    platform: 'Newsletter',
    status: 'Draft',
    createdAt: '2026-09-28',
    updatedAt: '2026-09-28',
    language: 'English',
    contentBody: `FOR IMMEDIATE RELEASE — Ministry of Earth Sciences (MoES) and National Centre for Polar and Ocean Research (NCPOR) announce the public launch of the Yuki Polar Science Platform.

The platform provides open digital access to over 1,200 verified polar datasets, 3,800 peer-reviewed scientific publications, and real-time expedition tracking across Antarctica, the Arctic, and the Himalayas.`,
    summary: 'Official MoES announcement for the Yuki open-access scientific repository.',
    tags: ['MoES', 'NCPOR', 'Press Release', 'Government'],
    accuracyVerified: true,
    accuracyScore: 100,
    verificationNotes: ['Approved by NCPOR Official Administration'],
    expeditionId: 'iae46',
    expeditionName: '46th Indian Antarctic Expedition (IAE-46)',
    researcherId: 'res-1',
    researcherName: 'Dr. Kavya Rao',
    scheduledDate: '2026-10-10',
    scheduledTime: '10:00 AM',
    views: 0,
    shares: 0,
    likes: 0,
  },
];

export const initialMediaAssets: MediaAssetRecord[] = [
  {
    id: 'asset-1',
    title: 'Deep Ice Core Extraction at Princess Elizabeth Land',
    description: 'Dr. Kavya Rao and team operating 120m electro-mechanical ice drill at waypoint 4, East Antarctica.',
    category: 'Research Activities',
    photographer: 'Dr. A. Menon (NCPOR)',
    scientist: 'Dr. Kavya Rao',
    expedition: '46th Indian Antarctic Expedition (IAE-46)',
    expeditionId: 'iae46',
    location: 'Princess Elizabeth Land, East Antarctica',
    date: '2026-12-14',
    researchActivity: 'Ice Core Drilling',
    researchTopic: 'Paleoclimatology & Mass Balance',
    copyright: '© 2026 NCPOR / MoES India',
    license: 'CC BY-NC 4.0 / Official Scientific Use',
    usagePermission: 'Approved for Public & Educational Outreach',
    attribution: 'Photo: NCPOR / Indian Antarctic Program',
    source: 'IAE-46 Field Archive',
    approvalStatus: 'Approved',
    url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&auto=format&fit=crop&q=80',
    tags: ['Antarctica', 'Ice Core', 'Glaciology', 'Drilling', 'Kavya Rao', 'Bharati'],
    hasMetadata: true,
  },
  {
    id: 'asset-2',
    title: 'Aerial View of Bharati Research Station in Larsemann Hills',
    description: 'State-of-the-art modular architecture of India’s Bharati station overlooking Prydz Bay.',
    category: 'Research Stations',
    photographer: 'Expedition Drone Crew (R. Singh)',
    scientist: 'Station Commander',
    expedition: '46th Indian Antarctic Expedition (IAE-46)',
    expeditionId: 'iae46',
    location: 'Larsemann Hills, Prydz Bay, East Antarctica',
    date: '2026-11-20',
    researchActivity: 'Station Infrastructure Monitoring',
    researchTopic: 'Polar Architecture & Logistics',
    copyright: '© 2026 NCPOR / MoES India',
    license: 'NCPOR Public Media License',
    usagePermission: 'Approved for Open Distribution',
    attribution: 'Photo: NCPOR Media Wing',
    source: 'Bharati Station Media Unit',
    approvalStatus: 'Approved',
    url: 'https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=800&auto=format&fit=crop&q=80',
    tags: ['Bharati Station', 'Architecture', 'Larsemann Hills', 'Prydz Bay', 'Antarctica'],
    hasMetadata: true,
  },
  {
    id: 'asset-3',
    title: 'Svalbard Glacial Fjord Hydrographic Sampling',
    description: 'Dr. R. Banerjee deploying CTD rosette from research boat in Kongsfjorden near Himadri Base.',
    category: 'Ocean',
    photographer: 'Dr. S. Malik (NIO)',
    scientist: 'Dr. R. Banerjee',
    expedition: 'Indian Arctic Expedition 2026',
    expeditionId: 'arctic26',
    location: 'Kongsfjorden, Ny-Ålesund, Svalbard',
    date: '2026-07-18',
    researchActivity: 'CTD Water Sampling & Salinity Measurement',
    researchTopic: 'Fjord Oceanography & Meltwater',
    copyright: '© 2026 CSIR-NIO / NCPOR',
    license: 'CC BY 4.0',
    usagePermission: 'Approved for Open Distribution',
    attribution: 'Photo: CSIR-NIO / Ny-Ålesund Research Team',
    source: 'Himadri Station Archive',
    approvalStatus: 'Approved',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    tags: ['Arctic', 'Svalbard', 'Kongsfjorden', 'Oceanography', 'Himadri'],
    hasMetadata: true,
  },
  {
    id: 'asset-4',
    title: 'Himansh High-Altitude Glacier Station in Lahaul-Spiti',
    description: 'Automatic weather station and mass balance stakes deployed at 13,500 ft elevation.',
    category: 'Ice / Glacier',
    photographer: 'Dr. A. Kumar (IISc)',
    scientist: 'Dr. A. Kumar',
    expedition: 'Himalayan Glacier Expedition 2026',
    expeditionId: 'himansh26',
    location: 'Chandra Basin, Himachal Pradesh, India',
    date: '2026-09-02',
    researchActivity: 'Glacier Ablation & Snowpack Depth Measurement',
    researchTopic: 'Himalayan Cryosphere Hydrology',
    copyright: '© 2026 IISc / NCPOR',
    license: 'CC BY 4.0',
    usagePermission: 'Approved for Educational Use',
    attribution: 'Photo: IISc Glaciology Team',
    source: 'Himansh Field Observatory',
    approvalStatus: 'Approved',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    tags: ['Himalayas', 'Himansh', 'Glacier', 'Weather Station', 'IISc'],
    hasMetadata: true,
  },
  {
    id: 'asset-5',
    title: 'ORV Sagar Nidhi Southern Ocean Expedition Transect',
    description: 'Oceanographic research vessel ORV Sagar Nidhi navigating iceberg field at 60°S latitude.',
    category: 'Expedition Ships',
    photographer: 'Ship Technical Crew',
    scientist: 'Dr. S. Malik',
    expedition: 'Southern Ocean Expedition 2026',
    expeditionId: 'so26',
    location: 'Southern Ocean (60°S, 50°E)',
    date: '2026-02-11',
    researchActivity: 'Deep Argo Float Deployment & Carbon Flux Profiling',
    researchTopic: 'Physical Oceanography & Carbon Sink',
    copyright: '© 2026 NCPOR / MoES India',
    license: 'NCPOR Media License',
    usagePermission: 'Approved for Media & Press Distribution',
    attribution: 'Photo: ORV Sagar Nidhi Crew / NCPOR',
    source: 'ORV Sagar Nidhi Vessel Archive',
    approvalStatus: 'Approved',
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80',
    tags: ['Sagar Nidhi', 'Ship', 'Southern Ocean', 'Oceanography', 'Iceberg'],
    hasMetadata: true,
  },
  {
    id: 'asset-6',
    title: 'Adélie Penguin Colony Observation near Maitri Station',
    description: 'Marine ecology monitoring of Adélie penguin nesting sites along Schirmacher Oasis.',
    category: 'Research Activities',
    photographer: 'Dr. N. Das (NCPOR)',
    scientist: 'Dr. N. Das',
    expedition: '45th Indian Antarctic Expedition (IAE-45)',
    expeditionId: 'iae45',
    location: 'Schirmacher Oasis, Queen Maud Land, Antarctica',
    date: '2025-12-28',
    researchActivity: 'Wildlife Census & Micro-habitat Telemetry',
    researchTopic: 'Polar Coastal Ecology',
    copyright: '© 2025 NCPOR / MoES',
    license: 'CC BY 4.0',
    usagePermission: 'Approved for Public Outreach',
    attribution: 'Photo: Dr. N. Das / NCPOR Bio Sciences',
    source: 'Maitri Station Bio Unit',
    approvalStatus: 'Approved',
    url: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=800&auto=format&fit=crop&q=80',
    tags: ['Penguin', 'Wildlife', 'Maitri', 'Schirmacher Oasis', 'Antarctica'],
    hasMetadata: true,
  },
  {
    id: 'asset-7',
    title: 'Raw Drone Survey Footage - Prydz Bay Fast Ice Melt',
    description: 'High-resolution thermal video imagery of sea ice break-up along Bharati coast.',
    category: 'Drone Footage',
    photographer: 'Unassigned Technician',
    scientist: 'Dr. Kavya Rao',
    expedition: '46th Indian Antarctic Expedition (IAE-46)',
    expeditionId: 'iae46',
    location: 'Prydz Bay, Antarctica',
    date: '2026-01-15',
    researchActivity: 'Thermal Remote Sensing',
    researchTopic: 'Sea Ice Dynamics',
    copyright: 'Pending',
    license: 'Pending Review',
    usagePermission: 'Restricted - Awaiting Metadata Verification',
    attribution: 'NCPOR Drone Telemetry Unit',
    source: 'Raw Drone Upload',
    approvalStatus: 'Pending Review',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    tags: ['Drone', 'Sea Ice', 'Prydz Bay', 'Raw Footage'],
    hasMetadata: false,
  },
];

export const initialMediaCampaigns: MediaCampaign[] = [
  {
    id: 'cmp-1',
    title: 'Antarctic Science Month 2026',
    objective: 'Showcase India’s 46th Antarctic Expedition discoveries to students, media, and global climate researchers.',
    topic: 'Antarctic Cryosphere & Climate Change',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    channels: ['Yuki Website', 'Instagram', 'LinkedIn', 'YouTube', 'Newsletter'],
    status: 'Active',
    targetAudience: 'General Public',
    assignedLead: 'Ananya Sharma (Content Director)',
    linkedContentIds: ['cnt-1', 'cnt-2', 'cnt-4'],
    estimatedReach: 45000,
    actualReach: 38400,
    engagementCount: 4210,
    progressPercent: 78,
  },
  {
    id: 'cmp-2',
    title: 'Polar Climate Education Drive for Indian Schools',
    objective: 'Bridge polar science research with high school geography and physics curricula across India.',
    topic: 'Himalayas & Polar Linkages',
    startDate: '2026-10-01',
    endDate: '2026-10-20',
    channels: ['Yuki Website', 'YouTube', 'Newsletter'],
    status: 'Scheduled',
    targetAudience: 'Students',
    assignedLead: 'Education Outreach Desk',
    linkedContentIds: ['cnt-5'],
    estimatedReach: 25000,
    actualReach: 0,
    engagementCount: 0,
    progressPercent: 30,
  },
  {
    id: 'cmp-3',
    title: 'MoES Open Scientific Data Announcement',
    objective: 'Announce public release of 1,200+ verified polar datasets to international climate modeling groups.',
    topic: 'Open Data & Scientific Transparency',
    startDate: '2026-10-10',
    endDate: '2026-10-25',
    channels: ['Yuki Website', 'LinkedIn', 'X', 'Newsletter'],
    status: 'Draft',
    targetAudience: 'Researchers',
    assignedLead: 'NCPOR Media Secretariat',
    linkedContentIds: ['cnt-6'],
    estimatedReach: 15000,
    actualReach: 0,
    engagementCount: 0,
    progressPercent: 15,
  },
];

export const initialCalendarEvents: CalendarEventItem[] = [
  { id: 'cal-1', contentId: 'cnt-1', title: '30-Year East Antarctic Temperature Story', contentType: 'Website Article', platform: 'Yuki Website', date: '2026-09-22', time: '10:00 AM', status: 'Published', targetAudience: 'General Public' },
  { id: 'cal-2', contentId: 'cnt-2', title: 'Behind the Ice: Bharati Station Reel & Carousel', contentType: 'Social Media Post', platform: 'Instagram', date: '2026-09-25', time: '06:00 PM', status: 'Published', targetAudience: 'Students' },
  { id: 'cal-3', contentId: 'cnt-3', title: 'Svalbard Fjord Hydrography Release', contentType: 'News', platform: 'Yuki Website', date: '2026-09-30', time: '09:00 AM', status: 'Official Approval', targetAudience: 'Media' },
  { id: 'cal-4', contentId: 'cnt-4', title: 'Antarctic Sea Ice Dynamics Video Explainer', contentType: 'Video Script', platform: 'YouTube', date: '2026-10-01', time: '07:00 PM', status: 'Scheduled', targetAudience: 'General Public' },
  { id: 'cal-5', contentId: 'cnt-5', title: 'Himansh Observatory Student Guide', contentType: 'Educational Content', platform: 'Yuki Website', date: '2026-10-05', time: '11:00 AM', status: 'Scientific Review', targetAudience: 'Students' },
  { id: 'cal-6', contentId: 'cnt-6', title: 'NCPOR Open Data Press Release', contentType: 'Press Release', platform: 'Newsletter', date: '2026-10-10', time: '10:00 AM', status: 'Draft', targetAudience: 'Government' },
];

export const initialMediaNotifications: MediaNotification[] = [
  {
    id: 'notif-1',
    type: 'approval',
    title: 'NCPOR Official Approval Granted',
    message: 'NCPOR Secretariat approved "30-Year East Antarctic Surface Temperature Story" for public dissemination.',
    timestamp: '2h ago',
    targetId: 'cnt-1',
    targetType: 'content',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'research',
    title: 'New Verified Scientific Research Available',
    message: 'Dr. Kavya Rao published "Larsemann Hills Ice Core Paleoclimate Report". Ready for Outreach story generation.',
    timestamp: '5h ago',
    targetId: 'rep-1',
    targetType: 'research',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'metadata',
    title: 'Media Asset Missing Metadata',
    message: 'Uploaded drone footage "Prydz Bay Fast Ice Melt" requires photographer and copyright attribution.',
    timestamp: '1d ago',
    targetId: 'asset-7',
    targetType: 'media',
    read: false,
  },
  {
    id: 'notif-4',
    type: 'review',
    title: 'Scientific Accuracy Check Complete',
    message: 'Dr. R. Banerjee verified accuracy of "Svalbard Fjord Hydrography Release" (100% match).',
    timestamp: '2d ago',
    targetId: 'cnt-3',
    targetType: 'content',
    read: true,
  },
];
