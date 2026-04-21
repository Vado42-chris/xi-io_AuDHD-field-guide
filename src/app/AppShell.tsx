import React, { useEffect, useMemo, useState } from 'react';
import '../theme/app.css';
import { CurrentStateBar } from '../components/state/CurrentStateBar';
import { CurrentStateSelector } from '../components/state/CurrentStateSelector';
import { CustomizeHome } from '../features/customize/CustomizeHome';
import { HelpNowHome } from '../features/help-now/HelpNowHome';
import { JournalHome } from '../features/journal/JournalHome';
import { LearnMeHome } from '../features/learn-me/LearnMeHome';
import {
  AppIdentity,
  AppSection,
  CurrentState,
  DEFAULT_CURRENT_STATE,
  DEFAULT_CUSTOM_STATES,
  DEFAULT_IDENTITY,
  JournalThread,
  StateIntensity,
  StateSnapshot,
  SupportLogEntry,
  SupportOutcome,
} from '../types/core';
import { readLocal, writeLocal } from '../lib/storage/localStore';

const SECTION_LABELS: Record<AppSection, { kicker: string; label: string }> = {
  help_now: { kicker: 'Immediate support', label: 'Help Now' },
  journal: { kicker: 'Interactive continuity', label: 'Journal' },
  learn_me: { kicker: 'Patterns over time', label: 'Learn Me' },
  customize: { kicker: 'User-owned controls', label: 'Customize' },
};

const makeStateSnapshot = (state: CurrentState): StateSnapshot => ({
  canonicalId: state.canonicalId,
  label: state.label,
  intensity: state.intensity,
  recordedAt: Date.now(),
});

const makeDefaultThreads = (): JournalThread[] => {
  const painState: StateSnapshot = {
    canonicalId: 'in_pain',
    label: 'In Pain',
    intensity: 'high',
    recordedAt: Date.now() - 1000 * 60 * 55,
  };

  const activatedState: StateSnapshot = {
    canonicalId: 'activated',
    label: 'Activated',
    intensity: 'medium',
    recordedAt: Date.now() - 1000 * 60 * 60 * 18,
  };

  return [
    {
      id: 'thread-1',
      title: 'Back pain and overload notes',
      createdAt: Date.now() - 1000 * 60 * 55,
      updatedAt: Date.now() - 1000 * 60 * 30,
      startingState: painState,
      currentState: painState,
      summary: 'Pain seemed to lead the mood and the task-lock around dinner prep.',
      tags: ['pain', 'overload'],
      messages: [
        { id: 'm-1', role: 'user', text: 'My back pain is taking over and I cannot think straight.', createdAt: Date.now() - 1000 * 60 * 50 },
        { id: 'm-2', role: 'ibal', text: 'Let us keep this low-demand. Start by reducing one source of extra strain and name what the body needs first.', createdAt: Date.now() - 1000 * 60 * 49 },
      ],
      transitions: [],
    },
    {
      id: 'thread-2',
      title: 'Social recovery after a hard message',
      createdAt: Date.now() - 1000 * 60 * 60 * 18,
      updatedAt: Date.now() - 1000 * 60 * 60 * 17,
      startingState: activatedState,
      currentState: activatedState,
      summary: 'The user wanted help slowing down before replying.',
      tags: ['social', 'activated'],
      messages: [
        { id: 'm-3', role: 'user', text: 'I got a message that hit me hard and I want to fire back.', createdAt: Date.now() - 1000 * 60 * 60 * 18 },
        { id: 'm-4', role: 'ibal', text: 'Do less first. Hold the reply, cool the next action down, and decide later.', createdAt: Date.now() - 1000 * 60 * 60 * 17 },
      ],
      transitions: [],
    },
  ];
};

