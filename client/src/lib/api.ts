import { auth } from './firebase';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export async function api<T>(path:string, init?:RequestInit):Promise<T>{
  const token = auth ? await auth.currentUser?.getIdToken() : undefined;
  const res = await fetch(`${API}${path}`, { ...init, headers:{'Content-Type':'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(init?.headers||{})} });
  if(!res.ok) throw new Error((await res.json().catch(()=>({message:res.statusText}))).message || 'Request failed');
  return res.json();
}
