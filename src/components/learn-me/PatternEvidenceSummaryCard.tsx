import React from 'react';
import { PatternEvidenceSummary } from '../../types/core';

interface PatternEvidenceSummaryCardProps {
  summary: PatternEvidenceSummary;
}

export const PatternEvidenceSummaryCard: React.FC<PatternEvidenceSummaryCardProps> = ({ summary }) => {
  return (
    <section className="fg-card fg-glass fg-learning-summary-card">
      <div className="fg-kicker">Pattern evidence</div>
      <h2 className="fg-card-title">Inspector overview</h2>
      <div className="fg-help-meta" style={{ marginTop: 12 }}>
        <div className="fg-meta-pill fg-glass">Items: {summary.totalItems}</div>
        <div className="fg-meta-pill fg-glass">Repeated: {summary.repeatedItems}</div>
        <div className="fg-meta-pill fg-glass">Contested: {summary.contestedItems}</div>
      </div>
    </section>
  );
};

export default PatternEvidenceSummaryCard;