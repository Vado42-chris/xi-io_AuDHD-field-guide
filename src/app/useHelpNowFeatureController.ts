import { Dispatch, SetStateAction, useMemo } from 'react';
import {
  CurrentState,
  CustomStateLabel,
  PatternEvidenceItem,
  RecommendationLedgerItem,
  SensorySupportRecord,
  StateIntensity,
  SupportLogEntry,
  SupportOutcome,
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
  setCurrentState: Dispatch<SetStateAction<CurrentState>>;
  setSupportLog: Dispatch<SetStateAction<SupportLogEntry[]>>;
  setActiveSection: (section: 'help_now') => void;
}

export interface HelpNowFeatureController {
  recentOutcomeSummary?: string;
  personalizedSupports: ReturnType<typeof buildPersonalizedSuggestions>;
  recommendationLedger: RecommendationLedgerItem[];
  handleSelectState: (stateId: string) => void;
  handleSelectIntensity: (intensity: StateIntensity) => void;
  handleApplyRouteState: (canonicalId: CurrentState['canonicalId']) => void;
  handleLogOutcome: (supportTitle: string, supportRoute: string, outcome: SupportOutcome, recommendationId?: string) => void;
}

export const useHelpNowFeatureController = ({
  currentState,
  customStates,
  sensorySupports,
  thresholdSummary,
  evidenceItems,
  supportLog,
  setCurrentState,
  setSupportLog,
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
    () => buildRecommendationLedger(currentState.canonicalId, personalizedSupports, evidenceItems, supportLog),
    [currentState.canonicalId, personalizedSupports, evidenceItems, supportLog]
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
  };

  return {
    recentOutcomeSummary,
    personalizedSupports,
    recommendationLedger,
    handleSelectState,
    handleSelectIntensity,
    handleApplyRouteState,
    handleLogOutcome,
  };
};