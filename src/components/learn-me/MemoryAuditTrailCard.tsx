import React from 'react';
import { MemoryRevision } from '../../types/core';

interface MemoryAuditTrailCardProps {
  revisions: MemoryRevision[];
}

export const MemoryAuditTrailCard: React.FC<MemoryAuditTrailCardProps> = ({ revisions }) => {
  return (
    <section className="fg-glass" style={{ padding: 14, borderRadius: 16 }}>
      <div className="fg-kicker">Audit trail</div>
      {revisions.length > 0 ? (
        <div className="fg-panel-stack" style={{ marginTop: 12 }}>
          {revisions.map((revision) => (
            <div key={revision.id} className="fg-glass" style={{ padding: 12, borderRadius: 14 }}>
              <div className="fg-state-meta">{new Date(revision.changedAt).toLocaleString()}</div>
              <div className="fg-card-copy">Reason: {revision.reason}</div>
              <div className="fg-card-copy">Summary: “{revision.previousSummary}” → “{revision.nextSummary}”</div>
              <div className="fg-card-copy">Status: {revision.previousStatus} → {revision.nextStatus}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="fg-card-copy" style={{ marginTop: 8 }}>No revisions yet. The first edit will create the audit trail.</p>
      )}
    </section>
  );
};

export default MemoryAuditTrailCard;