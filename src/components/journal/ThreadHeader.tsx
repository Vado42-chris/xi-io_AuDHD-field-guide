import React from 'react';
import { JournalThread } from '../../types/core';

interface ThreadHeaderProps {
  thread: JournalThread;
}

export const ThreadHeader: React.FC<ThreadHeaderProps> = ({ thread }) => {
  return (
    <header className="fg-glass fg-thread-header">
      <div className="fg-kicker">Current thread</div>
      <h2 className="fg-card-title" style={{ marginTop: 6 }}>{thread.title}</h2>
      <div className="fg-help-meta" style={{ marginTop: 12 }}>
        <div className="fg-meta-pill fg-glass">Started from: {thread.startingState.label} · {thread.startingState.intensity}</div>
        <div className="fg-meta-pill fg-glass">Current thread state: {thread.currentState.label} · {thread.currentState.intensity}</div>
      </div>
      {thread.summary ? <p className="fg-card-copy" style={{ marginTop: 12 }}>{thread.summary}</p> : null}
    </header>
  );
};

export default ThreadHeader;