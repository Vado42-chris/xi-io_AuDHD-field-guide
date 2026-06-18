import React from 'react';
import { CurrentState, ThreadSummary } from '../../types/core';

interface JournalHomeProps {
  recentThreads: ThreadSummary[];
  currentState: CurrentState;
}

export const JournalHome: React.FC<JournalHomeProps> = ({ recentThreads, currentState }) => {
  return (
    <div className="fg-content-card fg-glass">
      <div className="fg-header">
        <div className="fg-kicker">Journal</div>
        <h1 className="fg-section-title">State-aware threads with ibal.</h1>
        <p className="fg-section-body">
          This shell preserves the thread and continuity concept from the legacy app while clearing out
          the old dashboard framing. Slice 02 will turn this into the main repeated-use journaling surface.
        </p>
      </div>

      <div className="fg-grid" style={{ marginTop: 20 }}>
        <article className="fg-card fg-glass">
          <div className="fg-kicker">Start</div>
          <h2 className="fg-card-title">New thread from current state</h2>
          <p className="fg-card-copy">
            New threads will inherit the current state snapshot automatically and stay editable as the
            conversation changes.
          </p>
          <div className="fg-meta-pill fg-glass" style={{ marginTop: 14, display: 'inline-flex' }}>
            Next thread starts from: {currentState.label} · {currentState.intensity}
          </div>
        </article>

        <article className="fg-card fg-glass">
          <div className="fg-kicker">Continue</div>
          <h2 className="fg-card-title">Recent threads</h2>
          <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            {recentThreads.map((thread) => (
              <div key={thread.id} className="fg-glass" style={{ borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ fontWeight: 700 }}>{thread.title}</div>
                <div className="fg-state-meta">Started from {thread.startingStateLabel}</div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default JournalHome;