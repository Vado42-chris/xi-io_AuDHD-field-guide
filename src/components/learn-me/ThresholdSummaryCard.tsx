import React from 'react';
import { ThresholdSummary } from '../../types/core';

interface ThresholdSummaryCardProps {
  summary: ThresholdSummary;
}

export const ThresholdSummaryCard: React.FC<ThresholdSummaryCardProps> = ({ summary }) => {
  return (
    <section className="fg-card fg-glass fg-learning-summary-card">
      <div className="fg-kicker">Threshold</div>
      <h2 className="fg-card-title">Readiness: {summary.readiness}</h2>
      <div className="fg-help-meta" style={{ marginTop: 12 }}>
        <div className="fg-meta-pill fg-glass">Confirmed evidence: {summary.confirmedEvidence}/{summary.targetEvidence}</div>
        <div className="fg-meta-pill fg-glass">Contradictions: {summary.contradictionCount}</div>
      </div>
      <p className="fg-card-copy" style={{ marginTop: 12 }}>{summary.message}</p>
    </section>
  );
};

export default ThresholdSummaryCard;