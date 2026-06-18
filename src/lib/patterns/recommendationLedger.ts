import {
  CanonicalStateId,
  PatternEvidenceItem,
  PersonalizedSupportSuggestion,
  RecommendationLedgerItem,
} from '../../types/core';

const supportRefsForState = (items: PatternEvidenceItem[], state: CanonicalStateId) => {
  const normalized = state.replace('_', ' ');
  return items.filter((item) =>
    item.references.some((ref) => ref.detail.toLowerCase().includes(normalized)) ||
    item.label.toLowerCase().includes(normalized)
  );
};

export const buildRecommendationLedger = (
  currentState: CanonicalStateId,
  suggestions: PersonalizedSupportSuggestion[],
  evidenceItems: PatternEvidenceItem[]
): RecommendationLedgerItem[] => {
  const relevantEvidence = supportRefsForState(evidenceItems, currentState);
  const supporting = relevantEvidence.filter((item) => item.resolutionStatus === 'active');
  const weakening = relevantEvidence.filter((item) => item.resolutionStatus !== 'active');

  return suggestions.map((suggestion, index) => ({
    id: `recommendation-${currentState}-${index}`,
    title: suggestion.title,
    state: suggestion.state,
    body: suggestion.body,
    confidence: suggestion.stability === 'stable' ? 'high' : supporting.length > 0 ? 'medium' : 'low',
    stability: suggestion.stability,
    reason: suggestion.reason,
    appearedBecause:
      suggestion.stability === 'stable'
        ? 'It matched active evidence for your current state and did not hit active instability warnings.'
        : 'It matched your current state, but some related evidence is still under review or retired, so it is shown cautiously.',
    supportingEvidence: supporting.flatMap((item) => item.references).slice(0, 4),
    weakeningEvidence: weakening.flatMap((item) => item.references).slice(0, 4),
  }));
};