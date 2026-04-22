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
        <div className="fg-meta-pill fg-glass">Stability: {item.stability}</div>
        <div className="fg-meta-pill fg-glass">Availability: {item.availability}</div>
        <div className="fg-meta-pill fg-glass">Transfer: {item.transferSafety}</div>
        <div className="fg-meta-pill fg-glass">Rank: {item.rankScore}</div>
        <div className="fg-meta-pill fg-glass">Performance: {item.performanceScore}</div>
        <div className="fg-meta-pill fg-glass">Recovery: {item.recoveryScore}</div>
      </div>
      <p className="fg-card-copy" style={{ marginTop: 12 }}>{item.appearedBecause}</p>
      <p className="fg-card-copy">{item.reason}</p>
      {item.transferWarning ? <p className="fg-card-copy">{item.transferWarning}</p> : null}
      {item.transferSafety !== 'safe' ? (
        <div className="fg-panel-stack fg-glass" style={{ padding: 14, borderRadius: 14, marginTop: 14 }}>
          <div className="fg-kicker">Transfer review</div>
          <textarea className="fg-textarea" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="why are you choosing to try or reject this guarded transfer?" />
          <div className="fg-chip-row">
            <button type="button" className="fg-choice-chip fg-glass" onClick={() => onReviewTransfer(item.id, item.transferSafety, item.transferWarning, 'approved', reason.trim())}>
              Approve transfer
            </button>
            <button type="button" className="fg-choice-chip fg-glass" onClick={() => onReviewTransfer(item.id, item.transferSafety, item.transferWarning, 'rejected', reason.trim())}>
              Reject transfer
            </button>
          </div>
          {item.transferReviews.length > 0 ? (
            <div className="fg-panel-stack">
              <div className="fg-kicker">Transfer review history</div>
              {item.transferReviews.map((review) => (
                <div key={review.id} className="fg-card-copy">• {new Date(review.createdAt).toLocaleString()}, {review.decision}, {review.outcomeAssessment}</div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="fg-panel-stack" style={{ marginTop: 14 }}>
        <div>
          <div className="fg-kicker">Supporting evidence</div>
          {item.supportingEvidence.length > 0 ? item.supportingEvidence.map((ref) => (
            <div key={ref.id} className="fg-card-copy">• {ref.title}, {ref.detail}</div>
          )) : <div className="fg-card-copy">No strong supporting evidence is currently attached.</div>}
        </div>
        <div>
          <div className="fg-kicker">Weakening evidence</div>
          {item.weakeningEvidence.length > 0 ? item.weakeningEvidence.map((ref) => (
            <div key={ref.id} className="fg-card-copy">• {ref.title}, {ref.detail}</div>
          )) : <div className="fg-card-copy">No active weakening evidence is currently attached.</div>}
        </div>
        <div>
          <div className="fg-kicker">Current-state outcome history</div>
          {item.outcomeHistory.length > 0 ? item.outcomeHistory.map((event) => (
            <div key={event.id} className="fg-card-copy">• {new Date(event.createdAt).toLocaleString()}, {event.outcome}, {event.stateLabel}</div>
          )) : <div className="fg-card-copy">No recommendation-specific outcomes logged yet.</div>}
        </div>
        <div>
          <div className="fg-kicker">Per-state trust</div>
          {item.stateTrustMap.map((trust) => (
            <div key={trust.state} className="fg-card-copy">• {trust.state}: {trust.availability}, {trust.confidence}, score {trust.rankScore}</div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendationLedgerCard;