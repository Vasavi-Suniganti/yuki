export type Role =
  | 'public_student'
  | 'researcher_scientist'
  | 'ncpor_admin'
  | 'media_content'
  | 'PUBLIC_USER'
  | 'RESEARCHER'
  | 'SCIENTIFIC_REVIEWER'
  | 'MEDIA_MANAGER'
  | 'PLATFORM_ADMIN';

export function normalizeRole(role?: string): 'public_student' | 'researcher_scientist' | 'ncpor_admin' | 'media_content' {
  if (!role) return 'public_student';
  const r = role.toLowerCase();
  if (r.includes('admin') || r.includes('ncpor_admin') || r === 'platform_admin') {
    return 'ncpor_admin';
  }
  if (r.includes('researcher') || r.includes('scientist') || r === 'scientific_reviewer') {
    return 'researcher_scientist';
  }
  if (r.includes('media') || r.includes('content') || r === 'media_manager') {
    return 'media_content';
  }
  return 'public_student';
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  institution?: string;
  designation?: string;
  bio?: string;
  role: Role;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  followedExpeditions?: string[];
  followedTopics?: string[];
  followedDatasets?: string[];
  savedPapers?: string[];
  savedDatasets?: string[];
}

export type ReviewStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'REVISION_REQUESTED'
  | 'RESUBMITTED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export interface ReviewRecord {
  id: string;
  entityId: string;
  entityType: 'document' | 'dataset' | 'publication' | 'media' | 'report';
  title: string;
  authorId: string;
  authorName: string;
  reviewerId?: string;
  reviewerName?: string;
  status: ReviewStatus;
  comments: {
    id: string;
    authorId: string;
    authorName: string;
    role: Role;
    text: string;
    createdAt: string;
    lineOrSection?: string;
  }[];
  aiExtractedEntities?: {
    locationMentions: string[];
    expeditionMentions: string[];
    stationMentions: string[];
    keywords: string[];
  };
  submittedAt: string;
  updatedAt: string;
}

export interface ResearcherProfile {
  id: string;
  name: string;
  role: string;
  institution: string;
  specialization: string;
  region: string;
  bio: string;
  email: string;
  interests: string[];
  avatar: string;
  expeditions: string[];
  publications: string[];
  datasets: string[];
  reports: string[];
}

