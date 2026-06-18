import { useEffect, useMemo, useState } from 'react';
import {
  AppIdentity,
  AppSection,
  CurrentState,
  CustomStateLabel,
  DEFAULT_CUSTOM_STATES,
  DEFAULT_IDENTITY,
  JournalThread,
  LearningSignal,
  MemoryVaultEntry,
  MemoryVaultSummary,
  PatternReviewSummary,
  SensorySupportRecord,
  StateIntensity,
  SupportLogEntry,
  SupportOutcome,
  ThresholdSummary,
} from '../types/core';
import { readLocal, writeLocal } from '../lib/storage/localStore';
import { deriveLearningSignals, deriveSensorySupports } from '../lib/patterns/learningSignals';
import { buildPatternReviewSummary } from '../lib/patterns/patternReview';
import { buildPersonalizedSuggestions, buildThresholdSummary } from '../lib/patterns/personalizationThreshold';
import { buildThreadMemoryEntry } from '../lib/journal/threadIntelligence';
import { buildMemoryVaultEntries, buildMemoryVaultSummary } from '../lib/memory/memoryVault';
import { makeDefaultThreads, makeInitialCurrentState, makeStateSnapshot } from './appShellDefaults';

export interface AppShellController {
  activeSection: AppSection;
  identity: AppIdentity;
  currentState: CurrentState;
  customStates: CustomStateLabel[];
  journalThreads: JournalThread[];
  learningSignals: LearningSignal[];
  sensorySupports: SensorySupportRecord[];
  selectorOpen: boolean;
  recentOutcomeSummary?: string;
  memoryEntries: MemoryVaultEntry[];
  memorySummary: MemoryVaultSummary;
  patternSummary: PatternReviewSummary;
  thresholdSummary: ThresholdSummary;
  personalizedSupports: ReturnType<typeof buildPersonalizedSuggestions>;
  setActiveSection: (section: AppSection) => void;
  setSelectorOpen: (open: boolean) => void;
  handleSelectState: (stateId: string) => void;
  handleSelectIntensity: (intensity: StateIntensity) => void;
  handleApplyRouteState: (canonicalId: CurrentState['canonicalId']) => void;
  handleLogOutcome: (supportTitle: string, supportRoute: string, outcome: SupportOutcome) => void;
  handleCreateThread: () => void;
  handleOpenThread: (threadId: string) => void;
  handleSendMessage: (threadId: string, text: string) => void;
  handleKeepThreadState: (threadId: string) => void;
  handleApplySuggestedTags: (threadId: string) => void;
  handleConfirmSignal: (signalId: string) => void;
  handleConfirmSensory: (recordId: string) => void;
  handleConfirmMemoryEntry: (entryId: string) => void;
  handleRenameState: (stateId: string, label: string) => void;
  handleToggleStateFavorite: (stateId: string) => void;
  handleToggleStateHidden: (stateId: string) => void;
  handleToggleComfortFavorite: (recordId: string) => void;
  handleToggleComfortHidden: (recordId: string) => void;
}

