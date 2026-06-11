import { Dispatch, SetStateAction, useMemo } from 'react';
import {
  CurrentState,
  CustomStateLabel,
  SensorySupportRecord,
  StateIntensity,
  SupportLogEntry,
  SupportOutcome,
} from '../types/core';
import { buildPersonalizedSuggestions } from '../lib/patterns/personalizationThreshold';

interface HelpNowFeatureControllerArgs {
  currentState: CurrentState;
  customStates: CustomStateLabel[];
  sensorySupports: SensorySupportRecord[];
  thresholdSummary: Parameters<typeof buildPersonalizedSuggestions>[1];
  supportLog: SupportLogEntry[];
  setCurrentState: Dispatch<SetStateAction<CurrentState>>;
  setSupportLog: Dispatch<SetStateAction<SupportLogEntry[]>>;
  setActiveSection: (section: 'help_now') => void;
}

export interface HelpNowFeatureController {
  recentOutcomeSummary?: string;
  personalizedSupports: ReturnType<typeof buildPersonalizedSuggestions>;
  handleSelectState: (stateId: string) => void;
  handleSelectIntensity: (intensity: StateIntensity) => void;
  handleApplyRouteState: (canonicalId: CurrentState['canonicalId']) => void;
  handleLogOutcome: (supportTitle: string, supportRoute: string, outcome: SupportOutcome) => void;
}

export const useHelpNowFeatureController = ({
  currentState,
  customStates,
  sensorySupports,
  thresholdSummary,
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

  return {
    recentOutcomeSummary,
    personalizedSupports,
    handleSelectState,
    handleSelectIntensity,
    handleApplyRouteState,
    handleLogOutcome,
  };
};