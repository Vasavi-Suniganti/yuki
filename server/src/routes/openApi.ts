import { Router, Request, Response } from 'express';
import { getDb } from '../services/firebase.js';

const router = Router();

// In-memory fallback data for Open Data API
const openDataExpeditions = [
  { id: 'iae46', title: '46th Indian Antarctic Expedition', year: '2026–27', region: 'Antarctica', status: 'Planning', leader: 'Dr. A. Menon' },
  { id: 'iae45', title: '45th Indian Antarctic Expedition', year: '2025–26', region: 'Antarctica', status: 'Completed', leader: 'Dr. S. Iyer' },
  { id: 'arctic24', title: 'Arctic Research Campaign 2024', year: '2024', region: 'Arctic', status: 'Completed', leader: 'Dr. R. Banerjee' },
];

const openDataDatasets = [
  { id: 'ds-temp', title: 'East Antarctic Surface Temperature Series', category: 'Climate', region: 'East Antarctica', format: 'CSV', status: 'VERIFIED' },
  { id: 'ds-ice', title: 'Antarctic Sea-Ice Seasonal Index', category: 'Sea Ice', region: 'Southern Ocean', format: 'GeoJSON', status: 'VERIFIED' },
];

const openDataPublications = [
  { id: 'pub-ice', title: 'Integrated Observations of Antarctic Ice and Atmosphere', authors: ['Dr. Kavya Rao', 'Dr. R. Singh'], year: 2025, doi: '10.0000/demo.ice.2025' },
  { id: 'pub-eco', title: 'Coastal Ecosystem Signals from East Antarctica', authors: ['Dr. N. Das', 'Dr. P. Shah'], year: 2026, doi: '10.0000/demo.eco.2026' },
];

const openDataStations = [
  { id: 'maitri', name: 'Maitri Station', region: 'Antarctica', coordinates: [11.73, -70.77], establishedYear: 1989 },
  { id: 'bharati', name: 'Bharati Station', region: 'Antarctica', coordinates: [76.19, -69.41], establishedYear: 2012 },
  { id: 'himadri', name: 'Himadri Station', region: 'Arctic', coordinates: [11.93, 78.91], establishedYear: 2008 },
];

async function queryCollection(collName: string, fallback: any[], req: Request) {
  const page = parseInt(String(req.query.page || '1'), 10);
  const limit = parseInt(String(req.query.limit || '10'), 10);
  const category = String(req.query.category || '');
  const region = String(req.query.region || '');
  const year = String(req.query.year || '');

  const db = getDb();
  if (db) {
    try {
      let ref: any = db.collection(collName);
      if (category) ref = ref.where('category', '==', category);
      if (region) ref = ref.where('region', '==', region);
      if (year) ref = ref.where('year', '==', year);

      const snap = await ref.limit(limit).get();
      if (!snap.empty) {
        const items = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
        return { page, limit, total: items.length, items };
      }
    } catch (e) {
      console.warn(`Open Data API query error for ${collName}:`, e);
    }
  }

  let items = [...fallback];
  if (category) items = items.filter((x) => x.category === category);
  if (region) items = items.filter((x) => x.region === region);
  if (year) items = items.filter((x) => String(x.year) === year);

  return {
    page,
    limit,
    total: items.length,
    items: items.slice((page - 1) * limit, page * limit),
  };
}

router.get('/expeditions', async (req: Request, res: Response) => {
  res.json(await queryCollection('expeditions', openDataExpeditions, req));
});

router.get('/datasets', async (req: Request, res: Response) => {
  res.json(await queryCollection('datasets', openDataDatasets, req));
});

router.get('/datasets/:id', async (req: Request, res: Response) => {
  const targetId = String(req.params.id);
  const ds = openDataDatasets.find((d) => d.id === targetId) || openDataDatasets[0];
  res.json({ ...ds, id: targetId });
});

router.get('/publications', async (req: Request, res: Response) => {
  res.json(await queryCollection('publications', openDataPublications, req));
});

router.get('/stations', async (req: Request, res: Response) => {
  res.json(await queryCollection('stations', openDataStations, req));
});

router.get('/researchers', async (_req: Request, res: Response) => {
  res.json({
    total: 3,
    items: [
      { id: 'res-1', name: 'Dr. Kavya Rao', institution: 'NCPOR', specialization: 'Glaciology' },
      { id: 'res-2', name: 'Dr. S. Iyer', institution: 'NCPOR', specialization: 'Sea Ice Dynamics' },
      { id: 'res-3', name: 'Dr. R. Banerjee', institution: 'IIT Bombay', specialization: 'Permafrost' },
    ],
  });
});

router.get('/media', async (_req: Request, res: Response) => {
  res.json({
    total: 2,
    items: [
      { id: 'media-1', title: 'Ice Ridge Fieldwork', type: 'Photo', expedition: '46th IAE' },
      { id: 'media-2', title: 'Bharati Station Dawn', type: 'Photo', expedition: '45th IAE' },
    ],
  });
});

export default router;
