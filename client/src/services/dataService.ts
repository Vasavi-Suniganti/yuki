import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as limitFn,
} from 'firebase/firestore';
import { db, firebaseConfigured } from '../lib/firebase';
import { api } from '../lib/api';

export async function fetchCollection<T>(collName: string, filters?: { category?: string; region?: string; year?: string }, maxLimit = 50): Promise<T[]> {
  if (firebaseConfigured && db) {
    try {
      let q = query(collection(db, collName), limitFn(maxLimit));
      if (filters?.category) q = query(q, where('category', '==', filters.category));
      if (filters?.region) q = query(q, where('region', '==', filters.region));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
      }
    } catch (err) {
      console.warn(`Firestore get ${collName} warning:`, err);
    }
  }

  // Fallback to Express server API endpoint
  try {
    const res = await api<{ items: T[] }>(`/collections/${collName}`);
    if (res.items && res.items.length > 0) return res.items;
  } catch {
    // Return empty array
  }
  return [];
}

export async function fetchDocumentById<T>(collName: string, id: string): Promise<T | null> {
  if (firebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, collName, id));
      if (snap.exists()) return { id: snap.id, ...snap.data() } as T;
    } catch (err) {
      console.warn(`Firestore getDoc ${collName}/${id} warning:`, err);
    }
  }

  try {
    return await api<T>(`/collections/${collName}/${id}`);
  } catch {
    return null;
  }
}

export async function createDocument<T extends { id?: string }>(collName: string, data: T): Promise<T> {
  const docId = data.id || `doc-${Date.now()}`;
  const payload = { ...data, id: docId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

  if (firebaseConfigured && db) {
    try {
      await setDoc(doc(db, collName, docId), payload);
      return payload as T;
    } catch (err) {
      console.warn(`Firestore setDoc error for ${collName}:`, err);
    }
  }

  return payload as T;
}

export async function updateDocumentItem<T>(collName: string, id: string, data: Partial<T>): Promise<void> {
  const payload = { ...data, updatedAt: new Date().toISOString() };
  if (firebaseConfigured && db) {
    try {
      await updateDoc(doc(db, collName, id), payload as any);
    } catch (err) {
      console.warn(`Firestore updateDoc error for ${collName}/${id}:`, err);
    }
  }
}

export async function deleteDocumentItem(collName: string, id: string): Promise<void> {
  if (firebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, collName, id));
    } catch (err) {
      console.warn(`Firestore deleteDoc error for ${collName}/${id}:`, err);
    }
  }
}
