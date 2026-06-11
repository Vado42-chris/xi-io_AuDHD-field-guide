import React from 'react';
import { LearningSignal } from '../../types/core';

interface LearningSignalCardProps {
  signal: LearningSignal;
  onConfirm: () => void;
}

export const LearningSignalCard: React.FC<LearningSignalCardProps> = ({ signal, onConfirm }) => {
  return (
    <article className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">{signal.kind}</div>
      <h2 className="fg-card-title">{signal.label}</h2>
      <p className="fg-card-copy">
        Seen in: {signal.contexts.join(', ')}
      </p>
      <div className="fg-help-meta" style={{ marginTop: 12 }}>
        <div className="fg-meta-pill fg-glass">Confidence: {signal.confidence}</div>
        <div className="fg-meta-pill fg-glass">Source: {signal.source}</div>
      </div>
      <div style={{ marginTop: 14 }}>
        <button type="button" className="fg-choice-chip fg-glass" onClick={onConfirm} disabled={signal.confirmed}>
          {signal.confirmed ? 'Confirmed' : 'Confirm'}
        </button>
      </div>
    </article>
  );
};

export default LearningSignalCard;