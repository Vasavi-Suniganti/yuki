import { db, firebaseConfigured } from './firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export interface ShelfItem {
  id: string;
  itemId: string;
  type: 'expedition' | 'publication' | 'report' | 'media' | 'lesson' | 'story' | 'scientist' | 'dataset';
  title: string;
  subtitle?: string;
  url?: string;
  collectionName?: string;
  savedAt: string;
}

export interface ShelfCollection {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface WorkspaceItem {
  id: string;
  itemId: string;
  type: 'expedition' | 'dataset' | 'publication' | 'report' | 'media' | 'researcher';
  title: string;
  subtitle?: string;
  region?: string;
  category?: string;
  addedAt: string;
}

export interface WatchedItem {
  id: string;
  itemId: string;
  type: 'expedition' | 'pending_verification' | 'repository_issue' | 'outreach' | 'research_activity';
  title: string;
  status: string;
  urgency: 'high' | 'medium' | 'normal';
  watchedAt: string;
}

export interface StoryForgeItem {
  id: string;
  sourceId: string;
  sourceType: 'publication' | 'dataset' | 'report' | 'expedition';
  sourceTitle: string;
  sourceAuthorOrDoi?: string;
  format: 'article' | 'instagram' | 'linkedin' | 'videoscript' | 'infographic' | 'student' | 'press' | 'quiz';
  title: string;
  content: string;
  createdAt: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
}

const STORAGE_KEYS = {
  SHELF: 'polaris_shelf_items',
  COLLECTIONS: 'polaris_shelf_collections',
  RECENTLY_VIEWED: 'polaris_recently_viewed',
  WORKSPACE: 'polaris_workspace_items',
  WATCH: 'polaris_watched_items',
  STORIES: 'polaris_story_forge_items',
};

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeSignatureFeatures(callback: Listener): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notify() {
  listeners.forEach((cb) => cb());
}

function getKey(baseKey: string, uid?: string): string {
  return uid ? `${baseKey}_${uid}` : `${baseKey}_guest`;
}

function loadLocal<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage read error for', key, e);
  }
  return fallback;
}

function saveLocal<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage write error for', key, e);
  }
}

async function syncFirestore(uid: string | undefined, field: string, data: any) {
  if (!uid || !firebaseConfigured || !db) return;
  try {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, { [field]: data, updatedAt: new Date().toISOString() });
  } catch (e) {
    console.warn('Firestore sync warning for field', field, e);
  }
}

// ── 1. MY POLAR SHELF ────────────────────────────────────────────────────────

