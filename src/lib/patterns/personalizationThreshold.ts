import {
  CanonicalStateId,
  LearningSignal,
  PersonalizedSupportSuggestion,
  SensorySupportRecord,
  ThresholdSummary,
} from '../../types/core';

export const buildThresholdSummary = (
  signals: LearningSignal[],
  sensorySupports: SensorySupportRecord[]
): ThresholdSummary => {
  const confirmedEvidence =
    signals.filter((s) => s.confirmed).length +
    sensorySupports.filter((s) => s.confirmed).length;

  const contradictionCount = sensorySupports.reduce((sum, record) => {
    return sum + (record.outcomeCounts.helped > 0 && record.outcomeCounts.worse > 0 ? 1 : 0);
  }, 0);

  const targetEvidence = 6;
  const canPersonalize = confirmedEvidence >= targetEvidence && contradictionCount <= 1;

  const readiness: ThresholdSummary['readiness'] = canPersonalize
    ? 'ready'
    : confirmedEvidence >= 3
      ? 'warming_up'
      : 'not_ready';

  const message = canPersonalize
    ? 'The app has enough confirmed pattern evidence to start offering tailored support suggestions.'
    : readiness === 'warming_up'
      ? 'The app is learning, but tailored suggestions should still stay cautious and limited.'
      : 'The app is still gathering evidence, so support should remain broad and non-tailored.';

  return {
    readiness,
    confirmedEvidence,
    targetEvidence,
    contradictionCount,
    canPersonalize,
    message,
  };
};

export const buildPersonalizedSuggestions = (
  currentState: CanonicalStateId,
  threshold: ThresholdSummary,
  sensorySupports: SensorySupportRecord[]
): PersonalizedSupportSuggestion[] => {
  if (!threshold.canPersonalize) return [];

  return sensorySupports
    .filter((record) => record.confirmed && !record.hidden && record.helpfulStates.includes(currentState))
    .map((record) => ({
      title: record.label,
      body: `This appears to help most when you are ${currentState.replace('_', ' ')}. Try it first before adding more complexity.`,
      reason: `Confirmed support with matching state history and positive outcomes.`,
      state: currentState,
    }))
    .slice(0, 3);
};