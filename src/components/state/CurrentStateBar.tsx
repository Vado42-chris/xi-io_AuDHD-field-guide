import React from 'react';
import { CurrentState } from '../../types/core';

interface CurrentStateBarProps {
  currentState: CurrentState;
  onUpdate: () => void;
  onHelpNow: () => void;
}

const formatUpdatedAt = (timestamp: number): string => {
  try {
    return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch {
    return 'recently';
  }
};

export const CurrentStateBar: React.FC<CurrentStateBarProps> = ({ currentState, onUpdate, onHelpNow }) => {
  return (
    <section className="fg-state-bar fg-glass" aria-label="Current state">
      <div className="fg-state-stack">
        <div className="fg-kicker">Current state</div>
        <div className="fg-state-title">
          {currentState.label} · {currentState.intensity}
        </div>
        <div className="fg-state-meta">Updated {formatUpdatedAt(currentState.updatedAt)}</div>
      </div>

      <div className="fg-state-actions">
        <button type="button" className="fg-button" onClick={onUpdate}>
          Update state
        </button>
        <button type="button" className="fg-quiet-button" onClick={onHelpNow}>
          Help now
        </button>
      </div>
    </section>
  );
};

export default CurrentStateBar;