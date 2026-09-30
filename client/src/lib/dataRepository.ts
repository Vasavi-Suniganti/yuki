import {
  Expedition,
  Dataset,
  Publication,
  ResearchReport,
  ResearcherProfile,
  MediaItem,
  ReviewRecord,
  ReviewStatus,
} from '../../../shared/types';
import {
  expeditions as seedExpeditions,
  datasets as seedDatasets,
  publications as seedPublications,
  researchers as seedResearchers,
  reports as seedReports,
  media as seedMedia,
} from '../data/demo';
import { createDocument, updateDocumentItem, deleteDocumentItem } from '../services/dataService';
import { db, firebaseConfigured } from './firebase';

const STORAGE_KEY_PREFIX = 'polaris_data_v2_';

function loadInitial<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Error loading ${key} from localStorage:`, err);
  }
  return seed;
}

function saveToLocalStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error saving ${key} to localStorage:`, err);
  }
}

// Memory Stores initialized with persisted/seed data
let expeditionsStore: Expedition[] = loadInitial('expeditions', seedExpeditions);
let datasetsStore: Dataset[] = loadInitial('datasets', seedDatasets);
let publicationsStore: Publication[] = loadInitial('publications', seedPublications);
let reportsStore: ResearchReport[] = loadInitial('reports', seedReports as any);
let mediaStore: MediaItem[] = loadInitial('media', seedMedia as any);

