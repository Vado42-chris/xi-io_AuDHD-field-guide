import React from 'react';
import { CustomStateLabel } from '../../types/core';

interface StateStudioRowProps {
  state: CustomStateLabel;
  onRename: (value: string) => void;
  onToggleFavorite: () => void;
  onToggleHidden: () => void;
}

export const StateStudioRow: React.FC<StateStudioRowProps> = ({
  state,
  onRename,
  onToggleFavorite,
  onToggleHidden,
}) => {
  return (
    <div className="fg-glass fg-config-row">
      <div className="fg-config-main">
        <div className="fg-kicker">{state.canonicalId}</div>
        <input
          className="fg-inline-input"
          value={state.label}
          onChange={(e) => onRename(e.target.value)}
          aria-label={`Rename ${state.canonicalId} state`}
        />
      </div>
      <div className="fg-chip-row">
        <button type="button" className="fg-choice-chip fg-glass" data-active={state.favorite} onClick={onToggleFavorite}>
          {state.favorite ? 'Favorite' : 'Pin'}
        </button>
        <button type="button" className="fg-choice-chip fg-glass" data-active={state.hidden} onClick={onToggleHidden}>
          {state.hidden ? 'Hidden' : 'Visible'}
        </button>
      </div>
    </div>
  );
};

export default StateStudioRow;