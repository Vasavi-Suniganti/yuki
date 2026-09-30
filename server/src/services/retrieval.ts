import { getDb } from './firebase.js';

export interface GroundedChunk {
  documentId: string;
  title: string;
  page: number;
  section: string;
  excerpt: string;
  category?: string;
  score: number;
  doi?: string;
  year?: number;
}

const fallbackChunks: GroundedChunk[] = [
  {
    documentId: 'pub-ice',
    title: 'Integrated Observations of Antarctic Ice and Atmosphere',
    page: 12,
    section: '3.1 Cryosphere-Atmosphere Interactions',
    excerpt: 'Continuous multi-year surface temperature and surface mass balance observations at Maitri and Bharati stations show clear seasonal anomalies linked to Southern Annular Mode phase shifts.',
    category: 'Glaciology',
    score: 0.92,
    doi: '10.0000/demo.ice.2025',
    year: 2025,
  },
  {
    documentId: 'pub-eco',
    title: 'Coastal Ecosystem Signals from East Antarctica',
    page: 8,
    section: '2.4 Benthic Sampling & Micro-organism Shifts',
    excerpt: 'Coastal oceanographic transects reveal significant seasonal variation in phytoplankton bloom timing along Prydz Bay, correlating with fast-ice break-up chronology.',
    category: 'Biology',
    score: 0.85,
    doi: '10.0000/demo.eco.2026',
    year: 2026,
  },
  {
    documentId: 'pub-arctic',
    title: 'Permafrost and Fjord Change in Svalbard',
    page: 24,
    section: '4.2 Active-Layer Thermal Profiling',
    excerpt: 'Active-layer thermal monitoring around Ny-Ålesund and Kongsfjorden indicates deepening thaw zones during mid-summer months, increasing coastal sediment run-off.',
    category: 'Permafrost',
    score: 0.88,
    doi: '10.0000/demo.arctic.2024',
    year: 2024,
  },
  {
    documentId: 'pub-ocean',
    title: 'Upper-Ocean Heat Storage in the Southern Ocean',
    page: 15,
    section: '5.1 Mixed Layer Heat Content',
    excerpt: 'XBT transects across 45°S to 65°S capture upward trend in heat content within the Antarctic Intermediate Water layer over 2005–2025 observations.',
    category: 'Oceanography',
    score: 0.81,
    doi: '10.0000/demo.ocean.2023',
    year: 2023,
  },
];

export async function retrieveSemanticChunks(query: string, documentIdFilter?: string): Promise<GroundedChunk[]> {
  const terms = query.toLowerCase().split(/\W+/).filter((x) => x.length > 2);
  const db = getDb();

  if (db) {
    try {
      let ref = db.collection('documentChunks');
      if (documentIdFilter) {
        ref = ref.where('documentId', '==', documentIdFilter);
      }
      const snap = await ref.get();
      if (!snap.empty) {
        const results: GroundedChunk[] = [];
        snap.forEach((doc: any) => {
          const data = doc.data();
          const text = (data.text || '').toLowerCase();
          const title = (data.documentTitle || '').toLowerCase();
          let score = 0;
          terms.forEach((t) => {
            if (text.includes(t)) score += 2;
            if (title.includes(t)) score += 3;
          });
          if (score > 0 || documentIdFilter) {
            results.push({
              documentId: data.documentId || doc.id,
              title: data.documentTitle || 'Polar Repository Document',
              page: data.pageNumber || 1,
              section: data.section || 'General',
              excerpt: data.text || '',
              category: data.category || 'Science',
              score: Math.min(1.0, score / 10),
            });
          }
        });
        if (results.length > 0) {
          return results.sort((a, b) => b.score - a.score).slice(0, 5);
        }
      }
    } catch (e) {
      console.warn('Firestore documentChunks query warning:', e);
    }
  }

  // Fallback heuristic scoring over fallback chunks
  let filtered = fallbackChunks;
  if (documentIdFilter) {
    filtered = fallbackChunks.filter((c) => c.documentId === documentIdFilter);
  }

  const scored = filtered.map((chunk) => {
    const full = `${chunk.title} ${chunk.section} ${chunk.excerpt}`.toLowerCase();
    const hits = terms.reduce((n, term) => n + (full.includes(term) ? 1 : 0), 0);
    return { ...chunk, score: documentIdFilter ? 0.95 : Math.min(0.98, (hits + 1) / (terms.length + 1)) };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 4);
}
