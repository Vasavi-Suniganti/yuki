import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, QueryConstraint, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';

export async function listDocuments<T>(collectionName: string, constraints: QueryConstraint[] = [], maxItems = 50): Promise<T[]> {
  if (!db) return [];
  const snapshot = await getDocs(query(collection(db, collectionName), ...constraints, orderBy('updatedAt', 'desc'), limit(maxItems)));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() } as T));
}

export async function getDocument<T>(collectionName: string, id: string): Promise<T | null> {
  if (!db) return null;
  const snapshot = await getDoc(doc(db, collectionName, id));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
}

export async function createDocument<T extends Record<string, unknown>>(collectionName: string, data: T): Promise<string> {
  if (!db) throw new Error('Firebase is not configured');
  const now = new Date().toISOString();
  const snapshot = await addDoc(collection(db, collectionName), { ...data, createdAt: now, updatedAt: now });
  return snapshot.id;
}

export async function saveDocument<T extends Record<string, unknown>>(collectionName: string, id: string, data: T): Promise<void> {
  if (!db) throw new Error('Firebase is not configured');
  await setDoc(doc(db, collectionName, id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function uploadDocument(file: File, path: string): Promise<string> {
  if (!storage) throw new Error('Firebase Storage is not configured');
  const snapshot = await uploadBytes(ref(storage, path), file, { contentType: file.type });
  return getDownloadURL(snapshot.ref);
}