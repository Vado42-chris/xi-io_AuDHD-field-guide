import React from 'react';
import { MemoryVaultEntry } from '../../types/core';

interface MemoryVaultEntryCardProps {
  entry: MemoryVaultEntry;
  onConfirm: () => void;
}

export const MemoryVaultEntryCard: React.FC<MemoryVaultEntryCardProps> = ({ entry, onConfirm }) => {
  return (
    <article className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">Memory entry</div>
      <h2 className="fg-card-title">{entry.threadTitle}</h2>
      <p className="fg-card-copy">{entry.summary}</p>
      <div className="fg-panel-stack" style={{ marginTop: 14 }}>
        <div>
          <div className="fg-kicker">Confirmed tags</div>
          <p className="fg-card-copy">{entry.confirmedTags.length ? entry.confirmedTags.join(', ') : 'No confirmed tags yet.'}</p>
        </div>
        <div>
          <div className="fg-kicker">Stressors</div>
          <p className="fg-card-copy">{entry.stressorTags.length ? entry.stressorTags.join(', ') : 'None parsed.'}</p>
        </div>
        <div>
          <div className="fg-kicker">De-stressers</div>
          <p className="fg-card-copy">{entry.destresserTags.length ? entry.destresserTags.join(', ') : 'None parsed.'}</p>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <button type="button" className="fg-choice-chip fg-glass" onClick={onConfirm} disabled={entry.confirmed}>
          {entry.confirmed ? 'Confirmed' : 'Confirm memory'}
        </button>
      </div>
    </article>
  );
};

export default MemoryVaultEntryCard;