export function getShelfItems(uid?: string): ShelfItem[] {
  const key = getKey(STORAGE_KEYS.SHELF, uid);
  return loadLocal<ShelfItem>(key, [
    {
      id: 'shelf-1',
      itemId: 'iae44',
      type: 'expedition',
      title: '44th Indian Scientific Expedition to Antarctica',
      subtitle: 'Bharati & Maitri Station Climate Monitoring',
      url: '/expeditions/iae44',
      collectionName: 'Climate Research',
      savedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'shelf-2',
      itemId: 'pub-ice',
      type: 'publication',
      title: 'Decadal Glaciological Mass Balance of Coastal East Antarctica',
      subtitle: 'Journal of Geophysical Research (2024)',
      url: '/publications/pub-ice',
      collectionName: 'Climate Research',
      savedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'shelf-3',
      itemId: 'media-1',
      type: 'media',
      title: 'Bharati Station Atmospheric Lidar Operations',
      subtitle: 'High-Altitude Cloud Observations Photo',
      url: '/media',
      collectionName: 'For My Project',
      savedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);
}

export function saveToShelf(uid: string | undefined, item: Omit<ShelfItem, 'id' | 'savedAt'>): ShelfItem {
  const items = getShelfItems(uid);
  const existing = items.find((i) => i.itemId === item.itemId);
  if (existing) return existing;

  const newItem: ShelfItem = {
    ...item,
    id: `shelf-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    savedAt: new Date().toISOString(),
  };

  const updated = [newItem, ...items];
  const key = getKey(STORAGE_KEYS.SHELF, uid);
  saveLocal(key, updated);
  syncFirestore(uid, 'savedShelfItems', updated);
  notify();
  return newItem;
}

export function removeFromShelf(uid: string | undefined, itemId: string): void {
  const items = getShelfItems(uid);
  const updated = items.filter((i) => i.itemId !== itemId && i.id !== itemId);
  const key = getKey(STORAGE_KEYS.SHELF, uid);
  saveLocal(key, updated);
  syncFirestore(uid, 'savedShelfItems', updated);
  notify();
}

export function isItemInShelf(uid: string | undefined, itemId: string): boolean {
  const items = getShelfItems(uid);
  return items.some((i) => i.itemId === itemId || i.id === itemId);
}

export function getShelfCollections(uid?: string): ShelfCollection[] {
  const key = getKey(STORAGE_KEYS.COLLECTIONS, uid);
  return loadLocal<ShelfCollection>(key, [
    { id: 'col-1', name: 'Climate Research', description: 'Antarctic temperature & ice sheet mass balance studies', createdAt: new Date().toISOString() },
    { id: 'col-2', name: 'For My Project', description: 'Resources gathered for polar science seminar presentation', createdAt: new Date().toISOString() },
    { id: 'col-3', name: 'Monsoon Teleconnections', description: 'Oceanography & Southern Ocean monsoon link papers', createdAt: new Date().toISOString() },
  ]);
}

export function createShelfCollection(uid: string | undefined, name: string, description?: string): ShelfCollection {
  const cols = getShelfCollections(uid);
  const newCol: ShelfCollection = {
    id: `col-${Date.now()}`,
    name,
    description: description || 'Custom user collection',
    createdAt: new Date().toISOString(),
  };
  const updated = [...cols, newCol];
  const key = getKey(STORAGE_KEYS.COLLECTIONS, uid);
  saveLocal(key, updated);
  syncFirestore(uid, 'shelfCollections', updated);
  notify();
  return newCol;
}

export function assignItemToCollection(uid: string | undefined, itemId: string, collectionName: string): void {
  const items = getShelfItems(uid);
  const updated = items.map((i) => (i.itemId === itemId || i.id === itemId ? { ...i, collectionName } : i));
  const key = getKey(STORAGE_KEYS.SHELF, uid);
  saveLocal(key, updated);
  syncFirestore(uid, 'savedShelfItems', updated);
  notify();
}

export function getRecentlyViewed(uid?: string): ShelfItem[] {
  const key = getKey(STORAGE_KEYS.RECENTLY_VIEWED, uid);
  return loadLocal<ShelfItem>(key, [
    { id: 'rec-1', itemId: 'ds-temp', type: 'dataset', title: 'East Antarctic Surface Temperature Telemetry', subtitle: 'Hourly meteorological data from Maitri', savedAt: new Date().toISOString() },
    { id: 'rec-2', itemId: 'iae45', type: 'expedition', title: '45th Expedition Pre-Deployment Operations', subtitle: 'Agulhas II Vessel Route Planning', savedAt: new Date(Date.now() - 3600000).toISOString() },
  ]);
}

export function addRecentlyViewed(uid: string | undefined, item: Omit<ShelfItem, 'id' | 'savedAt'>): void {
  const current = getRecentlyViewed(uid);
  const filtered = current.filter((i) => i.itemId !== item.itemId);
  const newItem: ShelfItem = {
    ...item,
    id: `rec-${Date.now()}`,
    savedAt: new Date().toISOString(),
  };
  const updated = [newItem, ...filtered].slice(0, 10);
  const key = getKey(STORAGE_KEYS.RECENTLY_VIEWED, uid);
  saveLocal(key, updated);
  notify();
}

// ── 2. RESEARCH WORKSPACE ────────────────────────────────────────────────────

export function getWorkspaceItems(uid?: string): WorkspaceItem[] {
  const key = getKey(STORAGE_KEYS.WORKSPACE, uid);
  return loadLocal<WorkspaceItem>(key, [
    {
      id: 'ws-1',
      itemId: 'ds-temp',
      type: 'dataset',
      title: 'East Antarctic Temperature Series v2.1',
      subtitle: 'Maitri & Bharati Automatic Weather Stations',
      region: 'Antarctica',
      category: 'Meteorology',
      addedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'ws-2',
      itemId: 'pub-ice',
      type: 'publication',
      title: 'Decadal Glaciological Mass Balance of Coastal East Antarctica',
      subtitle: 'Dr. Kavya Rao et al.',
      region: 'Antarctica',
      category: 'Glaciology',
      addedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'ws-3',
      itemId: 'iae44',
      type: 'expedition',
      title: '44th Indian Scientific Expedition to Antarctica',
      subtitle: 'Field operations & deep ice core extraction',
      region: 'Antarctica',
      category: 'Expedition',
      addedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'ws-4',
      itemId: 'res-1',
      type: 'researcher',
      title: 'Dr. Kavya Rao',
      subtitle: 'Senior Glaciologist - NCPOR',
      region: 'Antarctica',
      category: 'Lead Scientist',
      addedAt: new Date().toISOString(),
    },
  ]);
}

export function addToWorkspace(uid: string | undefined, item: Omit<WorkspaceItem, 'id' | 'addedAt'>): WorkspaceItem {
  const items = getWorkspaceItems(uid);
  const existing = items.find((i) => i.itemId === item.itemId);
  if (existing) return existing;

  const newItem: WorkspaceItem = {
    ...item,
    id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    addedAt: new Date().toISOString(),
  };

  const updated = [newItem, ...items];
  const key = getKey(STORAGE_KEYS.WORKSPACE, uid);
  saveLocal(key, updated);
  syncFirestore(uid, 'workspaceItems', updated);
  notify();
  return newItem;
}

export function removeFromWorkspace(uid: string | undefined, itemId: string): void {
  const items = getWorkspaceItems(uid);
  const updated = items.filter((i) => i.itemId !== itemId && i.id !== itemId);
  const key = getKey(STORAGE_KEYS.WORKSPACE, uid);
  saveLocal(key, updated);
  syncFirestore(uid, 'workspaceItems', updated);
  notify();
}

export function isItemInWorkspace(uid: string | undefined, itemId: string): boolean {
  const items = getWorkspaceItems(uid);
  return items.some((i) => i.itemId === itemId || i.id === itemId);
}

// ── 3. NATIONAL POLAR WATCH ──────────────────────────────────────────────────

export function getWatchedItems(uid?: string): WatchedItem[] {
  const key = getKey(STORAGE_KEYS.WATCH, uid);
  return loadLocal<WatchedItem>(key, [
    {
      id: 'watch-1',
      itemId: 'iae45',
      type: 'expedition',
      title: '45th Indian Antarctic Expedition Pre-Deployment',
      status: 'PLANNING_PRE_DEPLOYMENT',
      urgency: 'high',
      watchedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'watch-2',
      itemId: 'ds-micro-01',
      type: 'pending_verification',
      title: 'Sub-glacial Lake Sub-surface Salinity Series',
      status: 'PENDING_NCPOR_VERIFICATION',
      urgency: 'high',
      watchedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'watch-3',
      itemId: 'issue-rep-99',
      type: 'repository_issue',
      title: 'Bharati Lidar Raw Data Metadata Scheme Revision',
      status: 'UNDER_REVIEW',
      urgency: 'medium',
      watchedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);
}

export function addToWatch(uid: string | undefined, item: Omit<WatchedItem, 'id' | 'watchedAt'>): WatchedItem {
  const items = getWatchedItems(uid);
  const existing = items.find((i) => i.itemId === item.itemId);
  if (existing) return existing;

  const newItem: WatchedItem = {
    ...item,
    id: `watch-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    watchedAt: new Date().toISOString(),
  };

  const updated = [newItem, ...items];
  const key = getKey(STORAGE_KEYS.WATCH, uid);
  saveLocal(key, updated);
  syncFirestore(uid, 'watchedItems', updated);
  notify();
  return newItem;
}

export function removeFromWatch(uid: string | undefined, itemId: string): void {
  const items = getWatchedItems(uid);
  const updated = items.filter((i) => i.itemId !== itemId && i.id !== itemId);
  const key = getKey(STORAGE_KEYS.WATCH, uid);
  saveLocal(key, updated);
  syncFirestore(uid, 'watchedItems', updated);
  notify();
}

export function isItemWatched(uid: string | undefined, itemId: string): boolean {
  const items = getWatchedItems(uid);
  return items.some((i) => i.itemId === itemId || i.id === itemId);
}

// ── 4. STORY FORGE (MEDIA & OUTREACH) ─────────────────────────────────────────

export function getStoryForgeItems(uid?: string): StoryForgeItem[] {
  const key = getKey(STORAGE_KEYS.STORIES, uid);
  return loadLocal<StoryForgeItem>(key, [
    {
      id: 'story-1',
      sourceId: 'pub-ice',
      sourceType: 'publication',
      sourceTitle: 'Decadal Glaciological Mass Balance of Coastal East Antarctica',
      sourceAuthorOrDoi: '10.1029/2024GL012345',
      format: 'article',
      title: 'Unlocking 10,000 Years of Climate History in East Antarctic Ice',
      content: 'Indian glaciologists at Bharati Station extracted ice cores preserving ancient atmosphere samples revealing global greenhouse gas variations over millennia.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'PUBLISHED',
    },
    {
      id: 'story-2',
      sourceId: 'ds-temp',
      sourceType: 'dataset',
      sourceTitle: 'East Antarctic Temperature Series v2.1',
      sourceAuthorOrDoi: 'NCPOR Met Telemetry',
      format: 'instagram',
      title: '❄️ How Cold Does It Get at Bharati Station?',
      content: 'Did you know? Temperatures drop below -40°C in polar winter. Sensors continuously record atmospheric pressure and wind vectors transmitted to NCPOR Goa.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'DRAFT',
    },
  ]);
}

export function saveStoryForgeItem(uid: string | undefined, item: Omit<StoryForgeItem, 'id' | 'createdAt'>): StoryForgeItem {
  const items = getStoryForgeItems(uid);
  const newItem: StoryForgeItem = {
    ...item,
    id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newItem, ...items];
  const key = getKey(STORAGE_KEYS.STORIES, uid);
  saveLocal(key, updated);
  syncFirestore(uid, 'storyForgeItems', updated);
  notify();
  return newItem;
}

export function deleteStoryForgeItem(uid: string | undefined, id: string): void {
  const items = getStoryForgeItems(uid);
  const updated = items.filter((i) => i.id !== id);
  const key = getKey(STORAGE_KEYS.STORIES, uid);
  saveLocal(key, updated);
  syncFirestore(uid, 'storyForgeItems', updated);
  notify();
}
