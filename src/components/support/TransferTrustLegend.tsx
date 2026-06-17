import React from 'react';

export const TransferTrustLegend: React.FC = () => {
  return (
    <section className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">Trust legend</div>
      <h2 className="fg-card-title">How trust is being built here</h2>
      <div className="fg-panel-stack" style={{ marginTop: 14 }}>
        <div className="fg-card-copy">• Normal use means what happened when this support was used in the same state before.</div>
        <div className="fg-card-copy">• Supervised retries means the user chose to test a guarded support anyway and the app later checked whether that choice held up.</div>
        <div className="fg-card-copy">• A support can learn a little from supervised retries, but those retries should not quickly outweigh the more grounded same-state history.</div>
        <div className="fg-card-copy">• The percentages show how much of the current lane comes from normal use versus supervised retries.</div>
      </div>
    </section>
  );
};

export default TransferTrustLegend;