// Listeners for live reactive updates across components
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribeDataRepository(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners(): void {
  listeners.forEach((cb) => cb());
}

// ── GETTERS ─────────────────────────────────────────────────────────────

export function getRepositoryExpeditions(): Expedition[] {
  return [...expeditionsStore];
}

export function getRepositoryDatasets(): Dataset[] {
  return [...datasetsStore];
}

export function getRepositoryPublications(): Publication[] {
  return [...publicationsStore];
}

export function getRepositoryReports(): ResearchReport[] {
  return [...reportsStore];
}

export function getRepositoryMedia(): MediaItem[] {
  return [...mediaStore];
}

export function getRepositoryResearchers(): ResearcherProfile[] {
  return seedResearchers;
}

// ── ADD / CREATE METHODS ────────────────────────────────────────────────

export async function addRepositoryExpedition(exp: Expedition): Promise<Expedition> {
  const newExp = {
    ...exp,
    id: exp.id || `exp-${Date.now()}`,
    createdAt: exp.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  expeditionsStore = [newExp, ...expeditionsStore];
  saveToLocalStorage('expeditions', expeditionsStore);

  if (firebaseConfigured && db) {
    try {
      await createDocument('expeditions', newExp);
    } catch (e) {
      console.warn('Firestore add expedition error:', e);
    }
  }

  notifyListeners();
  return newExp;
}

export async function addRepositoryDataset(ds: Dataset): Promise<Dataset> {
  const newDs = {
    ...ds,
    id: ds.id || `ds-${Date.now()}`,
    verificationStatus: ds.verificationStatus || 'PENDING_NCPOR_VERIFICATION',
    createdAt: ds.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  datasetsStore = [newDs, ...datasetsStore];
  saveToLocalStorage('datasets', datasetsStore);

  if (firebaseConfigured && db) {
    try {
      await createDocument('datasets', newDs);
    } catch (e) {
      console.warn('Firestore add dataset error:', e);
    }
  }

  notifyListeners();
  return newDs;
}

export async function addRepositoryPublication(pub: Publication): Promise<Publication> {
  const newPub = {
    ...pub,
    id: pub.id || `pub-${Date.now()}`,
    verificationStatus: pub.verificationStatus || 'PENDING_NCPOR_VERIFICATION',
    createdAt: pub.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  publicationsStore = [newPub, ...publicationsStore];
  saveToLocalStorage('publications', publicationsStore);

  if (firebaseConfigured && db) {
    try {
      await createDocument('publications', newPub);
    } catch (e) {
      console.warn('Firestore add publication error:', e);
    }
  }

  notifyListeners();
  return newPub;
}

export async function addRepositoryReport(rep: ResearchReport): Promise<ResearchReport> {
  const newRep = {
    ...rep,
    id: rep.id || `rep-${Date.now()}`,
    verificationStatus: rep.verificationStatus || 'PENDING_NCPOR_VERIFICATION',
    createdAt: rep.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  reportsStore = [newRep, ...reportsStore];
  saveToLocalStorage('reports', reportsStore);

  if (firebaseConfigured && db) {
    try {
      await createDocument('researchReports', newRep);
    } catch (e) {
      console.warn('Firestore add report error:', e);
    }
  }

  notifyListeners();
  return newRep;
}

export async function addRepositoryMedia(med: MediaItem): Promise<MediaItem> {
  const newMed = {
    ...med,
    id: med.id || `media-${Date.now()}`,
    reviewStatus: med.reviewStatus || ('SUBMITTED' as ReviewStatus),
    createdAt: med.createdAt || new Date().toISOString(),
  };
  mediaStore = [newMed, ...mediaStore];
  saveToLocalStorage('media', mediaStore);

  if (firebaseConfigured && db) {
    try {
      await createDocument('media', newMed);
    } catch (e) {
      console.warn('Firestore add media error:', e);
    }
  }

  notifyListeners();
  return newMed;
}

// ── UPDATE / APPROVE STATUS METHODS ────────────────────────────────────

export async function updateVerificationStatus(
  collType: 'dataset' | 'publication' | 'report' | 'media',
  id: string,
  newStatus: 'VERIFIED_BY_NCPOR' | 'PENDING_NCPOR_VERIFICATION' | 'REJECTED' | 'REVISION_REQUESTED',
  comments?: string
): Promise<void> {
  const now = new Date().toISOString();

  if (collType === 'dataset') {
    datasetsStore = datasetsStore.map((d) =>
      d.id === id ? { ...d, verificationStatus: newStatus as any, status: newStatus === 'VERIFIED_BY_NCPOR' ? 'VERIFIED' : d.status, updatedAt: now } : d
    );
    saveToLocalStorage('datasets', datasetsStore);
    if (firebaseConfigured && db) await updateDocumentItem('datasets', id, { verificationStatus: newStatus, status: newStatus === 'VERIFIED_BY_NCPOR' ? 'VERIFIED' : 'PROVISIONAL' });
  } else if (collType === 'publication') {
    publicationsStore = publicationsStore.map((p) =>
      p.id === id ? { ...p, verificationStatus: newStatus as any, updatedAt: now } : p
    );
    saveToLocalStorage('publications', publicationsStore);
    if (firebaseConfigured && db) await updateDocumentItem('publications', id, { verificationStatus: newStatus });
  } else if (collType === 'report') {
    reportsStore = reportsStore.map((r) =>
      r.id === id ? { ...r, verificationStatus: newStatus as any, updatedAt: now } : r
    );
    saveToLocalStorage('reports', reportsStore);
    if (firebaseConfigured && db) await updateDocumentItem('researchReports', id, { verificationStatus: newStatus });
  } else if (collType === 'media') {
    mediaStore = mediaStore.map((m) =>
      m.id === id ? { ...m, reviewStatus: newStatus === 'VERIFIED_BY_NCPOR' ? 'APPROVED' : ('REVISION_REQUESTED' as any) } : m
    );
    saveToLocalStorage('media', mediaStore);
    if (firebaseConfigured && db) await updateDocumentItem('media', id, { reviewStatus: newStatus === 'VERIFIED_BY_NCPOR' ? 'APPROVED' : 'REVISION_REQUESTED' });
  }

  notifyListeners();
}

// ── UTILITY: FILE DOWNLOAD HELPER ────────────────────────────────────────

export function triggerFileDownload(url: string, fileName: string): void {
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.warn('Download fallback trigger:', err);
    window.open(url, '_blank');
  }
}
