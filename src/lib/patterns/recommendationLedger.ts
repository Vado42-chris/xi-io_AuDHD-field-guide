import {
  CanonicalStateId,
  PatternEvidenceItem,
  PersonalizedSupportSuggestion,
  RecommendationAvailability,
  RecommendationLedgerItem,
  SupportLogEntry,
} from '../../types/core';

const supportRefsForState = (items: PatternEvidenceItem[], state: CanonicalStateId) => {
  const normalized = state.replace('_', ' ');
  return items.filter((item) =>
    item.references.some((ref) => ref.detail.toLowerCase().includes(normalized)) ||
    item.label.toLowerCase().includes(normalized)
  );
};

const scoreOutcome = (outcome: SupportLogEntry['outcome']): number => {
  switch (outcome) {
    case 'helped': return 2;
    case 'a_little': return 1;
    case 'worse': return -2;
    case 'no_change': return 0;
    case 'skipped':
    default:
      return 0;
  }
};

const deriveAvailability = (performanceScore: number, outcomeHistoryLength: number, worseCount: number): RecommendationAvailability => {
  if (worseCount >= 2 || performanceScore <= -4) return 'avoid_for_now';
  if (worseCount >= 1 || (outcomeHistoryLength >= 2 && performanceScore < 0)) return 'cooling_off';
  return 'active';
};

export const buildRecommendationLedger = (
  currentState: CanonicalStateId,
  suggestions: PersonalizedSupportSuggestion[],
  evidenceItems: PatternEvidenceItem[],
  supportLog: SupportLogEntry[] = []
): RecommendationLedgerItem[] => {
  const relevantEvidence = supportRefsForState(evidenceItems, currentState);
  const supporting = relevantEvidence.filter((item) => item.resolutionStatus === 'active');
  const weakening = relevantEvidence.filter((item) => item.resolutionStatus !== 'active');

  const items = suggestions.map((suggestion, index) => {
    const recommendationId = `recommendation-${currentState}-${index}`;
    const outcomeHistory = supportLog
      .filter((entry) => entry.recommendationId === recommendationId)
      .map((entry) => ({
        id: entry.id,
        outcome: entry.outcome,
        createdAt: entry.createdAt,
        stateLabel: entry.stateLabel,
        supportRoute: entry.supportRoute,
      }));

    const performanceScore = outcomeHistory.reduce((sum, event) => sum + scoreOutcome(event.outcome), 0);
    const worseCount = outcomeHistory.filter((event) => event.outcome === 'worse').length;
    const availability = deriveAvailability(performanceScore, outcomeHistory.length, worseCount);

    const confidence = availability === 'avoid_for_now'
      ? 'low'
      : performanceScore >= 3
        ? 'high'
        : performanceScore <= -2
          ? 'low'
          : suggestion.stability === 'stable'
            ? 'high'
            : supporting.length > 0
              ? 'medium'
              : 'low';

    const rankScore = performanceScore + (confidence === 'high' ? 3 : confidence === 'medium' ? 1 : 0) - (availability === 'cooling_off' ? 4 : availability === 'avoid_for_now' ? 8 : 0);

    return {
      id: recommendationId,
      title: suggestion.title,
      state: suggestion.state,
      body: suggestion.body,
      confidence,
      stability: suggestion.stability,
      availability,
      reason: suggestion.reason,
      appearedBecause:
        availability === 'avoid_for_now'
          ? 'This matched your state, but repeated negative outcomes have pushed it into an avoid-for-now state.'
          : availability === 'cooling_off'
            ? 'This matched your state, but recent mixed or negative outcomes have lowered its priority for now.'
            : suggestion.stability === 'stable'
              ? 'It matched active evidence for your current state and did not hit active instability warnings.'
              : 'It matched your current state, but some related evidence is still under review or retired, so it is shown cautiously.',
      supportingEvidence: supporting.flatMap((item) => item.references).slice(0, 4),
      weakeningEvidence: weakening.flatMap((item) => item.references).slice(0, 4),
      outcomeHistory,
      performanceScore,
      rankScore,
    };
  });

  return items.sort((a, b) => b.rankScore - a.rankScore);
};