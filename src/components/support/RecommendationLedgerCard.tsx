import React, { useState } from 'react';
import { RecommendationLedgerItem, TransferDecision } from '../../types/core';

interface RecommendationLedgerCardProps {
  item: RecommendationLedgerItem;
  onReviewTransfer: (recommendationId: string, transferSafety: RecommendationLedgerItem['transferSafety'], transferWarning: string | undefined, decision: TransferDecision, reason: string) => void;
}

export const RecommendationLedgerCard: React.FC<RecommendationLedgerCardProps> = ({ item, onReviewTransfer }) => {
  const [reason, setReason] = useState('');

  return (
    <section className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">Why this suggestion</div>
      <h2 className="fg-card-title">{item.title}</h2>
      <div className="fg-help-meta" style={{ marginTop: 12 }}>
        <div className="fg-meta-pill fg-glass">Confidence: {item.confidence}</div>
        <div className="fg-meta-pill fg-glass">Current status: {item.availability.replace('_', ' ')}</div>
        <div className="fg-meta-pill fg-glass">Transfer warning: {item.transferSafety}</div>
      </div>
      <p className="fg-card-copy" style={{ marginTop: 12 }}>{item.appearedBecause}</p>
      <p className="fg-card-copy">{item.reason}</p>
      <p className="fg-card-copy">Trust mix: {item.trustSummary}.</p>
      {item.transferWarning ? <p className="fg-card-copy">{item.transferWarning}</p> : null}
      {item.transferSafety !== 'safe' ? (
        <div className="fg-panel-stack fg-glass" style={{ padding: 14, borderRadius: 14, marginTop: 14 }}>
          <div className="fg-kicker">Transfer review</div>
          <div className="fg-card-copy">If you still want to try this here, record that choice so the app can learn from what happens next.</div>
          <textarea className="fg-textarea" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="why are you choosing to try or reject this here?" />
          <div className="fg-chip-row">
            <button type="button" className="fg-choice-chip fg-glass" onClick={() => onReviewTransfer(item.id, item.transferSafety, item.transferWarning, 'approved', reason.trim())}>
              Try it anyway
            </button>
            <button type="button" className="fg-choice-chip fg-glass" onClick={() => onReviewTransfer(item.id, item.transferSafety, item.transferWarning, 'rejected', reason.trim())}>
              Skip it here
            </button>
          </div>
          {item.transferReviews.length > 0 ? (
            <div className="fg-panel-stack">
              <div className="fg-kicker">Past transfer decisions</div>
              {item.transferReviews.map((review) => (
                <div key={review.id} className="fg-card-copy">• {new Date(review.createdAt).toLocaleString()}, {review.decision}, outcome {review.outcomeAssessment.replace('_', ' ')}</div>
              ))}
            </div>
          ) : null}
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