import React from 'react';
import { RecommendationLedgerItem } from '../../types/core';

interface RecommendationLedgerCardProps {
  item: RecommendationLedgerItem;
}

export const RecommendationLedgerCard: React.FC<RecommendationLedgerCardProps> = ({ item }) => {
  return (
    <section className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">Why this suggestion</div>
      <h2 className="fg-card-title">{item.title}</h2>
      <div className="fg-help-meta" style={{ marginTop: 12 }}>
        <div className="fg-meta-pill fg-glass">Confidence: {item.confidence}</div>
        <div className="fg-meta-pill fg-glass">Stability: {item.stability}</div>
        <div className="fg-meta-pill fg-glass">State: {item.state}</div>
        <div className="fg-meta-pill fg-glass">Performance: {item.performanceScore}</div>
      </div>
      <p className="fg-card-copy" style={{ marginTop: 12 }}>{item.appearedBecause}</p>
      <p className="fg-card-copy">{item.reason}</p>
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
          <div className="fg-kicker">Outcome history</div>
          {item.outcomeHistory.length > 0 ? item.outcomeHistory.map((event) => (
            <div key={event.id} className="fg-card-copy">• {new Date(event.createdAt).toLocaleString()}, {event.outcome}, {event.stateLabel}</div>
          )) : <div className="fg-card-copy">No recommendation-specific outcomes logged yet.</div>}
        </div>
      </div>
    </section>
  );
};

export default RecommendationLedgerCard;