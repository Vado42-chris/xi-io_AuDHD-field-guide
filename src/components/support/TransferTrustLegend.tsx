import React from 'react';

export const TransferTrustLegend: React.FC = () => {
  return (
    <section className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">Trust legend</div>
      <h2 className="fg-card-title">Direct trust vs transfer-earned trust</h2>
      <div className="fg-panel-stack" style={{ marginTop: 14 }}>
        <div className="fg-card-copy">• Direct trust comes from ordinary same-state usage history, outcome logging, and state-specific recommendation performance.</div>
        <div className="fg-card-copy">• Transfer-earned trust comes from supervised overrides of guarded transfers that were later judged justified or not justified.</div>
        <div className="fg-card-copy">• Positive transfer learning can strengthen a weak lane, but it does not erase direct-use history.</div>
        <div className="fg-card-copy">• Negative transfer learning can harden caution even when a support still performs better elsewhere.</div>
      </div>
    </section>
  );
};

export default TransferTrustLegend;