export interface Expedition {
  id: string;
  title: string;
  number: number;
  year: string;
  region: 'Antarctica' | 'Arctic' | 'Southern Ocean' | 'Himalayas' | 'Himalaya / High Altitude';
  status: 'Planning' | 'Ongoing' | 'Completed' | 'Historical';
  objective: string;
  leader: string;
  vesselOrBase?: string;
  scientists: string[];
  institutions?: string[];
  stations: string[];
  route: [number, number][]; // [longitude, latitude]
  categories: string[];
  researchAreas?: string[];
  stationsVisited?: string[];
  samplingActivities?: string[];
  instrumentsDeployed?: string[];
  samplesCollectedCount?: number;
  datasets: string[];
  publications: string[];
  reports?: string[];
  media: string[];
  progress?: number;
  startDate?: string;
  endDate?: string;
  events?: ExpeditionEvent[];
  latestUpdates?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpeditionEvent {
  id: string;
  timestamp: string;
  location: [number, number];
  activity: string;
  eventType: 'departure' | 'transit' | 'station_arrival' | 'field_work' | 'sampling' | 'discovery' | 'return';
  station?: string;
  sampleId?: string;
  mediaId?: string;
  datasetId?: string;
  description: string;
}

export interface Dataset {
  id: string;
  title: string;
  category: string;
  region: string;
  period: string;
  format: string;
  size: string;
  description: string;
  variables: string[];
  unit: string;
  status: 'PROVISIONAL' | 'VERIFIED' | 'EXPERIMENTAL' | 'ARCHIVED';
  verificationStatus?: 'PENDING_NCPOR_VERIFICATION' | 'VERIFIED_BY_NCPOR';
  downloads: number;
  views?: number;
  saves?: number;
  source: string;
  doi?: string;
  recordCount?: number;
  license?: string;
  collectionMethodology?: string;
  instruments?: string[];
  qualityStatus?: string;
  missingValuePolicy?: string;
  values: { year: number; value: number; [key: string]: any }[];
  version: string;
  previousVersionId?: string;
  changelog?: string;
  authorId?: string;
  researchers?: string[];
  expeditionId?: string;
  instrumentId?: string;
  storagePath?: string;
  reviewStatus?: ReviewStatus;
  relatedPublicationIds?: string[];
  relatedReportIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Publication {
  id: string;
  title: string;
  publicationType?: 'Journal Article' | 'Conference Paper' | 'Review Paper' | 'Monograph' | 'Policy Brief';
  authors: string[];
  affiliations?: string[];
  year: number;
  category: string;
  journal: string;
  doi: string;
  expedition?: string;
  researchRegion?: string;
  researchTopic?: string;
  abstract: string;
  keywords?: string[];
  background?: string;
  objectives?: string[];
  methodology?: string;
  studyArea?: string;
  dataSources?: string[];
  instruments?: string[];
  analysis?: string;
  keyFindings?: string[];
  results?: string;
  scientificSignificance?: string;
  limitations?: string;
  citations: number;
  expeditionId?: string;
  stationId?: string;
  linkedDatasetIds?: string[];
  relatedReportIds?: string[];
  relatedResearcherIds?: string[];
  relatedPublicationIds?: string[];
  references?: string[];
  verificationStatus?: 'PENDING_NCPOR_VERIFICATION' | 'VERIFIED_BY_NCPOR';
  versionHistory?: string[];
  publicationUrl?: string;
  storagePath?: string;
  reviewStatus?: ReviewStatus;
  authorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResearchReport {
  id: string;
  title: string;
  authors: string[];
  authorIds?: string[];
  executiveSummary: string;
  objectives: string[];
  region: string;
  expeditionId: string;
  researchArea: string;
  methodology: string;
  observations: string;
  findings: string[];
  dataCollected: string;
  results: string;
  conclusions: string;
  recommendations: string[];
  relatedDatasetIds: string[];
  relatedPublicationIds: string[];
  relatedMediaIds: string[];
  verificationStatus: 'PENDING_NCPOR_VERIFICATION' | 'VERIFIED_BY_NCPOR';
  category?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  text: string;
  pageNumber: number;
  section: string;
  chunkIndex: number;
  category: string;
  author: string;
  createdAt?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  caption: string;
  aiDescription?: string;
  tags: string[];
  tag?: string;
  type: 'Photo' | 'Video' | 'Audio' | 'Infographic';
  expeditionId?: string;
  expedition?: string;
  projectId?: string;
  publicationId?: string;
  reportId?: string;
  datasetId?: string;
  location?: string;
  date?: string;
  photographer?: string;
  researchActivity?: string;
  url: string;
  storagePath?: string;
  transcript?: string;
  authorId?: string;
  reviewStatus?: ReviewStatus;
  createdAt?: string;
}

export interface Station {
  id: string;
  name: string;
  region: 'Antarctica' | 'Arctic' | 'Himalaya';
  coordinates: [number, number];
  establishedYear: number;
  status: 'Active' | 'Seasonal' | 'Historical';
  description: string;
  tour360Images?: { id: string; roomName: string; imageUrl: string; hotspots: { pitch: number; yaw: number; text: string; nextRoomId?: string }[] }[];
}

export interface Instrument {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  type: string;
  stationId?: string;
  expeditionId?: string;
  calibrationDate: string;
  status: 'active' | 'maintenance' | 'retired';
  owner: string;
  linkedDatasetIds: string[];
}

export interface Sample {
  id: string;
  sampleCode: string;
  expeditionId: string;
  scientistName: string;
  scientistId: string;
  dateCollected: string;
  coordinates: [number, number];
  instrumentId?: string;
  observations: string;
  linkedDatasetIds: string[];
  linkedPublicationIds: string[];
  storageTemperature?: string;
  category: string;
  syncedOffline?: boolean;
}

export interface FieldObservation {
  id: string;
  scientistId: string;
  scientistName: string;
  timestamp: string;
  coordinates: [number, number];
  stationId?: string;
  expeditionId?: string;
  notes: string;
  weather: {
    tempC?: number;
    windSpeedKmh?: number;
    conditions?: string;
  };
  instrumentId?: string;
  mediaPaths?: string[];
  sampleId?: string;
  syncedStatus: 'pending' | 'syncing' | 'synced' | 'failed';
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: { userId: string; email: string; role: 'owner' | 'editor' | 'viewer' }[];
  datasets: string[];
  publications: string[];
  notes: { id: string; title: string; content: string; author: string; createdAt: string }[];
  tasks: { id: string; title: string; completed: boolean; assignedTo: string }[];
  createdAt: string;
}

export interface CuratedCollection {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  isPublic: boolean;
  itemIds: { id: string; type: 'dataset' | 'publication' | 'expedition' | 'media' }[];
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  objective: string;
  topic: string;
  startDate: string;
  endDate: string;
  channels: ('website' | 'news' | 'press' | 'linkedin' | 'instagram' | 'x' | 'youtube' | 'newsletter')[];
  status: 'draft' | 'review' | 'approved' | 'scheduled' | 'active' | 'completed';
  assignedUserId: string;
  contentItems: {
    id: string;
    type: string;
    title: string;
    text: string;
    reviewStatus: ReviewStatus;
  }[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'submission' | 'assignment' | 'revision' | 'resubmission' | 'approval' | 'rejection' | 'publication' | 'system';
  title: string;
  message: string;
  targetUrl: string;
  read: boolean;
  createdAt: string;
}

export interface KnowledgeGraphNode {
  id: string;
  name: string;
  group: 'Expedition' | 'Station' | 'Scientist' | 'Dataset' | 'Publication' | 'Location' | 'Media' | 'Topic' | 'Instrument';
  entityId?: string;
  metadata?: Record<string, any>;
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  label: string;
  sourceDocumentId?: string;
  confidence?: number;
}

export interface ApiKeyRecord {
  id: string;
  userId: string;
  label: string;
  keyHash: string;
  keyPrefix: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt?: string;
  requestCount: number;
  revoked: boolean;
}

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface EducationLesson {
  id: string;
  title: string;
  targetAudience: 'School' | 'College' | 'Teachers' | 'Public';
  summary: string;
  content: string;
  readingTimeMinutes: number;
  linkedPublicationIds?: string[];
  quizId?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'tf' | 'multi';
  options: string[];
  correctAnswers: number[];
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  lessonId?: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  total: number;
  passed: boolean;
  timestamp: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  shortDef: string;
  scientificDef: string;
  relatedTopics: string[];
  imageUrl?: string;
  relatedDatasetId?: string;
  relatedPaperId?: string;
}
