import { Router } from 'express';
import { z } from 'zod';
import {
  answerQuestion,
  askThePaper,
  compareItems,
  adaptScienceExplainer,
  generateResearchToMedia,
  askTheDataset,
  askTheMap,
  getDiscoveryRadar,
  getKnowledgeGapAnalytics,
} from '../services/ai.js';
import { optionalAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { getDb } from '../services/firebase.js';
import { extractMetadataFromText } from '../services/metadataExtractor.js';
import { parseDatasetFile } from '../services/datasetParser.js';
import { createReview, getReviews, updateReviewStatus } from '../services/reviewWorkflow.js';
import { getAuditLogs, logAuditEvent } from '../services/auditLogger.js';

const r = Router();
r.use(optionalAuth as any);

const fallbackExpeditions = [
  { id: 'iae46', title: '46th Indian Antarctic Expedition', year: '2026–27', region: 'Antarctica', status: 'Planning' },
  { id: 'iae45', title: '45th Indian Antarctic Expedition', year: '2025–26', region: 'Antarctica', status: 'Completed' },
];

const fallbackDatasets = [
  { id: 'ds-temp', title: 'East Antarctic Surface Temperature Series', category: 'Climate', status: 'VERIFIED' },
  { id: 'ds-ice', title: 'Antarctic Sea-Ice Seasonal Index', category: 'Sea Ice', status: 'VERIFIED' },
];

async function collectionItems(name: string, fallback: unknown[]) {
  const db = getDb();
  if (!db) return fallback;
  try {
    const snapshot = await db.collection(name).orderBy('updatedAt', 'desc').limit(100).get();
    if (snapshot.empty) return fallback;
    return snapshot.docs.map((item: any) => ({ id: item.id, ...item.data() }));
  } catch {
    return fallback;
  }
}

r.get('/health', (_, res) => res.json({ ok: true, service: 'polaris-api' }));

r.get('/expeditions', async (_, res) => res.json({ items: await collectionItems('expeditions', fallbackExpeditions) }));
r.get('/datasets', async (_, res) => res.json({ items: await collectionItems('datasets', fallbackDatasets) }));
r.get('/publications', async (_, res) =>
  res.json({
    items: await collectionItems('publications', [
      { id: 'pub-ice', title: 'Integrated Observations of Antarctic Ice and Atmosphere', year: 2025 },
      { id: 'pub-eco', title: 'Coastal Ecosystem Signals from East Antarctica', year: 2026 },
    ]),
  })
);

r.get('/collections/:collection', async (req, res) => {
  const allowed = [
    'expeditions',
    'datasets',
    'publications',
    'documents',
    'media',
    'researchers',
    'stations',
    'projects',
    'news',
    'events',
    'educationContent',
    'instruments',
    'samples',
  ];
  const coll = String(req.params.collection);
  if (!allowed.includes(coll)) return res.status(404).json({ message: 'Collection not available' });
  res.json({ items: await collectionItems(coll, []) });
});

r.get('/collections/:collection/:id', async (req, res) => {
  const allowed = [
    'expeditions',
    'datasets',
    'publications',
    'documents',
    'media',
    'researchers',
    'stations',
    'projects',
    'news',
    'events',
    'educationContent',
    'instruments',
    'samples',
  ];
  const coll = String(req.params.collection);
  const docId = String(req.params.id);
  if (!allowed.includes(coll)) return res.status(404).json({ message: 'Collection not available' });
  const db = getDb();
  if (db) {
    try {
      const snapshot = await db.collection(coll).doc(docId).get();
      if (snapshot.exists) return res.json({ id: snapshot.id, ...snapshot.data() });
    } catch {
      // Fallback
    }
  }
  res.status(404).json({ message: 'Document not found' });
});

r.get('/search', async (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  const all = [
    ...(await collectionItems('expeditions', fallbackExpeditions)),
    ...(await collectionItems('datasets', fallbackDatasets)),
    ...(await collectionItems('publications', [])),
  ];
  res.json({ items: all.filter((x: any) => String(x.title || '').toLowerCase().includes(q)) });
});

// AI Endpoints
r.post('/ai/ask', async (req, res) => {
  const p = z.object({ question: z.string().min(2).max(2000), targetDocId: z.string().optional() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ message: 'Valid question required' });
  res.json(await answerQuestion(p.data.question, p.data.targetDocId));
});

r.post('/ai/paper', async (req, res) => {
  const p = z.object({ docId: z.string(), action: z.string(), query: z.string().optional() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ message: 'Doc ID and action required' });
  res.json(await askThePaper(p.data.docId, p.data.action, p.data.query));
});

r.post('/ai/compare', async (req, res) => {
  const p = z.object({ type: z.enum(['paper', 'dataset', 'expedition']), itemA: z.string(), itemB: z.string() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ message: 'Comparison items required' });
  res.json(await compareItems(p.data.type, p.data.itemA, p.data.itemB));
});

r.post('/ai/adapt', async (req, res) => {
  const p = z
    .object({ text: z.string().min(10), targetAudience: z.enum(['RESEARCHER', 'UNIVERSITY', 'SCHOOL', 'PUBLIC']) })
    .safeParse(req.body);
  if (!p.success) return res.status(400).json({ message: 'Valid text and audience required' });
  res.json(await adaptScienceExplainer(p.data.text, p.data.targetAudience));
});

r.post('/ai/media', requireRole('MEDIA_MANAGER', 'SCIENTIFIC_REVIEWER', 'PLATFORM_ADMIN') as any, async (req, res) => {
  res.json(await generateResearchToMedia(req.body?.content || 'Antarctic Glaciology findings'));
});

r.post('/ai/dataset', async (req, res) => {
  const p = z.object({ datasetId: z.string(), query: z.string() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ message: 'Dataset ID and query required' });
  res.json(await askTheDataset(p.data.datasetId, p.data.query));
});

r.post('/ai/map', async (req, res) => {
  const p = z.object({ bounds: z.tuple([z.number(), z.number(), z.number(), z.number()]), question: z.string() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ message: 'Valid spatial bounds [lat1, lon1, lat2, lon2] required' });
  res.json(await askTheMap(p.data.bounds, p.data.question));
});

r.get('/ai/radar', async (_, res) => res.json(await getDiscoveryRadar()));
r.get('/ai/gaps', async (_, res) => res.json(await getKnowledgeGapAnalytics()));

// Metadata Extraction
r.post('/extract-metadata', async (req, res) => {
  const p = z.object({ text: z.string().min(10), filename: z.string().optional() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ message: 'Text required for extraction' });
  res.json(extractMetadataFromText(p.data.text, p.data.filename));
});

// Dataset Parser
r.post('/datasets/parse', async (req, res) => {
  const p = z.object({ filename: z.string(), content: z.string() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ message: 'Filename and content required' });
  res.json(parseDatasetFile(p.data.filename, p.data.content));
});

// Scientific Review Workflow
r.get('/reviews', requireRole('SCIENTIFIC_REVIEWER', 'PLATFORM_ADMIN') as any, async (req, res) => {
  const statusFilter = req.query.status as any;
  res.json(await getReviews(statusFilter));
});

r.post('/reviews', requireRole('RESEARCHER', 'PLATFORM_ADMIN') as any, async (req: AuthenticatedRequest, res) => {
  const p = z
    .object({
      entityId: z.string(),
      entityType: z.enum(['document', 'dataset', 'publication', 'media']),
      title: z.string(),
    })
    .safeParse(req.body);
  if (!p.success) return res.status(400).json({ message: 'Invalid payload' });
  const rec = await createReview(
    p.data.entityId,
    p.data.entityType,
    p.data.title,
    req.user?.uid || 'anonymous',
    req.user?.name || 'Researcher'
  );
  await logAuditEvent(req.user?.uid || 'anon', req.user?.email || 'anon', 'SUBMITTED_FOR_REVIEW', p.data.entityType, p.data.entityId);
  res.json(rec);
});

r.post('/reviews/:id/status', requireRole('SCIENTIFIC_REVIEWER', 'PLATFORM_ADMIN') as any, async (req: AuthenticatedRequest, res) => {
  const p = z
    .object({
      status: z.enum(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'REVISION_REQUESTED', 'RESUBMITTED', 'APPROVED', 'PUBLISHED', 'ARCHIVED']),
      commentText: z.string().optional(),
      lineOrSection: z.string().optional(),
    })
    .safeParse(req.body);
  if (!p.success) return res.status(400).json({ message: 'Status required' });
  const targetReviewId = String(req.params.id);
  try {
    const updated = await updateReviewStatus(
      targetReviewId,
      p.data.status,
      req.user?.uid || 'reviewer',
      req.user?.name || 'Reviewer',
      p.data.commentText,
      p.data.lineOrSection
    );
    await logAuditEvent(req.user?.uid || 'reviewer', req.user?.email || 'reviewer', `REVIEW_STATUS_${p.data.status}`, 'review', targetReviewId);
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});

// Audit Logs
r.get('/admin/audit-logs', requireRole('PLATFORM_ADMIN') as any, async (_, res) => {
  res.json(await getAuditLogs());
});

// Role assignment
r.post('/admin/roles', requireRole('PLATFORM_ADMIN') as any, async (req: AuthenticatedRequest, res) => {
  const p = z.object({ uid: z.string(), role: z.enum(['PUBLIC_USER', 'RESEARCHER', 'SCIENTIFIC_REVIEWER', 'MEDIA_MANAGER', 'PLATFORM_ADMIN']) }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ message: 'UID and valid role required' });
  
  const db = getDb();
  if (db) {
    await db.collection('users').doc(p.data.uid).update({ role: p.data.role, updatedAt: new Date().toISOString() });
  }
  await logAuditEvent(req.user?.uid || 'admin', req.user?.email || 'admin', 'CHANGE_USER_ROLE', 'user', p.data.uid, { newRole: p.data.role });
  res.json({ updated: true, uid: p.data.uid, role: p.data.role });
});

export default r;
