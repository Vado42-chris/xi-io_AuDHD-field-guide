import React from 'react';
import { PatternEvidenceItem } from '../../types/core';

interface PatternEvidenceItemCardProps {
  item: PatternEvidenceItem;
  onToggleContested: () => void;
}

export const PatternEvidenceItemCard: React.FC<PatternEvidenceItemCardProps> = ({ item, onToggleContested }) => {
  return (
    <article className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">Evidence item</div>
      <h2 className="fg-card-title">{item.label}</h2>
      <div className="fg-help-meta" style={{ marginTop: 12 }}>
        <div className="fg-meta-pill fg-glass">Kind: {item.kind}</div>
        <div className="fg-meta-pill fg-glass">Confidence: {item.confidence}</div>
        <div className="fg-meta-pill fg-glass">Refs: {item.references.length}</div>
      </div>
      <div className="fg-panel-stack" style={{ marginTop: 14 }}>
        {item.references.map((reference) => (
          <div key={reference.id} className="fg-glass" style={{ padding: 12, borderRadius: 14 }}>
            <div className="fg-kicker">{reference.type}</div>
            <div className="fg-card-copy"><strong>{reference.title}</strong></div>
            <div className="fg-card-copy">{reference.detail}</div>
          </div>
        ))}
        <div className="fg-state-meta">Contested: {item.contested ? 'Yes' : 'No'}</div>
      </div>
      <div style={{ marginTop: 14 }}>
        <button type="button" className="fg-choice-chip fg-glass" onClick={onToggleContested}>
          {item.contested ? 'Mark uncontested' : 'Contest this evidence'}
        </button>
      </div>
    </article>
  );
};

export default PatternEvidenceItemCard;