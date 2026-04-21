import React from 'react';
import { CurrentState, CustomStateLabel, StateIntensity } from '../../types/core';

interface CurrentStateSelectorProps {
  currentState: CurrentState;
  states: CustomStateLabel[];
  open: boolean;
  onClose: () => void;
  onSelectState: (stateId: string) => void;
  onSelectIntensity: (intensity: StateIntensity) => void;
}

const INTENSITIES: StateIntensity[] = ['low', 'medium', 'high'];

export const CurrentStateSelector: React.FC<CurrentStateSelectorProps> = ({
  currentState,
  states,
  open,
  onClose,
  onSelectState,
  onSelectIntensity,
}) => {
  if (!open) return null;

  const visibleStates = [...states]
    .filter((state) => !state.hidden)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="fg-sheet-overlay" role="dialog" aria-modal="true" aria-label="Current state selector">
      <div className="fg-sheet-backdrop" onClick={onClose} />
      <section className="fg-sheet fg-substrate">
        <div className="fg-sheet-header">
          <div>
            <div className="fg-kicker">Update current state</div>
            <h2 className="fg-sheet-title">Pick what feels closest right now.</h2>
          </div>
          <button type="button" className="fg-quiet-button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="fg-sheet-section">
          <div className="fg-sheet-label">State</div>
          <div className="fg-chip-grid">
            {visibleStates.map((state) => {
              const active = state.canonicalId === currentState.canonicalId && state.label === currentState.label;
              return (
                <button
                  key={state.id}
                  type="button"
                  className="fg-choice-chip fg-glass"
                  data-active={active}
                  onClick={() => onSelectState(state.id)}
                >
                  {state.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="fg-sheet-section">
          <div className="fg-sheet-label">Intensity</div>
          <div className="fg-chip-row">
            {INTENSITIES.map((intensity) => (
              <button
                key={intensity}
                type="button"
                className="fg-choice-chip fg-glass"
                data-active={currentState.intensity === intensity}
                onClick={() => onSelectIntensity(intensity)}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CurrentStateSelector;