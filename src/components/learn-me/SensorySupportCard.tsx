import React from 'react';
import { SensorySupportRecord } from '../../types/core';

interface SensorySupportCardProps {
  record: SensorySupportRecord;
  onConfirm: () => void;
}

export const SensorySupportCard: React.FC<SensorySupportCardProps> = ({ record, onConfirm }) => {
  const helpfulTotal = record.outcomeCounts.helped + record.outcomeCounts.a_little;

  return (
    <article className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">sensory</div>
      <h2 className="fg-card-title">{record.label}</h2>
      <p className="fg-card-copy">
        Category: {record.category}. Helpful states: {record.helpfulStates.join(', ')}.
      </p>
      <div className="fg-help-meta" style={{ marginTop: 12 }}>
        <div className="fg-meta-pill fg-glass">Helpful outcomes: {helpfulTotal}</div>
        <div className="fg-meta-pill fg-glass">Worse: {record.outcomeCounts.worse}</div>
      </div>
      <div style={{ marginTop: 14 }}>
        <button type="button" className="fg-choice-chip fg-glass" onClick={onConfirm} disabled={record.confirmed}>
          {record.confirmed ? 'Confirmed' : 'Confirm'}
        </button>
      </div>
    </article>
  );
};

export default SensorySupportCard;