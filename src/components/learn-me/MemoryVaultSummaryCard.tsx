import React from 'react';
import { MemoryVaultSummary } from '../../types/core';

interface MemoryVaultSummaryCardProps {
  summary: MemoryVaultSummary;
}

export const MemoryVaultSummaryCard: React.FC<MemoryVaultSummaryCardProps> = ({ summary }) => {
  return (
    <section className="fg-card fg-glass fg-learning-summary-card">
      <div className="fg-kicker">Memory vault</div>
      <h2 className="fg-card-title">Cross-thread memory review</h2>
      <div className="fg-help-meta" style={{ marginTop: 12 }}>
        <div className="fg-meta-pill fg-glass">Entries: {summary.totalEntries}</div>
        <div className="fg-meta-pill fg-glass">Confirmed: {summary.confirmedEntries}</div>
      </div>
      <div className="fg-panel-stack" style={{ marginTop: 14 }}>
        <div>
          <div className="fg-kicker">Repeated tags</div>
          <p className="fg-card-copy">{summary.repeatedTags.length ? summary.repeatedTags.join(', ') : 'No repeated tags yet.'}</p>
        </div>
        <div>
          <div className="fg-kicker">Repeated stressors</div>
          <p className="fg-card-copy">{summary.repeatedStressors.length ? summary.repeatedStressors.join(', ') : 'No repeated stressors yet.'}</p>
        </div>
        <div>
          <div className="fg-kicker">Repeated de-stressers</div>
          <p className="fg-card-copy">{summary.repeatedDestressers.length ? summary.repeatedDestressers.join(', ') : 'No repeated de-stressers yet.'}</p>
        </div>
      </div>
    </section>
  );
};

export default MemoryVaultSummaryCard;