import React from 'react';

interface TrialBannerProps {
  title: string;
  body: string;
  meta?: string;
  clearLabel?: string;
  onClear?: () => void;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ title, body, meta, clearLabel = 'Clear', onClear }) => {
  return (
    <section className="fg-panel-stack fg-glass" style={{ padding: 18, borderRadius: 18 }}>
      <div className="fg-kicker">{title}</div>
      <div className="fg-card-copy">{body}</div>
      {meta ? <div className="fg-state-meta">{meta}</div> : null}
      {onClear ? (
        <div className="fg-chip-row">
          <button type="button" className="fg-choice-chip fg-glass" onClick={onClear}>{clearLabel}</button>
        </div>
      ) : null}
    </section>
  );
};

export default TrialBanner;