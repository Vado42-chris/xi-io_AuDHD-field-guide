import React from 'react';
import { ThreadMemoryEntry } from '../../types/core';

interface ThreadMemoryCardProps {
  memory: ThreadMemoryEntry;
  onApplySuggestedTags: () => void;
}

export const ThreadMemoryCard: React.FC<ThreadMemoryCardProps> = ({ memory, onApplySuggestedTags }) => {
  return (
    <section className="fg-glass fg-thread-memory-card">
      <div className="fg-kicker">Thread memory</div>
      <p className="fg-card-copy" style={{ marginTop: 8 }}>{memory.summary}</p>

      <div className="fg-panel-stack" style={{ marginTop: 14 }}>
        <div>
          <div className="fg-kicker">Suggested tags</div>
          <p className="fg-card-copy">{memory.suggestedTags.length ? memory.suggestedTags.join(', ') : 'No suggested tags yet.'}</p>
        </div>
        <div>
          <div className="fg-kicker">Confirmed tags</div>
          <p className="fg-card-copy">{memory.confirmedTags.length ? memory.confirmedTags.join(', ') : 'No confirmed tags yet.'}</p>
        </div>
        <div>
          <div className="fg-kicker">Stressors</div>
          <p className="fg-card-copy">{memory.stressorTags.length ? memory.stressorTags.join(', ') : 'No clear stressors parsed yet.'}</p>
        </div>
        <div>
          <div className="fg-kicker">De-stressers</div>
          <p className="fg-card-copy">{memory.destresserTags.length ? memory.destresserTags.join(', ') : 'No clear de-stressers parsed yet.'}</p>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <button type="button" className="fg-choice-chip fg-glass" onClick={onApplySuggestedTags}>
          Apply suggested tags
        </button>
      </div>
    </section>
  );
};

export default ThreadMemoryCard;