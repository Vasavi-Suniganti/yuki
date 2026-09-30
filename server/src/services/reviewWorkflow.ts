import { getDb } from './firebase.js';
import { ReviewRecord, ReviewStatus, Role } from '../../../shared/types.js';

const mockReviews = new Map<string, ReviewRecord>();

// Seed initial mock reviews for fallback testing
const initialReview: ReviewRecord = {
  id: 'rev-1',
  entityId: 'pub-ice',
  entityType: 'publication',
  title: 'Integrated Observations of Antarctic Ice and Atmosphere',
  authorId: 'demo-researcher',
  authorName: 'Dr. Kavya Rao',
  reviewerId: 'demo-reviewer',
  reviewerName: 'Dr. Reviewer',
  status: 'UNDER_REVIEW',
  comments: [
    {
      id: 'c1',
      authorId: 'demo-reviewer',
      authorName: 'Dr. Reviewer',
      role: 'SCIENTIFIC_REVIEWER',
      text: 'Please clarify temperature anomaly calibration methods in Section 3.2.',
      createdAt: new Date().toISOString(),
      lineOrSection: 'Section 3.2',
    },
  ],
  aiExtractedEntities: {
    locationMentions: ['East Antarctica', 'Maitri Station', 'Bharati Station'],
    expeditionMentions: ['45th Indian Antarctic Expedition'],
    stationMentions: ['Bharati', 'Maitri'],
    keywords: ['Glaciology', 'Atmosphere', 'Surface Mass Balance'],
  },
  submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  updatedAt: new Date().toISOString(),
};

mockReviews.set(initialReview.id, initialReview);

export async function createReview(
  entityId: string,
  entityType: 'document' | 'dataset' | 'publication' | 'media',
  title: string,
  authorId: string,
  authorName: string
): Promise<ReviewRecord> {
  const id = `rev-${Date.now()}`;
  const record: ReviewRecord = {
    id,
    entityId,
    entityType,
    title,
    authorId,
    authorName,
    status: 'SUBMITTED',
    comments: [],
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const db = getDb();
  if (db) {
    try {
      await db.collection('reviews').doc(id).set(record);
      // Trigger notification for reviewers
      await db.collection('notifications').add({
        userId: 'all-reviewers',
        type: 'submission',
        title: 'New Scientific Review Submission',
        message: `New ${entityType} "${title}" submitted by ${authorName}.`,
        targetUrl: `/reviewer`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore set review error:', e);
    }
  }

  mockReviews.set(id, record);
  return record;
}

export async function getReviews(statusFilter?: ReviewStatus): Promise<ReviewRecord[]> {
  const db = getDb();
  if (db) {
    try {
      let ref = db.collection('reviews');
      if (statusFilter) {
        ref = ref.where('status', '==', statusFilter);
      }
      const snap = await ref.orderBy('updatedAt', 'desc').get();
      if (!snap.empty) {
        return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore get reviews error:', e);
    }
  }

  let list = Array.from(mockReviews.values());
  if (statusFilter) {
    list = list.filter((r) => r.status === statusFilter);
  }
  return list;
}

export async function updateReviewStatus(
  reviewId: string,
  nextStatus: ReviewStatus,
  reviewerId: string,
  reviewerName: string,
  commentText?: string,
  lineOrSection?: string
): Promise<ReviewRecord> {
  const db = getDb();
  let existing: ReviewRecord | undefined;

  if (db) {
    try {
      const snap = await db.collection('reviews').doc(reviewId).get();
      if (snap.exists) existing = { id: snap.id, ...snap.data() } as ReviewRecord;
    } catch (e) {
      console.warn('Firestore fetch review warning:', e);
    }
  }

  if (!existing) {
    existing = mockReviews.get(reviewId);
  }

  if (!existing) {
    throw new Error('Review record not found');
  }

  existing.status = nextStatus;
  existing.reviewerId = reviewerId;
  existing.reviewerName = reviewerName;
  existing.updatedAt = new Date().toISOString();

  if (commentText) {
    existing.comments.push({
      id: `c-${Date.now()}`,
      authorId: reviewerId,
      authorName: reviewerName,
      role: 'SCIENTIFIC_REVIEWER',
      text: commentText,
      createdAt: new Date().toISOString(),
      lineOrSection,
    });
  }

  if (db) {
    try {
      await db.collection('reviews').doc(reviewId).set(existing);
      // Create notification for researcher
      await db.collection('notifications').add({
        userId: existing.authorId,
        type: nextStatus === 'APPROVED' ? 'approval' : nextStatus === 'REVISION_REQUESTED' ? 'revision' : 'submission',
        title: `Submission status: ${nextStatus.replaceAll('_', ' ')}`,
        message: `Your ${existing.entityType} "${existing.title}" is now ${nextStatus.replaceAll('_', ' ').toLowerCase()}.`,
        targetUrl: `/dashboard`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore update review error:', e);
    }
  }

  mockReviews.set(reviewId, existing);
  return existing;
}
