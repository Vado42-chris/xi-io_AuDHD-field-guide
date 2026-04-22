import React, { useMemo, useState } from 'react';
import GuidedActionPanel from '../patterns/GuidedActionPanel';
import { RecommendationLedgerItem, RevalidationResult, TransferDecision } from '../../types/core';

interface RecommendationLedgerCardProps {
  item: RecommendationLedgerItem;
  onReviewTransfer: (recommendationId: string, transferSafety: RecommendationLedgerItem['transferSafety'], transferWarning: string | undefined, decision: TransferDecision, reason: string) => void;
  onRevalidateSupport: (recommendationId: string, result: RevalidationResult, note: string) => void;
}

const formatRelativeTime = (timestamp?: number) => {
  if (!timestamp) return 'Not checked yet';
  const diffMs = Date.now() - timestamp;
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months <= 1) return '1 month ago';
  return `${months} months ago`;
};

const buildRecheckImpact = (item: RecommendationLedgerItem) => {
  const latest = item.revalidationHistory[0];
  if (!latest) return 'No fresh check recorded yet.';
  if (latest.result === 'still_helps') return `Freshly rechecked ${formatRelativeTime(latest.createdAt).toLowerCase()}, this strengthened the lane.`;
  if (latest.result === 'helps_a_little') return `Freshly rechecked ${formatRelativeTime(latest.createdAt).toLowerCase()}, this gave the lane a smaller boost.`;
  return `Freshly rechecked ${formatRelativeTime(latest.createdAt).toLowerCase()}, this weakened the lane.`;
};

export const RecommendationLedgerCard: React.FC<RecommendationLedgerCardProps> = ({ item, onReviewTransfer, onRevalidateSupport }) => {
  const [reason, setReason] = useState('');
  const [recheckNote, setRecheckNote] = useState('');
  const lastConfirmedLabel = useMemo(() => formatRelativeTime(item.lastUsedAt), [item.lastUsedAt]);
  const recheckImpact = useMemo(() => buildRecheckImpact(item), [item]);

  return (
    <section className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">Why this suggestion</div>
      <h2 className="fg-card-title">{item.title}</h2>
      <div className="fg-help-meta" style={{ marginTop: 12 }}>
        <div className="fg-meta-pill fg-glass">Confidence: {item.status.confidence}</div>
        <div className="fg-meta-pill fg-glass">Current status: {item.status.availability.replace('_', ' ')}</div>
        <div className="fg-meta-pill fg-glass">Trust stage: {item.status.trustMaturity.replace(/_/g, ' ')}</div>
        <div className="fg-meta-pill fg-glass">Freshness: {item.status.trustFreshness.replace(/_/g, ' ')}</div>
        <div className="fg-meta-pill fg-glass">Last confirmed: {lastConfirmedLabel}</div>
        <div className="fg-meta-pill fg-glass">Transfer warning: {item.transferSafety}</div>
      </div>
      <p className="fg-card-copy" style={{ marginTop: 12 }}>{item.appearedBecause}</p>
      <p className="fg-card-copy">{item.reason}</p>
      <p className="fg-card-copy">Priority right now: {item.status.priorityReason}</p>
      <p className="fg-card-copy">Trust mix: {item.trustSummary}.</p>
      <p className="fg-card-copy">{item.maturitySummary}</p>
      <p className="fg-card-copy">{item.freshnessSummary}</p>
      <p className="fg-card-copy">{recheckImpact}</p>
      {item.status.trustFreshness !== 'fresh' ? (
        <GuidedActionPanel
          kicker="Fresh check"
          body="Try this again and tell the app if it still helps."
          textareaValue={recheckNote}
          textareaPlaceholder="what happened when you tried it again?"
          onTextareaChange={setRecheckNote}
          actions={[
            { label: 'Still helps', onClick: () => onRevalidateSupport(item.id, 'still_helps', recheckNote.trim()) },
            { label: 'Helps a little', onClick: () => onRevalidateSupport(item.id, 'helps_a_little', recheckNote.trim()) },
            { label: 'No longer helps', onClick: () => onRevalidateSupport(item.id, 'no_longer_helps', recheckNote.trim()) },
          ]}
        />
      ) : null}
      {item.revalidationHistory.length > 0 ? (
        <div className="fg-panel-stack">
          <div className="fg-kicker">Freshness timeline</div>
          {item.revalidationHistory.map((record) => (
            <div key={record.id} className="fg-card-copy">• {formatRelativeTime(record.createdAt)}, {record.result.replace(/_/g, ' ')}</div>
          ))}
        </div>
      ) : null}
      {item.transferWarning ? <p className="fg-card-copy">{item.transferWarning}</p> : null}
      {item.transferSafety !== 'safe' ? (
        <GuidedActionPanel
          kicker="Transfer review"
          body="If you still want to try this here, record that choice so the app can learn from what happens next."
          textareaValue={reason}
          textareaPlaceholder="why are you choosing to try or reject this here?"
          onTextareaChange={setReason}
          actions={[
            { label: 'Try it anyway', onClick: () => onReviewTransfer(item.id, item.transferSafety, item.transferWarning, 'approved', reason.trim()) },
            { label: 'Skip it here', onClick: () => onReviewTransfer(item.id, item.transferSafety, item.transferWarning, 'rejected', reason.trim()) },
          ]}
        />
      ) : null}
      {item.transferReviews.length > 0 ? (
        <div className="fg-panel-stack">
          <div className="fg-kicker">Past transfer decisions</div>
          {item.transferReviews.map((review) => (
            <div key={review.id} className="fg-card-copy">• {new Date(review.createdAt).toLocaleString()}, {review.decision}, outcome {review.outcomeAssessment.replace('_', ' ')}</div>
          ))}
        </div>
      ) : null}
      <div className="fg-panel-stack" style={{ marginTop: 14 }}>
        <div>
          <div className="fg-kicker">What is backing this</div>
          {item.supportingEvidence.length > 0 ? item.supportingEvidence.map((ref) => (
            <div key={ref.id} className="fg-card-copy">• {ref.title}, {ref.detail}</div>
          )) : <div className="fg-card-copy">No strong supporting evidence is attached yet.</div>}
        </div>
        <div>
          <div className="fg-kicker">What is weakening this</div>
          {item.weakeningEvidence.length > 0 ? item.weakeningEvidence.map((ref) => (
            <div key={ref.id} className="fg-card-copy">• {ref.title}, {ref.detail}</div>
          )) : <div className="fg-card-copy">No active weakening evidence is attached right now.</div>}
        </div>
        <div>
          <div className="fg-kicker">What happened in this same state</div>
          {item.outcomeHistory.length > 0 ? item.outcomeHistory.map((event) => (
            <div key={event.id} className="fg-card-copy">• {new Date(event.createdAt).toLocaleString()}, {event.outcome}, {event.stateLabel}</div>
          )) : <div className="fg-card-copy">No same-state outcome history is logged yet.</div>}
        </div>
      </div>
    </section>
  );
};

export default RecommendationLedgerCard;