import React, { useMemo, useState } from 'react';
import MessageBubble from '../../components/journal/MessageBubble';
import PostSendStateCheck from '../../components/journal/PostSendStateCheck';
import ThreadHeader from '../../components/journal/ThreadHeader';
import { CurrentState, JournalThread } from '../../types/core';

interface JournalHomeProps {
  threads: JournalThread[];
  currentState: CurrentState;
  onCreateThread: () => void;
  onOpenThread: (threadId: string) => void;
  onSendMessage: (threadId: string, text: string) => void;
  onKeepThreadState: (threadId: string) => void;
  onRequestStateUpdate: () => void;
}

export const JournalHome: React.FC<JournalHomeProps> = ({
  threads,
  currentState,
  onCreateThread,
  onOpenThread,
  onSendMessage,
  onKeepThreadState,
  onRequestStateUpdate,
}) => {
  const [draft, setDraft] = useState('');

  const activeThread = useMemo(() => threads[0], [threads]);

  const handleSend = () => {
    if (!activeThread || !draft.trim()) return;
    onSendMessage(activeThread.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="fg-content-card fg-glass">
      <div className="fg-header">
        <div className="fg-kicker">Journal</div>
        <h1 className="fg-section-title">State-aware threads with ibal.</h1>
        <p className="fg-section-body">
          This slice turns the journal from a shell into a continuity surface. New threads start from the
          active current state, conversations can be resumed, and each send is followed by a soft state check.
        </p>
      </div>

      <div className="fg-journal-layout" style={{ marginTop: 20 }}>
        <aside className="fg-thread-list fg-glass">
          <div className="fg-panel-stack">
            <div>
              <div className="fg-kicker">Start</div>
              <h2 className="fg-card-title" style={{ marginTop: 6 }}>New thread from current state</h2>
              <div className="fg-meta-pill fg-glass" style={{ marginTop: 12, display: 'inline-flex' }}>
                Starts from: {currentState.label} · {currentState.intensity}
              </div>
            </div>

            <button type="button" className="fg-button" onClick={onCreateThread}>
              Start new thread
            </button>

            <div className="fg-thread-list-stack">
              {threads.map((thread, index) => (
                <button
                  key={thread.id}
                  type="button"
                  className="fg-thread-card fg-glass"
                  data-active={index === 0}
                  onClick={() => onOpenThread(thread.id)}
                >
                  <div className="fg-kicker">Thread</div>
                  <div style={{ fontWeight: 700, marginTop: 6 }}>{thread.title}</div>
                  <div className="fg-state-meta">Started from {thread.startingState.label}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="fg-thread-surface fg-glass">
          {activeThread ? (
            <>
              <ThreadHeader thread={activeThread} />

              <div className="fg-thread-message-stack">
                {activeThread.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>

              <div className="fg-composer fg-glass">
                <div>
                  <div className="fg-kicker">Add to thread</div>
                  <div className="fg-state-meta">Keep it simple. You can journal in fragments.</div>
                </div>
                <textarea
                  className="fg-textarea"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="What happened, what feels loud, or what do you want ibal to help organize?"
                />
                <div className="fg-composer-actions">
                  <div className="fg-state-meta">After you send, we will check whether your state still fits.</div>
                  <button type="button" className="fg-button" onClick={handleSend} disabled={!draft.trim()}>
                    Send to ibal
                  </button>
                </div>
              </div>

              <PostSendStateCheck
                currentState={currentState}
                onKeep={() => onKeepThreadState(activeThread.id)}
                onUpdate={onRequestStateUpdate}
              />
            </>
          ) : (
            <div className="fg-state-meta">No threads yet. Start one from your current state.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default JournalHome;