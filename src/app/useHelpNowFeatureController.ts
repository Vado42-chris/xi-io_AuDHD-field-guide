import { Dispatch, SetStateAction, useMemo } from 'react';
import {
  ActiveTrial,
  CurrentState,
  CustomStateLabel,
  PatternEvidenceItem,
  RecommendationLedgerItem,
  RevalidationRecord,
  RevalidationResult,
  SensorySupportRecord,
  StateIntensity,
  SupportLogEntry,
  SupportOutcome,
  TransferDecision,
  TransferReviewRecord,
  TrialReflectionRecord,
} from '../types/core';
import { buildPersonalizedSuggestions } from '../lib/patterns/personalizationThreshold';
import { buildRecommendationLedger } from '../lib/patterns/recommendationLedger';

interface HelpNowFeatureControllerArgs {
  currentState: CurrentState;
  customStates: CustomStateLabel[];
  sensorySupports: SensorySupportRecord[];
  thresholdSummary: Parameters<typeof buildPersonalizedSuggestions>[1];
  evidenceItems: PatternEvidenceItem[];
  supportLog: SupportLogEntry[];
  transferReviews: TransferReviewRecord[];
  revalidationRecords: RevalidationRecord[];
  activeTrial: ActiveTrial | null;
  trialReflections: TrialReflectionRecord[];
  setCurrentState: Dispatch<SetStateAction<CurrentState>>;
  setSupportLog: Dispatch<SetStateAction<SupportLogEntry[]>>;
  setTransferReviews: Dispatch<SetStateAction<TransferReviewRecord[]>>;
  setRevalidationRecords: Dispatch<SetStateAction<RevalidationRecord[]>>;
  setActiveTrial: Dispatch<SetStateAction<ActiveTrial | null>>;
  setTrialReflections: Dispatch<SetStateAction<TrialReflectionRecord[]>>;
  setActiveSection: (section: 'help_now') => void;
}

export interface HelpNowFeatureController {
  recentOutcomeSummary?: string;
  personalizedSupports: ReturnType<typeof buildPersonalizedSuggestions>;
  recommendationLedger: RecommendationLedgerItem[];
  activeTrial: ActiveTrial | null;
  handleSelectState: (stateId: string) => void;
  handleSelectIntensity: (intensity: StateIntensity) => void;
  handleApplyRouteState: (canonicalId: CurrentState['canonicalId']) => void;
  handleStartTrial: (recommendationId: string, supportTitle: string) => void;
  handleClearTrial: () => void;
  handleLogOutcome: (supportTitle: string, supportRoute: string, outcome: SupportOutcome, recommendationId?: string) => void;
  handleSaveTrialReflection: (supportTitle: string, outcome: SupportOutcome, prompt: TrialReflectionRecord['prompt'], note: string, recommendationId?: string) => void;
  handleReviewTransfer: (recommendationId: string, transferSafety: RecommendationLedgerItem['transferSafety'], transferWarning: string | undefined, decision: TransferDecision, reason: string) => void;
  handleRevalidateSupport: (recommendationId: string, result: RevalidationResult, note: string) => void;
}

export const useHelpNowFeatureController = ({
  currentState,
  customStates,
  sensorySupports,
  thresholdSummary,
  evidenceItems,
  supportLog,
  transferReviews,
  revalidationRecords,
  activeTrial,
  trialReflections,
  setCurrentState,
  setSupportLog,
  setTransferReviews,
  setRevalidationRecords,
  setActiveTrial,
  setTrialReflections,
  setActiveSection,
}: HelpNowFeatureControllerArgs): HelpNowFeatureController => {
  const updateCurrentState = (partial: Partial<CurrentState>) => {
    setCurrentState((prev) => ({ ...prev, ...partial, updatedAt: Date.now(), source: partial.source ?? 'user' }));
  };

  const recentOutcomeSummary = useMemo(() => {
    const latest = supportLog[0];
    if (!latest) return undefined;
    return `${latest.supportTitle} · ${latest.outcome.replace('_', ' ')}`;
  }, [supportLog]);

  const personalizedSupports = useMemo(
    () => buildPersonalizedSuggestions(currentState.canonicalId, thresholdSummary, sensorySupports),
    [currentState.canonicalId, thresholdSummary, sensorySupports]
  );

  const recommendationLedger = useMemo(
    () => buildRecommendationLedger(currentState.canonicalId, personalizedSupports, evidenceItems, supportLog, transferReviews, revalidationRecords),
    [currentState.canonicalId, personalizedSupports, evidenceItems, supportLog, transferReviews, revalidationRecords, trialReflections]
  );

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

  const handleStartTrial = (recommendationId: string, supportTitle: string) => {
    setActiveTrial({
      recommendationId,
      supportTitle,
      stateCanonicalId: currentState.canonicalId,
      startedAt: Date.now(),
    });
  };

  const handleClearTrial = () => setActiveTrial(null);

  const handleLogOutcome = (supportTitle: string, supportRoute: string, outcome: SupportOutcome, recommendationId?: string) => {
    const entry: SupportLogEntry = {
      id: `${Date.now()}`,
      stateLabel: currentState.label,
      stateCanonicalId: currentState.canonicalId,
      supportTitle,
      supportRoute,
      recommendationId,
      outcome,
      createdAt: Date.now(),
    };
    setSupportLog((prev) => [entry, ...prev].slice(0, 40));
    if (activeTrial && (!recommendationId || activeTrial.recommendationId === recommendationId)) {
      setActiveTrial(null);
    }
  };

  const handleSaveTrialReflection = (
    supportTitle: string,
    outcome: SupportOutcome,
    prompt: TrialReflectionRecord['prompt'],
    note: string,
    recommendationId?: string
  ) => {
    if (!note.trim()) return;
    const record: TrialReflectionRecord = {
      id: `reflection-${Date.now()}`,
      recommendationId,
      supportTitle,
      stateCanonicalId: currentState.canonicalId,
      outcome,
      prompt,
      note: note.trim(),
      createdAt: Date.now(),
    };
    setTrialReflections((prev) => [record, ...prev].slice(0, 80));
  };

  const handleReviewTransfer = (
    recommendationId: string,
    transferSafety: RecommendationLedgerItem['transferSafety'],
    transferWarning: string | undefined,
    decision: TransferDecision,
    reason: string
  ) => {
    const record: TransferReviewRecord = {
      id: `transfer-${Date.now()}`,
      recommendationId,
      currentState: currentState.canonicalId,
      transferSafety,
      transferWarning,
      decision,
      reason: reason || undefined,
      createdAt: Date.now(),
      outcomeAssessment: 'pending',
    };
    setTransferReviews((prev) => [record, ...prev].slice(0, 60));
  };

  const handleRevalidateSupport = (recommendationId: string, result: RevalidationResult, note: string) => {
    const record: RevalidationRecord = {
      id: `recheck-${Date.now()}`,
      recommendationId,
      currentState: currentState.canonicalId,
      createdAt: Date.now(),
      result,
      note: note || undefined,
    };
    setRevalidationRecords((prev) => [record, ...prev].slice(0, 60));
  };

  return {
    recentOutcomeSummary,
    personalizedSupports,
    recommendationLedger,
    activeTrial,
    handleSelectState,
    handleSelectIntensity,
    handleApplyRouteState,
    handleStartTrial,
    handleClearTrial,
    handleLogOutcome,
    handleSaveTrialReflection,
    handleReviewTransfer,
    handleRevalidateSupport,
  };
};