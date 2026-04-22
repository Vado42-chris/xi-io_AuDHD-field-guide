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
import { buildPersonalizedSuggestions } from '../lib/patterns/personalizationThreshold';
import { makeDefaultThreads, makeInitialCurrentState } from './appShellDefaults';
import { useJournalFeatureController } from './useJournalFeatureController';
import { useLearningFeatureController } from './useLearningFeatureController';

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

  const journalFeature = useJournalFeatureController({
    currentState,
    setJournalThreads,
    setActiveSection: () => setActiveSection('journal'),
  });

  const learningFeature = useLearningFeatureController({
    journalThreads,
    learningSignals,
    sensorySupports,
  });

  const personalizedSupports = useMemo(
    () => buildPersonalizedSuggestions(currentState.canonicalId, learningFeature.thresholdSummary, sensorySupports),
    [currentState.canonicalId, learningFeature.thresholdSummary, sensorySupports]
  );

  const handleConfirmSignal = (signalId: string) => setLearningSignals((prev) => prev.map((signal) => (signal.id === signalId ? { ...signal, confirmed: true } : signal)));
  const handleConfirmSensory = (recordId: string) => setSensorySupports((prev) => prev.map((record) => (record.id === recordId ? { ...record, confirmed: true } : record)));

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
    memoryEntries: learningFeature.memoryEntries,
    memorySummary: learningFeature.memorySummary,
    patternSummary: learningFeature.patternSummary,
    thresholdSummary: learningFeature.thresholdSummary,
    personalizedSupports,
    setActiveSection,
    setSelectorOpen,
    handleSelectState,
    handleSelectIntensity,
    handleApplyRouteState,
    handleLogOutcome,
    handleCreateThread: journalFeature.handleCreateThread,
    handleOpenThread: journalFeature.handleOpenThread,
    handleSendMessage: journalFeature.handleSendMessage,
    handleKeepThreadState: journalFeature.handleKeepThreadState,
    handleApplySuggestedTags: journalFeature.handleApplySuggestedTags,
    handleConfirmSignal,
    handleConfirmSensory,
    handleConfirmMemoryEntry: journalFeature.handleConfirmMemoryEntry,
    handleRenameState,
    handleToggleStateFavorite,
    handleToggleStateHidden,
    handleToggleComfortFavorite,
    handleToggleComfortHidden,
  };
};