export const useAppShellController = (): AppShellController => {
  const [activeSection, setActiveSection] = useState<AppSection>('help_now');
  const [identity] = useState<AppIdentity>(() => readLocal<AppIdentity>('fg_identity_v2', DEFAULT_IDENTITY));
  const [currentState, setCurrentState] = useState<CurrentState>(() => readLocal<CurrentState>('fg_current_state_v2', makeInitialCurrentState()));
  const [customStates, setCustomStates] = useState<CustomStateLabel[]>(() => readLocal<CustomStateLabel[]>('fg_custom_states_v2', DEFAULT_CUSTOM_STATES));
  const [journalThreads, setJournalThreads] = useState<JournalThread[]>(() => readLocal<JournalThread[]>('fg_journal_threads_v2', makeDefaultThreads()));
  const [supportLog, setSupportLog] = useState<SupportLogEntry[]>(() => readLocal<SupportLogEntry[]>('fg_support_log_v2', []));
  const [learningSignals, setLearningSignals] = useState<LearningSignal[]>(() => readLocal<LearningSignal[]>('fg_learning_signals_v2', []));
  const [sensorySupports, setSensorySupports] = useState<SensorySupportRecord[]>(() => readLocal<SensorySupportRecord[]>('fg_sensory_supports_v2', []));
  const [selectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => { writeLocal('fg_current_state_v2', currentState); }, [currentState]);
  useEffect(() => { writeLocal('fg_custom_states_v2', customStates); }, [customStates]);
  useEffect(() => { writeLocal('fg_support_log_v2', supportLog); }, [supportLog]);
  useEffect(() => { writeLocal('fg_journal_threads_v2', journalThreads); }, [journalThreads]);
  useEffect(() => { writeLocal('fg_learning_signals_v2', learningSignals); }, [learningSignals]);
  useEffect(() => { writeLocal('fg_sensory_supports_v2', sensorySupports); }, [sensorySupports]);

  useEffect(() => {
    const derived = deriveLearningSignals(journalThreads, supportLog);
    setLearningSignals((prev) => {
      const confirmedMap = new Map(prev.map((signal) => [signal.id, signal.confirmed]));
      return derived.map((signal) => ({ ...signal, confirmed: confirmedMap.get(signal.id) ?? false }));
    });

    const derivedSensory = deriveSensorySupports(supportLog);
    setSensorySupports((prev) => {
      const priorMap = new Map(prev.map((record) => [record.id, record]));
      return derivedSensory.map((record) => {
        const prior = priorMap.get(record.id);
        return {
          ...record,
          confirmed: prior?.confirmed ?? record.confirmed,
          favorite: prior?.favorite ?? record.favorite,
          hidden: prior?.hidden ?? record.hidden,
        };
      });
    });
  }, [journalThreads, supportLog]);

  const recentOutcomeSummary = useMemo(() => {
    const latest = supportLog[0];
    if (!latest) return undefined;
    return `${latest.supportTitle} · ${latest.outcome.replace('_', ' ')}`;
  }, [supportLog]);

  const memoryEntries = useMemo(() => buildMemoryVaultEntries(journalThreads), [journalThreads]);
  const memorySummary = useMemo(() => buildMemoryVaultSummary(memoryEntries), [memoryEntries]);
  const patternSummary = useMemo(() => buildPatternReviewSummary(learningSignals, sensorySupports), [learningSignals, sensorySupports]);
  const thresholdSummary = useMemo(() => buildThresholdSummary(learningSignals, sensorySupports), [learningSignals, sensorySupports]);
  const personalizedSupports = useMemo(() => buildPersonalizedSuggestions(currentState.canonicalId, thresholdSummary, sensorySupports), [currentState.canonicalId, thresholdSummary, sensorySupports]);

  const updateCurrentState = (partial: Partial<CurrentState>) => {
    setCurrentState((prev) => ({ ...prev, ...partial, updatedAt: Date.now(), source: partial.source ?? 'user' }));
  };

  const handleSelectState = (stateId: string) => {
    const next = customStates.find((state) => state.id === stateId);
    if (!next) return;
    updateCurrentState({ canonicalId: next.canonicalId, label: next.label, source: 'user' });
  };

  const handleSelectIntensity = (intensity: StateIntensity) => updateCurrentState({ intensity, source: 'user' });

  const handleApplyRouteState = (canonicalId: CurrentState['canonicalId']) => {
    const matching = customStates.find((state) => state.canonicalId === canonicalId && !state.hidden) || customStates.find((state) => state.canonicalId === canonicalId);
    if (!matching) return;
    setActiveSection('help_now');
    updateCurrentState({ canonicalId: matching.canonicalId, label: matching.label, source: 'support_flow' });
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
    const baseThread: JournalThread = {
      id: `thread-${Date.now()}`,
      title: `${currentState.label} check-in`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      startingState: snapshot,
      currentState: snapshot,
      summary: `Started from ${currentState.label.toLowerCase()} · ${currentState.intensity}.`,
      tags: [currentState.canonicalId],
      messages: [{ id: `m-${Date.now()}`, role: 'ibal', text: `Starting from ${currentState.label.toLowerCase()} · ${currentState.intensity}. You can keep this brief. What feels most important to capture right now?`, createdAt: Date.now() }],
      transitions: [],
    };
    const newThread = { ...baseThread, memory: buildThreadMemoryEntry(baseThread) };
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
    setJournalThreads((prev) => prev.map((thread) => {
      if (thread.id !== threadId) return thread;
      const userMessage = { id: `m-${Date.now()}-u`, role: 'user' as const, text, createdAt: Date.now() };
      const ibalMessage = { id: `m-${Date.now()}-i`, role: 'ibal' as const, text: 'Noted. I will treat this as part of the same thread and keep the context connected. After this send, check whether your state still fits.', createdAt: Date.now() + 1 };
      const nextThread: JournalThread = { ...thread, updatedAt: Date.now(), summary: text.length > 120 ? `${text.slice(0, 117)}...` : text, messages: [...thread.messages, userMessage, ibalMessage] };
      return { ...nextThread, memory: buildThreadMemoryEntry(nextThread) };
    }));
  };

  const handleKeepThreadState = (threadId: string) => {
    setJournalThreads((prev) => prev.map((thread) => {
      if (thread.id !== threadId) return thread;
      const nextState = makeStateSnapshot(currentState);
      const transition = { id: `transition-${Date.now()}`, from: thread.currentState, to: nextState, createdAt: Date.now(), source: 'post_send' as const };
      return { ...thread, updatedAt: Date.now(), currentState: nextState, transitions: [...thread.transitions, transition] };
    }));
  };

  const handleApplySuggestedTags = (threadId: string) => {
    setJournalThreads((prev) => prev.map((thread) => {
      if (thread.id !== threadId || !thread.memory) return thread;
      const mergedTags = Array.from(new Set([...thread.tags, ...thread.memory.suggestedTags]));
      return { ...thread, tags: mergedTags, memory: { ...thread.memory, confirmedTags: mergedTags } };
    }));
  };

  const handleConfirmSignal = (signalId: string) => setLearningSignals((prev) => prev.map((signal) => (signal.id === signalId ? { ...signal, confirmed: true } : signal)));
  const handleConfirmSensory = (recordId: string) => setSensorySupports((prev) => prev.map((record) => (record.id === recordId ? { ...record, confirmed: true } : record)));

  const handleConfirmMemoryEntry = (entryId: string) => {
    const threadId = entryId.replace('memory-', '');
    setJournalThreads((prev) => prev.map((thread) => {
      if (thread.id !== threadId || !thread.memory) return thread;
      const mergedTags = Array.from(new Set([...thread.tags, ...thread.memory.confirmedTags]));
      return { ...thread, tags: mergedTags, memory: { ...thread.memory, confirmedTags: mergedTags } };
    }));
  };

  const handleRenameState = (stateId: string, label: string) => {
    const cleaned = label.trimStart();
    setCustomStates((prev) => {
      const target = prev.find((state) => state.id === stateId);
      const nextStates = prev.map((state) => (state.id === stateId ? { ...state, label: cleaned } : state));
      if (target && currentState.canonicalId === target.canonicalId && currentState.label === target.label) {
        setCurrentState((current) => ({ ...current, label: cleaned, updatedAt: Date.now() }));
      }
      return nextStates;
    });
  };

  const handleToggleStateFavorite = (stateId: string) => setCustomStates((prev) => prev.map((state) => (state.id === stateId ? { ...state, favorite: !state.favorite } : state)));
  const handleToggleStateHidden = (stateId: string) => setCustomStates((prev) => prev.map((state) => (state.id === stateId ? { ...state, hidden: !state.hidden } : state)));
  const handleToggleComfortFavorite = (recordId: string) => setSensorySupports((prev) => prev.map((record) => (record.id === recordId ? { ...record, favorite: !record.favorite } : record)));
  const handleToggleComfortHidden = (recordId: string) => setSensorySupports((prev) => prev.map((record) => (record.id === recordId ? { ...record, hidden: !record.hidden } : record)));

  return {
    activeSection,
    identity,
    currentState,
    customStates,
    journalThreads,
    learningSignals,
    sensorySupports,
    selectorOpen,
    recentOutcomeSummary,
    memoryEntries,
    memorySummary,
    patternSummary,
    thresholdSummary,
    personalizedSupports,
    setActiveSection,
    setSelectorOpen,
    handleSelectState,
    handleSelectIntensity,
    handleApplyRouteState,
    handleLogOutcome,
    handleCreateThread,
    handleOpenThread,
    handleSendMessage,
    handleKeepThreadState,
    handleApplySuggestedTags,
    handleConfirmSignal,
    handleConfirmSensory,
    handleConfirmMemoryEntry,
    handleRenameState,
    handleToggleStateFavorite,
    handleToggleStateHidden,
    handleToggleComfortFavorite,
    handleToggleComfortHidden,
  };
};