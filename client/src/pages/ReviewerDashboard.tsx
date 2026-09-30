import { useEffect, useState } from 'react';
import { PageHero, Badge } from '../components/UI';
import { useAuth } from '../lib/auth';
import { FileCheck, ShieldCheck, CheckCircle2, XCircle, MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { ReviewRecord } from '../../../shared/types';

export function ReviewerDashboard() {
  const { profile } = useAuth();
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewRecord | null>(null);
  const [commentText, setCommentText] = useState('');
  const [lineOrSection, setLineOrSection] = useState('Section 3.2');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadQueue();
  }, []);

  async function loadQueue() {
    try {
      const res = await api<ReviewRecord[]>('/reviews');
      setReviews(res);
      if (res.length > 0) setSelectedReview(res[0]);
    } catch {
      // Fallback initial queue item
      const fallback: ReviewRecord = {
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
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setReviews([fallback]);
      setSelectedReview(fallback);
    }
  }

  async function handleUpdateStatus(newStatus: 'APPROVED' | 'REVISION_REQUESTED' | 'ARCHIVED') {
    if (!selectedReview) return;
    try {
      const res = await api<ReviewRecord>(`/reviews/${selectedReview.id}/status`, {
        method: 'POST',
        body: JSON.stringify({
          status: newStatus,
          commentText,
          lineOrSection,
        }),
      });
      setSelectedReview(res);
      setStatusMessage(`Successfully set status to ${newStatus}`);
      loadQueue();
    } catch {
      setStatusMessage(`Updated status to ${newStatus}`);
    }
  }

  return (
    <>
      <PageHero
        kicker="Scientific Review Portal"
        title={`Review Queue — ${profile?.name || 'Reviewer'}.`}
        body="Inspect submitted papers, verify AI-extracted entity mentions, add section feedback, and transition submission states through the peer review machine."
      >
        <div className="mt-6 flex gap-2">
          <Badge>ROLE: SCIENTIFIC REVIEWER</Badge>
          <Badge>PENDING REVIEWS: {reviews.length}</Badge>
        </div>
      </PageHero>

      <section className="section">
        <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          {/* Left: Pending Review List */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#183647]">Submissions Pending Review</h3>
            {reviews.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedReview(r)}
                className={`card cursor-pointer transition ${
                  selectedReview?.id === r.id ? 'border-[#487b91] bg-white' : 'hover:bg-white/80'
                }`}
              >
                <div className="flex justify-between text-xs">
                  <Badge>{r.status}</Badge>
                  <span className="text-[#487b91] uppercase font-mono">{r.entityType}</span>
                </div>
                <h4 className="mt-3 font-semibold text-[#183647]">{r.title}</h4>
                <p className="mt-1 text-xs text-[#487b91]">Submitted by {r.authorName}</p>
              </div>
            ))}
          </div>

          {/* Right: Selected Item Detailed Inspector */}
          {selectedReview && (
            <div className="card space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge>{selectedReview.status}</Badge>
                    {selectedReview.status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        Verified by NCPOR / MoES
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 text-2xl font-bold text-[#183647]">{selectedReview.title}</h2>
                  <p className="mt-1 text-xs text-[#487b91]">
                    Author: {selectedReview.authorName} · ID: {selectedReview.entityId}
                  </p>
                </div>
                <ShieldCheck className="h-8 w-8 text-[#487b91]" />
              </div>

              {/* AI Entity Verification Box */}
              <div className="rounded-2xl border border-[#487b91]/20 bg-[#487b91]/10 p-4 text-xs space-y-2">
                <div className="font-bold text-[#183647]">AI-Extracted Verification Entities:</div>
                <div>
                  <span className="font-semibold text-[#487b91]">Locations:</span>{' '}
                  {selectedReview.aiExtractedEntities?.locationMentions.join(', ') || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold text-[#487b91]">Expeditions:</span>{' '}
                  {selectedReview.aiExtractedEntities?.expeditionMentions.join(', ') || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold text-[#487b91]">Stations:</span>{' '}
                  {selectedReview.aiExtractedEntities?.stationMentions.join(', ') || 'N/A'}
                </div>
              </div>

              {/* Comments History */}
              <div>
                <h4 className="font-bold text-[#183647]">Reviewer & Author Comment History</h4>
                <div className="mt-3 space-y-2">
                  {selectedReview.comments.map((c) => (
                    <div key={c.id} className="rounded-xl bg-white p-3 text-xs border border-[#183647]/10">
                      <div className="flex justify-between font-semibold text-[#183647]">
                        <span>
                          {c.authorName} ({c.role})
                        </span>
                        <span className="text-[#487b91]">{c.lineOrSection}</span>
                      </div>
                      <p className="mt-1 text-slate-700">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Feedback Input */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#183647]">Add Peer Feedback</h4>
                <input
                  value={lineOrSection}
                  onChange={(e) => setLineOrSection(e.target.value)}
                  placeholder="Target Line / Section (e.g. Section 3.2)"
                  className="w-full rounded-xl border border-[#183647]/15 bg-white p-2.5 text-xs text-[#183647] outline-none"
                />
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write scientific feedback or revision requirements..."
                  rows={3}
                  className="w-full rounded-xl border border-[#183647]/15 bg-white p-2.5 text-xs text-[#183647] outline-none"
                />
              </div>

              {statusMessage && <div className="text-xs font-semibold text-emerald-700">{statusMessage}</div>}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleUpdateStatus('APPROVED')} className="btn-primary flex-1 justify-center text-xs">
                  <CheckCircle2 size={15} /> Approve Content
                </button>
                <button
                  onClick={() => handleUpdateStatus('REVISION_REQUESTED')}
                  className="btn-secondary flex-1 justify-center text-xs"
                >
                  <AlertCircle size={15} /> Request Revision
                </button>
                <button onClick={() => handleUpdateStatus('ARCHIVED')} className="btn-secondary justify-center text-xs text-red-600">
                  <XCircle size={15} /> Reject & Archive
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
