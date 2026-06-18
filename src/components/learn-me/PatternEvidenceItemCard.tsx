import React, { useState } from 'react';
import { PatternEvidenceItem, PatternResolutionStatus } from '../../types/core';

interface PatternEvidenceItemCardProps {
  item: PatternEvidenceItem;
  onToggleContested: () => void;
  onResolve: (nextStatus: PatternResolutionStatus, note: string) => void;
}

const STATUSES: PatternResolutionStatus[] = ['active', 'under_review', 'retired'];

export const PatternEvidenceItemCard: React.FC<PatternEvidenceItemCardProps> = ({ item, onToggleContested, onResolve }) => {
  const [note, setNote] = useState(item.resolutionNote ?? '');

  return (
    <article className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">Evidence item</div>
      <h2 className="fg-card-title">{item.label}</h2>
      <div className="fg-help-meta" style={{ marginTop: 12 }}>
        <div className="fg-meta-pill fg-glass">Kind: {item.kind}</div>
        <div className="fg-meta-pill fg-glass">Confidence: {item.confidence}</div>
        <div className="fg-meta-pill fg-glass">Refs: {item.references.length}</div>
        <div className="fg-meta-pill fg-glass">Status: {item.resolutionStatus}</div>
      </div>
      <div className="fg-panel-stack" style={{ marginTop: 14 }}>
        {item.references.map((reference) => (
          <div key={reference.id} className="fg-glass" style={{ padding: 12, borderRadius: 14 }}>
            <div className="fg-kicker">{reference.type}</div>
            <div className="fg-card-copy"><strong>{reference.title}</strong></div>
            <div className="fg-card-copy">{reference.detail}</div>
          </div>
        ))}
        <div className="fg-state-meta">Contested: {item.contested ? 'Yes' : 'No'}</div>
        <div>
          <div className="fg-kicker">Resolution note</div>
          <textarea className="fg-textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="why this evidence should stay active, go under review, or be retired" />
        </div>
        <div className="fg-chip-row">
          {STATUSES.map((status) => (
            <button key={status} type="button" className="fg-choice-chip fg-glass" data-active={item.resolutionStatus === status} onClick={() => onResolve(status, note.trim())}>
              {status}
            </button>
          ))}
        </div>
        {item.resolutionHistory.length > 0 ? (
          <div className="fg-panel-stack">
            <div className="fg-kicker">Resolution history</div>
            {item.resolutionHistory.map((event) => (
              <div key={event.id} className="fg-glass" style={{ padding: 12, borderRadius: 14 }}>
                <div className="fg-state-meta">{new Date(event.changedAt).toLocaleString()}</div>
                <div className="fg-card-copy">{event.previousStatus} → {event.nextStatus}</div>
                <div className="fg-card-copy">{event.reason}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div style={{ marginTop: 14 }} className="fg-chip-row">
        <button type="button" className="fg-choice-chip fg-glass" onClick={onToggleContested}>
          {item.contested ? 'Mark uncontested' : 'Contest this evidence'}
        </button>
      </div>
    </article>
  );
};

export default PatternEvidenceItemCard;