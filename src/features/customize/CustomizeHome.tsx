import React from 'react';
import ComfortToolCard from '../../components/customize/ComfortToolCard';
import StateStudioRow from '../../components/customize/StateStudioRow';
import { CustomStateLabel, SensorySupportRecord } from '../../types/core';

interface CustomizeHomeProps {
  customStates: CustomStateLabel[];
  sensorySupports: SensorySupportRecord[];
  onRenameState: (stateId: string, label: string) => void;
  onToggleStateFavorite: (stateId: string) => void;
  onToggleStateHidden: (stateId: string) => void;
  onToggleComfortFavorite: (recordId: string) => void;
  onToggleComfortHidden: (recordId: string) => void;
}

export const CustomizeHome: React.FC<CustomizeHomeProps> = ({
  customStates,
  sensorySupports,
  onRenameState,
  onToggleStateFavorite,
  onToggleStateHidden,
  onToggleComfortFavorite,
  onToggleComfortHidden,
}) => {
  const visibleComfortTools = [...sensorySupports]
    .filter((record) => !record.hidden)
    .sort((a, b) => {
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
      return a.label.localeCompare(b.label);
    });

  return (
    <div className="fg-content-card fg-glass fg-help-layout">
      <div className="fg-header">
        <div className="fg-kicker">Customize</div>
        <h1 className="fg-section-title">User-owned labels, tools, and preferences.</h1>
        <p className="fg-section-body">
          This slice turns Customize into a real ownership surface. Users can rename state labels,
          pin favorites for the quick selector, hide states they never use, and start building a comfort wall from learned sensory tools.
        </p>
      </div>

      <section className="fg-panel-stack">
        <div className="fg-kicker">State Studio</div>
        <div className="fg-panel-stack">
          {[...customStates].sort((a, b) => a.order - b.order).map((state) => (
            <StateStudioRow
              key={state.id}
              state={state}
              onRename={(value) => onRenameState(state.id, value)}
              onToggleFavorite={() => onToggleStateFavorite(state.id)}
              onToggleHidden={() => onToggleStateHidden(state.id)}
            />
          ))}
        </div>
      </section>

      <section className="fg-panel-stack">
        <div className="fg-kicker">Comfort Wall</div>
        <div className="fg-grid">
          {visibleComfortTools.length > 0 ? (
            visibleComfortTools.map((record) => (
              <ComfortToolCard
                key={record.id}
                record={record}
                onToggleFavorite={() => onToggleComfortFavorite(record.id)}
                onToggleHidden={() => onToggleComfortHidden(record.id)}
              />
            ))
          ) : (
            <div className="fg-state-meta">No comfort tools yet. As sensory supports are detected and confirmed, they will appear here for curation.</div>
          )}
        </div>
      </section>

      <section className="fg-panel-stack">
        <div className="fg-kicker">Notes</div>
        <div className="fg-grid">
          <article className="fg-card fg-glass">
            <h2 className="fg-card-title">Pinned states show up first</h2>
            <p className="fg-card-copy">
              The current-state selector now prioritizes pinned states, so the quick choices can reflect how the user actually thinks.
            </p>
          </article>
          <article className="fg-card fg-glass">
            <h2 className="fg-card-title">Comfort tools are foundations, not verdicts</h2>
            <p className="fg-card-copy">
              These tools stay user-owned. This slice lets the user organize them early without pretending the app knows everything yet.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default CustomizeHome;