const NavButton: React.FC<{
  section: AppSection;
  active: boolean;
  onClick: (section: AppSection) => void;
}> = ({ section, active, onClick }) => {
  const item = SECTION_LABELS[section];
  return (
    <button type="button" className="fg-nav-button fg-glass" data-active={active} onClick={() => onClick(section)}>
      <div style={{ display: 'grid', gap: 2 }}>
        <div className="fg-kicker" style={{ color: active ? 'var(--fg-accent-strong)' : 'var(--fg-text-muted)' }}>
          {item.kicker}
        </div>
        <div style={{ fontWeight: 700 }}>{item.label}</div>
      </div>
    </button>
  );
};

export const AppShell: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>('help_now');
  const [identity, setIdentity] = useState<AppIdentity>(() => readLocal<AppIdentity>('fg_identity_v2', DEFAULT_IDENTITY));
  const [currentState, setCurrentState] = useState<CurrentState>(() => readLocal<CurrentState>('fg_current_state_v2', DEFAULT_CURRENT_STATE));
  const [customStates] = useState(() => readLocal('fg_custom_states_v2', DEFAULT_CUSTOM_STATES));
  const [journalThreads, setJournalThreads] = useState<JournalThread[]>(() => readLocal<JournalThread[]>('fg_journal_threads_v2', makeDefaultThreads()));
  const [supportLog, setSupportLog] = useState<SupportLogEntry[]>(() => readLocal<SupportLogEntry[]>('fg_support_log_v2', []));
  const [selectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => {
    writeLocal('fg_identity_v2', identity);
  }, [identity]);

  useEffect(() => {
    writeLocal('fg_current_state_v2', currentState);
  }, [currentState]);

  useEffect(() => {
    writeLocal('fg_support_log_v2', supportLog);
  }, [supportLog]);

  useEffect(() => {
    writeLocal('fg_journal_threads_v2', journalThreads);
  }, [journalThreads]);

  const recentOutcomeSummary = useMemo(() => {
    const latest = supportLog[0];
    if (!latest) return undefined;
    const outcome = latest.outcome.replace('_', ' ');
    return `${latest.supportTitle} · ${outcome}`;
  }, [supportLog]);

  const updateCurrentState = (partial: Partial<CurrentState>) => {
    setCurrentState((prev) => ({
      ...prev,
      ...partial,
      updatedAt: Date.now(),
      source: partial.source ?? 'user',
    }));
  };

  const handleSelectState = (stateId: string) => {
    const next = customStates.find((state) => state.id === stateId);
    if (!next) return;

    updateCurrentState({
      canonicalId: next.canonicalId,
      label: next.label,
      source: 'user',
    });
  };

  const handleSelectIntensity = (intensity: StateIntensity) => {
    updateCurrentState({ intensity, source: 'user' });
  };

  const handleApplyRouteState = (canonicalId: CurrentState['canonicalId']) => {
    const matching = customStates.find((state) => state.canonicalId === canonicalId && !state.hidden) || customStates.find((state) => state.canonicalId === canonicalId);
    if (!matching) return;

    setActiveSection('help_now');
    updateCurrentState({
      canonicalId: matching.canonicalId,
      label: matching.label,
      source: 'support_flow',
    });
  };

  const handleLogOutcome = (supportTitle: string, supportRoute: string, outcome: SupportOutcome) => {
    const entry: SupportLogEntry = {
      id: `${Date.now()}`,
      stateLabel: currentState.label,
      stateCanonicalId: currentState.canonicalId,
      supportTitle,
      supportRoute,
      outcome,
      createdAt: Date.now(),
    };
    setSupportLog((prev) => [entry, ...prev].slice(0, 20));
  };

  const handleCreateThread = () => {
    const snapshot = makeStateSnapshot(currentState);
    const newThread: JournalThread = {
      id: `thread-${Date.now()}`,
      title: `${currentState.label} check-in`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      startingState: snapshot,
      currentState: snapshot,
      summary: `Started from ${currentState.label.toLowerCase()} · ${currentState.intensity}.`,
      tags: [currentState.canonicalId],
      messages: [
        {
          id: `m-${Date.now()}`,
          role: 'ibal',
          text: `Starting from ${currentState.label.toLowerCase()} · ${currentState.intensity}. You can keep this brief. What feels most important to capture right now?`,
          createdAt: Date.now(),
        },
      ],
      transitions: [],
    };

    setJournalThreads((prev) => [newThread, ...prev]);
    setActiveSection('journal');
  };

  const handleOpenThread = (threadId: string) => {
    setJournalThreads((prev) => {
      const found = prev.find((thread) => thread.id === threadId);
      if (!found) return prev;
      return [found, ...prev.filter((thread) => thread.id !== threadId)];
    });
  };

  const handleSendMessage = (threadId: string, text: string) => {
    setJournalThreads((prev) =>
      prev.map((thread) => {
        if (thread.id !== threadId) return thread;

        const userMessage = {
          id: `m-${Date.now()}-u`,
          role: 'user' as const,
          text,
          createdAt: Date.now(),
        };

        const ibalMessage = {
          id: `m-${Date.now()}-i`,
          role: 'ibal' as const,
          text: `Noted. I will treat this as part of the same thread and keep the context connected. After this send, check whether your state still fits.`,
          createdAt: Date.now() + 1,
        };

        return {
          ...thread,
          updatedAt: Date.now(),
          summary: text.length > 120 ? `${text.slice(0, 117)}...` : text,
          messages: [...thread.messages, userMessage, ibalMessage],
        };
      })
    );
  };

  const handleKeepThreadState = (threadId: string) => {
    setJournalThreads((prev) =>
      prev.map((thread) => {
        if (thread.id !== threadId) return thread;
        const snapshot = makeStateSnapshot(currentState);
        return {
          ...thread,
          updatedAt: Date.now(),
          currentState: snapshot,
        };
      })
    );
  };

  const activeView = useMemo(() => {
    switch (activeSection) {
      case 'journal':
        return (
          <JournalHome
            threads={journalThreads}
            currentState={currentState}
            onCreateThread={handleCreateThread}
            onOpenThread={handleOpenThread}
            onSendMessage={handleSendMessage}
            onKeepThreadState={handleKeepThreadState}
            onRequestStateUpdate={() => setSelectorOpen(true)}
          />
        );
      case 'learn_me':
        return <LearnMeHome />;
      case 'customize':
        return <CustomizeHome />;
      case 'help_now':
      default:
        return (
          <HelpNowHome
            currentState={currentState}
            onApplyRouteState={handleApplyRouteState}
            onLogOutcome={handleLogOutcome}
            recentOutcomeSummary={recentOutcomeSummary}
          />
        );
    }
  }, [activeSection, journalThreads, currentState, recentOutcomeSummary]);

  return (
    <div className="fg-app-shell">
      <div className="fg-tablet-frame">
        <div className="fg-shell-grid">
          <aside className="fg-sidebar fg-substrate">
            <div className="fg-brand-lockup">
              <div className="fg-brand-mark">XI</div>
              <div className="fg-brand-copy">
                <div className="fg-brand-title">AuDHD Field Guide</div>
                <div className="fg-brand-subtitle">State-aware journal and reflection shell</div>
              </div>
            </div>

            <div className="fg-nav-list">
              {(['help_now', 'journal', 'learn_me', 'customize'] as AppSection[]).map((section) => (
                <NavButton key={section} section={section} active={activeSection === section} onClick={setActiveSection} />
              ))}
            </div>

            <div className="fg-glass" style={{ borderRadius: 18, padding: '16px 14px', marginTop: 'auto' }}>
              <div className="fg-kicker">Identity</div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>{identity.username}</div>
              <div className="fg-state-meta">Local-first shell foundation</div>
            </div>
          </aside>

          <main className="fg-main fg-substrate">
            <CurrentStateBar
              currentState={currentState}
              onUpdate={() => setSelectorOpen(true)}
              onHelpNow={() => setActiveSection('help_now')}
            />
            {activeView}
          </main>
        </div>
      </div>

      <CurrentStateSelector
        currentState={currentState}
        states={customStates}
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelectState={handleSelectState}
        onSelectIntensity={handleSelectIntensity}
      />
    </div>
  );
};

export default AppShell;