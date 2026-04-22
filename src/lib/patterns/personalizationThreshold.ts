import {
  CanonicalStateId,
  LearningSignal,
  PatternEvidenceItem,
  PersonalizedSupportSuggestion,
  SensorySupportRecord,
  ThresholdSummary,
} from '../../types/core';

export const buildThresholdSummary = (
  signals: LearningSignal[],
  sensorySupports: SensorySupportRecord[],
  evidenceItems: PatternEvidenceItem[] = []
): ThresholdSummary => {
  const confirmedEvidence =
    signals.filter((s) => s.confirmed).length +
    sensorySupports.filter((s) => s.confirmed).length;

  const contradictionCount = sensorySupports.reduce((sum, record) => {
    return sum + (record.outcomeCounts.helped > 0 && record.outcomeCounts.worse > 0 ? 1 : 0);
  }, 0);

  const unstableEvidenceCount = evidenceItems.filter((item) => item.resolutionStatus === 'under_review').length;
  const retiredEvidenceCount = evidenceItems.filter((item) => item.resolutionStatus === 'retired').length;

  const targetEvidence = 6;
  const effectiveEvidence = Math.max(0, confirmedEvidence - unstableEvidenceCount - retiredEvidenceCount);
  const canPersonalize = effectiveEvidence >= targetEvidence && contradictionCount <= 1 && unstableEvidenceCount === 0;

  const readiness: ThresholdSummary['readiness'] = canPersonalize
    ? 'ready'
    : effectiveEvidence >= 3
      ? 'warming_up'
      : 'not_ready';

  const suggestionStability: ThresholdSummary['suggestionStability'] = unstableEvidenceCount > 0 ? 'cautious' : 'stable';

  const message = canPersonalize
    ? suggestionStability === 'stable'
      ? 'The app has enough confirmed and stable pattern evidence to offer tailored support suggestions.'
      : 'The app can suggest supports, but some evidence is still unstable, so suggestions should stay cautious.'
    : readiness === 'warming_up'
      ? 'The app is learning, but unstable or retired evidence is weakening readiness, so suggestions should stay cautious and limited.'
      : 'The app is still gathering evidence, or active evidence has weakened, so support should remain broad and non-tailored.';

  return {
    readiness,
    confirmedEvidence,
    targetEvidence,
    contradictionCount,
    unstableEvidenceCount,
    retiredEvidenceCount,
    canPersonalize,
    suggestionStability,
    message,
  };
};

export const buildPersonalizedSuggestions = (
  currentState: CanonicalStateId,
  threshold: ThresholdSummary,
  sensorySupports: SensorySupportRecord[]
): PersonalizedSupportSuggestion[] => {
  if (!threshold.canPersonalize && threshold.readiness === 'not_ready') return [];

  const cautious = threshold.suggestionStability === 'cautious' || !threshold.canPersonalize;

  return sensorySupports
    .filter((record) => record.confirmed && !record.hidden && record.helpfulStates.includes(currentState))
    .map((record) => ({
      title: record.label,
      body: cautious
        ? `This may help when you are ${currentState.replace('_', ' ')}, but the supporting evidence is still being reviewed. Try it gently and avoid overcommitting to it yet.`
        : `This appears to help most when you are ${currentState.replace('_', ' ')}. Try it first before adding more complexity.`,
      reason: cautious
        ? 'Matched support history exists, but some related evidence is still unstable or under review.'
        : 'Confirmed support with matching state history and positive outcomes.',
      state: currentState,
      stability: cautious ? 'cautious' : 'stable',
    }))
    .slice(0, 3);
};