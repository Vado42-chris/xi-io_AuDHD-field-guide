import React from 'react';
import { SensorySupportRecord } from '../../types/core';

interface ComfortToolCardProps {
  record: SensorySupportRecord;
  onToggleFavorite: () => void;
  onToggleHidden: () => void;
}

export const ComfortToolCard: React.FC<ComfortToolCardProps> = ({ record, onToggleFavorite, onToggleHidden }) => {
  const helpfulCount = record.outcomeCounts.helped + record.outcomeCounts.a_little;

  return (
    <article className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">comfort tool</div>
      <h2 className="fg-card-title">{record.label}</h2>
      <p className="fg-card-copy">
        Category: {record.category}. Helpful outcomes: {helpfulCount}. Worse outcomes: {record.outcomeCounts.worse}.
      </p>
      <div className="fg-help-meta" style={{ marginTop: 12 }}>
        <div className="fg-meta-pill fg-glass">States: {record.helpfulStates.join(', ')}</div>
        <div className="fg-meta-pill fg-glass">{record.confirmed ? 'Confirmed' : 'Suggested'}</div>
      </div>
      <div className="fg-chip-row" style={{ marginTop: 14 }}>
        <button type="button" className="fg-choice-chip fg-glass" data-active={record.favorite} onClick={onToggleFavorite}>
          {record.favorite ? 'Pinned' : 'Pin'}
        </button>
        <button type="button" className="fg-choice-chip fg-glass" data-active={record.hidden} onClick={onToggleHidden}>
          {record.hidden ? 'Hidden' : 'Visible'}
        </button>
      </div>
    </article>
  );
};

export default ComfortToolCard;