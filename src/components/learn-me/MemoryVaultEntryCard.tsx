import React, { useState } from 'react';
import { MemoryEntryStatus, MemoryVaultEntry } from '../../types/core';
import MemoryAuditTrailCard from './MemoryAuditTrailCard';

interface MemoryVaultEntryCardProps {
  entry: MemoryVaultEntry;
  onSave: (entryId: string, summary: string, confirmedTags: string[], status: MemoryEntryStatus, notes: string) => void;
}

const STATUSES: MemoryEntryStatus[] = ['suggested', 'confirmed', 'outdated', 'superseded'];

export const MemoryVaultEntryCard: React.FC<MemoryVaultEntryCardProps> = ({ entry, onSave }) => {
  const [summary, setSummary] = useState(entry.summary);
  const [tagText, setTagText] = useState(entry.confirmedTags.join(', '));
  const [status, setStatus] = useState<MemoryEntryStatus>(entry.status);
  const [notes, setNotes] = useState(entry.notes ?? '');

  const handleSave = () => {
    const confirmedTags = tagText
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    onSave(entry.id, summary.trim(), confirmedTags, status, notes.trim());
  };

  return (
    <article className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">Memory entry</div>
      <h2 className="fg-card-title">{entry.threadTitle}</h2>

      <div className="fg-panel-stack" style={{ marginTop: 14 }}>
        <div>
          <div className="fg-kicker">Summary</div>
          <textarea className="fg-textarea" value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>
        <div>
          <div className="fg-kicker">Confirmed tags</div>
          <input className="fg-inline-input" value={tagText} onChange={(e) => setTagText(e.target.value)} placeholder="comma separated tags" />
        </div>
        <div>
          <div className="fg-kicker">Status</div>
          <div className="fg-chip-row">
            {STATUSES.map((option) => (
              <button key={option} type="button" className="fg-choice-chip fg-glass" data-active={status === option} onClick={() => setStatus(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="fg-kicker">Stressors</div>
          <p className="fg-card-copy">{entry.stressorTags.length ? entry.stressorTags.join(', ') : 'None parsed.'}</p>
        </div>
        <div>
          <div className="fg-kicker">De-stressers</div>
          <p className="fg-card-copy">{entry.destresserTags.length ? entry.destresserTags.join(', ') : 'None parsed.'}</p>
        </div>
        <div>
          <div className="fg-kicker">Notes</div>
          <textarea className="fg-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="why this memory was revised, outdated, or needs caution" />
        </div>
        <div className="fg-state-meta">Source: {entry.provenanceSource} {entry.supersedesEntryId ? `· supersedes ${entry.supersedesEntryId}` : ''}</div>
        {entry.hasConflict ? (
          <div className="fg-glass" style={{ padding: 12, borderRadius: 14 }}>
            <div className="fg-kicker">Conflict detected</div>
            <p className="fg-card-copy">This entry currently contains overlapping stressor and de-stresser language. Review before trusting it.</p>
          </div>
        ) : null}
        <MemoryAuditTrailCard revisions={entry.revisionHistory} />
      </div>
      <div style={{ marginTop: 14 }}>
        <button type="button" className="fg-choice-chip fg-glass" onClick={handleSave}>
          Save memory edits
        </button>
      </div>
    </article>
  );
};

export default MemoryVaultEntryCard;