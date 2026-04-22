import { useEffect, useState } from 'react';
import {
  ActiveTrial,
  AppIdentity,
  AppSection,
  CurrentState,
  CustomStateLabel,
  DEFAULT_CUSTOM_STATES,
  DEFAULT_IDENTITY,
  EvidenceContribution,
  JournalThread,
  LearningSignal,
  MemoryEntryStatus,
  MemoryVaultEntry,
  MemoryVaultSummary,
  PatternEvidenceItem,
  PatternEvidenceSummary,
  PatternResolutionStatus,
  PatternReviewSummary,
  RecommendationLedgerItem,
  RevalidationRecord,
  RevalidationResult,
  SensorySupportRecord,
  StateIntensity,
  SupportAttempt,
  SupportLogEntry,
  SupportOutcome,
  ThresholdSummary,
  TransferDecision,
  TransferReviewRecord,
  TrialReflectionRecord,
} from '../types/core';
import { readLocal, writeLocal } from '../lib/storage/localStore';
import { deriveLearningSignals, deriveSensorySupports } from '../lib/patterns/learningSignals';
import { deriveEvidenceContributions } from '../lib/patterns/evidenceContributions';
import { makeDefaultThreads, makeInitialCurrentState } from './appShellDefaults';
import { useJournalFeatureController } from './useJournalFeatureController';
import { useLearningFeatureController } from './useLearningFeatureController';
import { useHelpNowFeatureController } from './useHelpNowFeatureController';
import { useCustomizeFeatureController } from './useCustomizeFeatureController';

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
  activeTrial: ActiveTrial | null;
  activeAttempt: SupportAttempt | null;
  trialReflections: TrialReflectionRecord[];
  evidenceContributions: EvidenceContribution[];
  memoryEntries: MemoryVaultEntry[];
  memorySummary: MemoryVaultSummary;
  evidenceItems: PatternEvidenceItem[];
  evidenceSummary: PatternEvidenceSummary;
  patternSummary: PatternReviewSummary;
  thresholdSummary: ThresholdSummary;
  personalizedSupports: ReturnType<typeof useHelpNowFeatureController>['personalizedSupports'];
  recommendationLedger: RecommendationLedgerItem[];
  setActiveSection: (section: AppSection) => void;
  setSelectorOpen: (open: boolean) => void;
  handleSelectState: (stateId: string) => void;
  handleSelectIntensity: (intensity: StateIntensity) => void;
  handleApplyRouteState: (canonicalId: CurrentState['canonicalId']) => void;
  handleStartTrial: (recommendationId: string, supportTitle: string) => void;
  handleClearTrial: () => void;
  handleLogOutcome: (supportTitle: string, supportRoute: string, outcome: SupportOutcome, recommendationId?: string) => void;
  handleSaveTrialReflection: (supportTitle: string, outcome: SupportOutcome, prompt: TrialReflectionRecord['prompt'], note: string, recommendationId?: string) => void;
  handleReviewTransfer: (recommendationId: string, transferSafety: RecommendationLedgerItem['transferSafety'], transferWarning: string | undefined, decision: TransferDecision, reason: string) => void;
  handleRevalidateSupport: (recommendationId: string, result: RevalidationResult, note: string) => void;
  handleCreateThread: () => void;
  handleOpenThread: (threadId: string) => void;
  handleSendMessage: (threadId: string, text: string) => void;
  handleKeepThreadState: (threadId: string) => void;
  handleApplySuggestedTags: (threadId: string) => void;
  handleConfirmSignal: (signalId: string) => void;
  handleConfirmSensory: (recordId: string) => void;
  handleConfirmMemoryEntry: (entryId: string) => void;
  handleToggleEvidenceContested: (itemId: string) => void;
  handleResolveEvidence: (itemId: string, nextStatus: PatternResolutionStatus, note: string) => void;
  handleSaveMemoryEntry: (entryId: string, summary: string, confirmedTags: string[], status: MemoryEntryStatus, notes: string) => void;
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
  const [transferReviews, setTransferReviews] = useState<TransferReviewRecord[]>(() => readLocal<TransferReviewRecord[]>('fg_transfer_reviews_v1', []));
  const [revalidationRecords, setRevalidationRecords] = useState<RevalidationRecord[]>(() => readLocal<RevalidationRecord[]>('fg_revalidation_records_v1', []));
  const [activeAttempt, setActiveAttempt] = useState<SupportAttempt | null>(() => readLocal<SupportAttempt | null>('fg_active_attempt_v1', null));
  const [trialReflections, setTrialReflections] = useState<TrialReflectionRecord[]>(() => readLocal<TrialReflectionRecord[]>('fg_trial_reflections_v1', []));
  const [evidenceContributions, setEvidenceContributions] = useState<EvidenceContribution[]>(() => readLocal<EvidenceContribution[]>('fg_evidence_contributions_v1', []));
  const [learningSignals, setLearningSignals] = useState<LearningSignal[]>(() => readLocal<LearningSignal[]>('fg_learning_signals_v2', []));
  const [sensorySupports, setSensorySupports] = useState<SensorySupportRecord[]>(() => readLocal<SensorySupportRecord[]>('fg_sensory_supports_v2', []));
  const [selectorOpen, setSelectorOpen] = useState(false);

  const activeTrial: ActiveTrial | null = activeAttempt
    ? {
        recommendationId: activeAttempt.recommendationId ?? '',
        supportTitle: activeAttempt.supportTitle,
        stateCanonicalId: activeAttempt.stateCanonicalId,
        startedAt: activeAttempt.startedAt,
      }
    : null;

  useEffect(() => { writeLocal('fg_current_state_v2', currentState); }, [currentState]);
  useEffect(() => { writeLocal('fg_custom_states_v2', customStates); }, [customStates]);
  useEffect(() => { writeLocal('fg_support_log_v2', supportLog); }, [supportLog]);
  useEffect(() => { writeLocal('fg_transfer_reviews_v1', transferReviews); }, [transferReviews]);
  useEffect(() => { writeLocal('fg_revalidation_records_v1', revalidationRecords); }, [revalidationRecords]);
  useEffect(() => { writeLocal('fg_active_attempt_v1', activeAttempt); }, [activeAttempt]);
  useEffect(() => { writeLocal('fg_trial_reflections_v1', trialReflections); }, [trialReflections]);
  useEffect(() => { writeLocal('fg_evidence_contributions_v1', evidenceContributions); }, [evidenceContributions]);
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

  useEffect(() => {
    setEvidenceContributions(deriveEvidenceContributions(supportLog, trialReflections, revalidationRecords));
  }, [supportLog, trialReflections, revalidationRecords]);

  const journalFeature = useJournalFeatureController({
    currentState,
    setJournalThreads,
    setActiveSection: () => setActiveSection('journal'),
  });

  const learningFeature = useLearningFeatureController({
    journalThreads,
    learningSignals,
    sensorySupports,
    supportLog,
  });

  const helpNowFeature = useHelpNowFeatureController({
    currentState,
    customStates,
    sensorySupports,
    thresholdSummary: learningFeature.thresholdSummary,
    evidenceItems: learningFeature.evidenceItems,
    supportLog,
    transferReviews,
    revalidationRecords,
    activeAttempt,
    trialReflections,
    setCurrentState,
    setSupportLog,
    setTransferReviews,
    setRevalidationRecords,
    setActiveAttempt,
    setTrialReflections,
    setActiveSection: () => setActiveSection('help_now'),
  });

  const customizeFeature = useCustomizeFeatureController({
    currentState,
    setCurrentState,
    setCustomStates,
    setSensorySupports,
  });

  const handleConfirmSignal = (signalId: string) => setLearningSignals((prev) => prev.map((signal) => (signal.id === signalId ? { ...signal, confirmed: true } : signal)));
  const handleConfirmSensory = (recordId: string) => setSensorySupports((prev) => prev.map((record) => (record.id === recordId ? { ...record, confirmed: true } : record)));

  return {
    activeSection,
    identity,
    currentState,
    customStates,
    journalThreads,
    learningSignals,
    sensorySupports,
    selectorOpen,
    recentOutcomeSummary: helpNowFeature.recentOutcomeSummary,
    activeTrial,
    activeAttempt,
    trialReflections,
    evidenceContributions,
    memoryEntries: learningFeature.memoryEntries,
    memorySummary: learningFeature.memorySummary,
    evidenceItems: learningFeature.evidenceItems,
    evidenceSummary: learningFeature.evidenceSummary,
    patternSummary: learningFeature.patternSummary,
    thresholdSummary: learningFeature.thresholdSummary,
    personalizedSupports: helpNowFeature.personalizedSupports,
    recommendationLedger: helpNowFeature.recommendationLedger,
    setActiveSection,
    setSelectorOpen,
    handleSelectState: helpNowFeature.handleSelectState,
    handleSelectIntensity: helpNowFeature.handleSelectIntensity,
    handleApplyRouteState: helpNowFeature.handleApplyRouteState,
    handleStartTrial: helpNowFeature.handleStartTrial,
    handleClearTrial: helpNowFeature.handleClearTrial,
    handleLogOutcome: helpNowFeature.handleLogOutcome,
    handleSaveTrialReflection: helpNowFeature.handleSaveTrialReflection,
    handleReviewTransfer: helpNowFeature.handleReviewTransfer,
    handleRevalidateSupport: helpNowFeature.handleRevalidateSupport,
    handleCreateThread: journalFeature.handleCreateThread,
    handleOpenThread: journalFeature.handleOpenThread,
    handleSendMessage: journalFeature.handleSendMessage,
    handleKeepThreadState: journalFeature.handleKeepThreadState,
    handleApplySuggestedTags: journalFeature.handleApplySuggestedTags,
    handleConfirmSignal,
    handleConfirmSensory,
    handleConfirmMemoryEntry: journalFeature.handleConfirmMemoryEntry,
    handleToggleEvidenceContested: learningFeature.handleToggleEvidenceContested,
    handleResolveEvidence: learningFeature.handleResolveEvidence,
    handleSaveMemoryEntry: journalFeature.handleSaveMemoryEntry,
    handleRenameState: customizeFeature.handleRenameState,
    handleToggleStateFavorite: customizeFeature.handleToggleStateFavorite,
    handleToggleStateHidden: customizeFeature.handleToggleStateHidden,
    handleToggleComfortFavorite: customizeFeature.handleToggleComfortFavorite,
    handleToggleComfortHidden: customizeFeature.handleToggleComfortHidden,
  };
};