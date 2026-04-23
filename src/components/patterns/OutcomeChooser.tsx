import React from 'react';
import { SupportOutcome } from '../../types/core';

interface OutcomeChooserProps {
  outcomes: Array<{ id: SupportOutcome; label: string }>;
  disabled?: boolean;
  onChoose: (outcome: SupportOutcome) => void;
}

export const OutcomeChooser: React.FC<OutcomeChooserProps> = ({ outcomes, disabled = false, onChoose }) => {
  return (
    <div className="fg-outcome-row">
      {outcomes.map((outcome) => (
        <button
          key={outcome.id}
          type="button"
          className="fg-choice-chip fg-glass"
          onClick={() => onChoose(outcome.id)}
          disabled={disabled}
        >
          {outcome.label}
        </button>
      ))}
    </div>
  );
};

export default OutcomeChooser;