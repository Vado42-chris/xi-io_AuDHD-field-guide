import React from 'react';
import { PatternReviewSummary } from '../../types/core';

interface PatternReviewSummaryCardProps {
  summary: PatternReviewSummary;
}

export const PatternReviewSummaryCard: React.FC<PatternReviewSummaryCardProps> = ({ summary }) => {
  return (
    <section className="fg-card fg-glass fg-learning-summary-card">
      <div className="fg-kicker">Pattern review</div>
      <h2 className="fg-card-title">Confidence: {summary.confidenceLevel}</h2>
      <div className="fg-help-meta" style={{ marginTop: 12 }}>
        <div className="fg-meta-pill fg-glass">Evidence: {summary.evidenceCount}</div>
        <div className="fg-meta-pill fg-glass">Contradictions: {summary.contradictionCount}</div>
      </div>

      <div className="fg-panel-stack" style={{ marginTop: 14 }}>
        <div>
          <div className="fg-kicker">Repeated stressors</div>
          <p className="fg-card-copy">{summary.repeatedStressors.length ? summary.repeatedStressors.join(', ') : 'None confirmed strongly yet.'}</p>
        </div>
        <div>
          <div className="fg-kicker">Repeated de-stressers</div>
          <p className="fg-card-copy">{summary.repeatedDestressers.length ? summary.repeatedDestressers.join(', ') : 'No strong repeats yet.'}</p>
        </div>
        <div>
          <div className="fg-kicker">What helps most</div>
          <p className="fg-card-copy">{summary.strongestSupports.length ? summary.strongestSupports.join(', ') : 'Not enough helpful outcomes yet.'}</p>
        </div>
        <div>
          <div className="fg-kicker">Caution notes</div>
          <p className="fg-card-copy">{summary.cautionNotes.join(' ')}</p>
        </div>
      </div>
    </section>
  );
};

export default PatternReviewSummaryCard;