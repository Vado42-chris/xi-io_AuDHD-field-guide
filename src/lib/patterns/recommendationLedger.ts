import {
  CanonicalStateId,
  PatternEvidenceItem,
  PersonalizedSupportSuggestion,
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

export const buildRecommendationLedger = (
  currentState: CanonicalStateId,
  suggestions: PersonalizedSupportSuggestion[],
  evidenceItems: PatternEvidenceItem[],
  supportLog: SupportLogEntry[] = []
): RecommendationLedgerItem[] => {
  const relevantEvidence = supportRefsForState(evidenceItems, currentState);
  const supporting = relevantEvidence.filter((item) => item.resolutionStatus === 'active');
  const weakening = relevantEvidence.filter((item) => item.resolutionStatus !== 'active');

  return suggestions.map((suggestion, index) => {
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

    const confidence = performanceScore <= -2
      ? 'low'
      : performanceScore >= 3
        ? 'high'
        : suggestion.stability === 'stable'
          ? 'high'
          : supporting.length > 0
            ? 'medium'
            : 'low';

    return {
      id: recommendationId,
      title: suggestion.title,
      state: suggestion.state,
      body: suggestion.body,
      confidence,
      stability: suggestion.stability,
      reason: suggestion.reason,
      appearedBecause:
        suggestion.stability === 'stable'
          ? 'It matched active evidence for your current state and did not hit active instability warnings.'
          : 'It matched your current state, but some related evidence is still under review or retired, so it is shown cautiously.',
      supportingEvidence: supporting.flatMap((item) => item.references).slice(0, 4),
      weakeningEvidence: weakening.flatMap((item) => item.references).slice(0, 4),
      outcomeHistory,
      performanceScore,
    };
  });
};