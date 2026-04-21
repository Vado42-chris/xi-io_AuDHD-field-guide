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
  SupportLogEntry,
  SupportOutcome,
  ThreadSummary,
  StateIntensity,
} from '../types/core';
import { readLocal, writeLocal } from '../lib/storage/localStore';

const SECTION_LABELS: Record<AppSection, { kicker: string; label: string }> = {
  help_now: { kicker: 'Immediate support', label: 'Help Now' },
  journal: { kicker: 'Interactive continuity', label: 'Journal' },
  learn_me: { kicker: 'Patterns over time', label: 'Learn Me' },
  customize: { kicker: 'User-owned controls', label: 'Customize' },
};

const DEFAULT_THREADS: ThreadSummary[] = [
  {
    id: 'thread-1',
    title: 'Back pain and overload notes',
    updatedAt: Date.now() - 1000 * 60 * 50,
    startingStateLabel: 'In Pain',
    summary: 'Pain seemed to lead the mood and the task-lock around dinner prep.',
  },
  {
    id: 'thread-2',
    title: 'Social recovery after a hard message',
    updatedAt: Date.now() - 1000 * 60 * 60 * 18,
    startingStateLabel: 'Activated',
    summary: 'The user wanted help slowing down before replying.',
  },
];

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
  const [recentThreads] = useState<ThreadSummary[]>(() => readLocal<ThreadSummary[]>('fg_recent_threads_v2', DEFAULT_THREADS));
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

  const activeView = useMemo(() => {
    switch (activeSection) {
      case 'journal':
        return <JournalHome recentThreads={recentThreads} currentState={currentState} />;
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
  }, [activeSection, recentThreads, currentState, recentOutcomeSummary]);

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