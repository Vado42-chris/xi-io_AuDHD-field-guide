import React from 'react';

const blocks = [
  'Trigger map',
  'Stressors and de-stressers',
  'Sensory profile',
  'What helps most',
];

export const LearnMeHome: React.FC = () => {
  return (
    <div className="fg-content-card fg-glass">
      <div className="fg-header">
        <div className="fg-kicker">Learn Me</div>
        <h1 className="fg-section-title">Pattern review comes after capture, not before it.</h1>
        <p className="fg-section-body">
          This area will eventually surface repeated patterns, confidence, and what helps over time.
          For now it exists as a clean home for the learning layer instead of burying it inside a score view.
        </p>
      </div>

      <div className="fg-grid" style={{ marginTop: 20 }}>
        {blocks.map((block) => (
          <article key={block} className="fg-card fg-glass">
            <div className="fg-kicker">Planned surface</div>
            <h2 className="fg-card-title">{block}</h2>
            <p className="fg-card-copy">
              This will be built from user-confirmed memory, outcomes, and pattern confidence after the core
              state and journaling flows are stable.
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default LearnMeHome;