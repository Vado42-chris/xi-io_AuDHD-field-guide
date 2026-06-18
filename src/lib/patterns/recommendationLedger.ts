import {
  CanonicalStateId,
  PatternEvidenceItem,
  PersonalizedSupportSuggestion,
  RecommendationAvailability,
  RecommendationConfidence,
  RecommendationLedgerItem,
  RecommendationStateTrust,
  SupportLogEntry,
  TransferReviewRecord,
  TransferSafety,
} from '../../types/core';

const ALL_STATES: CanonicalStateId[] = ['steady', 'overloaded', 'activated', 'shut_down', 'in_pain', 'stuck', 'unclear'];

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

const deriveRecoveryScore = (outcomes: Array<{ outcome: SupportLogEntry['outcome'] }>): number => {
  const recent = outcomes.slice(-3);
  return recent.reduce((sum, event) => sum + (event.outcome === 'helped' ? 2 : event.outcome === 'a_little' ? 1 : event.outcome === 'worse' ? -1 : 0), 0);
};

const deriveAvailability = (
  performanceScore: number,
  outcomeHistoryLength: number,
  worseCount: number,
  recoveryScore: number
): RecommendationAvailability => {
  if ((worseCount >= 2 || performanceScore <= -4) && recoveryScore <= 1) return 'avoid_for_now';
  if ((worseCount >= 1 || (outcomeHistoryLength >= 2 && performanceScore < 0)) && recoveryScore < 2) return 'cooling_off';
  if (recoveryScore >= 2 && (performanceScore < 2 || worseCount >= 1)) return 'recovering';
  return 'active';
};

const deriveConfidence = (
  availability: RecommendationAvailability,
  performanceScore: number,
  stability: PersonalizedSupportSuggestion['stability'],
  supportingCount: number
): RecommendationConfidence => {
  if (availability === 'avoid_for_now') return 'low';
  if (performanceScore >= 3) return 'high';
  if (performanceScore <= -2) return 'low';
  if (stability === 'stable') return 'high';
  return supportingCount > 0 ? 'medium' : 'low';
};

const buildStateTrust = (
  recommendationId: string,
  stability: PersonalizedSupportSuggestion['stability'],
  supportingCount: number,
  supportLog: SupportLogEntry[]
): RecommendationStateTrust[] => {
  return ALL_STATES.map((state) => {
    const outcomeHistory = supportLog
      .filter((entry) => entry.recommendationId === recommendationId && entry.stateCanonicalId === state)
      .map((entry) => ({
        id: entry.id,
        outcome: entry.outcome,
        createdAt: entry.createdAt,
        stateLabel: entry.stateLabel,
        supportRoute: entry.supportRoute,
      }));

    const performanceScore = outcomeHistory.reduce((sum, event) => sum + scoreOutcome(event.outcome), 0);
    const worseCount = outcomeHistory.filter((event) => event.outcome === 'worse').length;
    const recoveryScore = deriveRecoveryScore(outcomeHistory);
    const availability = deriveAvailability(performanceScore, outcomeHistory.length, worseCount, recoveryScore);
    const confidence = deriveConfidence(availability, performanceScore, stability, supportingCount);
    const rankScore = performanceScore + recoveryScore + (confidence === 'high' ? 3 : confidence === 'medium' ? 1 : 0) - (availability === 'cooling_off' ? 4 : availability === 'avoid_for_now' ? 8 : 0);

    return {
      state,
      confidence,
      availability,
      performanceScore,
      recoveryScore,
      rankScore,
      outcomeHistory,
    };
  });
};

const deriveTransferSafety = (currentState: CanonicalStateId, stateTrustMap: RecommendationStateTrust[]): { transferSafety: TransferSafety; transferWarning?: string } => {
  const current = stateTrustMap.find((entry) => entry.state === currentState);
  const otherStates = stateTrustMap.filter((entry) => entry.state !== currentState);
  const strongElsewhere = otherStates.some((entry) => entry.availability === 'active' && entry.rankScore >= 3);

  if (!current) {
    return { transferSafety: 'caution', transferWarning: 'No current-state trust lane is available for this recommendation yet.' };
  }

  if ((current.availability === 'avoid_for_now' || current.availability === 'cooling_off') && strongElsewhere) {
    return {
      transferSafety: current.availability === 'avoid_for_now' ? 'avoid' : 'caution',
      transferWarning: `This support appears stronger in other states, but it is ${current.availability.replace('_', ' ')} for ${currentState.replace('_', ' ')}. Avoid transferring trust automatically.`,
    };
  }

  if (current.availability === 'recovering') {
    return {
      transferSafety: 'caution',
      transferWarning: `This support is recovering for ${currentState.replace('_', ' ')}. Use it as a cautious re-test, not as a fully trusted transfer from another state.`,
    };
  }

  if (current.availability === 'avoid_for_now') {
    return {
      transferSafety: 'avoid',
      transferWarning: `This support is currently avoid for now in ${currentState.replace('_', ' ')} even if it performs better elsewhere.`,
    };
  }

  return { transferSafety: 'safe' };
};

const assessTransferReviews = (
  recommendationId: string,
  currentState: CanonicalStateId,
  transferReviews: TransferReviewRecord[],
  supportLog: SupportLogEntry[]
): TransferReviewRecord[] => {
  return transferReviews
    .filter((review) => review.recommendationId === recommendationId && review.currentState === currentState)
    .map((review) => {
      if (review.outcomeAssessment !== 'pending') return review;
      const laterOutcomes = supportLog.filter(
        (entry) => entry.recommendationId === recommendationId && entry.stateCanonicalId === currentState && entry.createdAt >= review.createdAt
      );
      const helped = laterOutcomes.some((entry) => entry.outcome === 'helped' || entry.outcome === 'a_little');
      const worsened = laterOutcomes.some((entry) => entry.outcome === 'worse');
      if (helped) {
        return { ...review, outcomeAssessment: 'justified', assessedAt: laterOutcomes[0]?.createdAt ?? Date.now() };
      }
      if (worsened) {
        return { ...review, outcomeAssessment: 'not_justified', assessedAt: laterOutcomes[0]?.createdAt ?? Date.now() };
      }
      return review;
    });
};

export const buildRecommendationLedger = (
  currentState: CanonicalStateId,
  suggestions: PersonalizedSupportSuggestion[],
  evidenceItems: PatternEvidenceItem[],
  supportLog: SupportLogEntry[] = [],
  transferReviews: TransferReviewRecord[] = []
): RecommendationLedgerItem[] => {
  const relevantEvidence = supportRefsForState(evidenceItems, currentState);
  const supporting = relevantEvidence.filter((item) => item.resolutionStatus === 'active');
  const weakening = relevantEvidence.filter((item) => item.resolutionStatus !== 'active');

  const items = suggestions.map((suggestion, index) => {
    const recommendationId = `recommendation-${currentState}-${index}`;
    const stateTrustMap = buildStateTrust(recommendationId, suggestion.stability, supporting.length, supportLog);
    const currentStateTrust = stateTrustMap.find((entry) => entry.state === currentState)!;
    const transfer = deriveTransferSafety(currentState, stateTrustMap);
    const assessedTransferReviews = assessTransferReviews(recommendationId, currentState, transferReviews, supportLog);

    return {
      id: recommendationId,
      title: suggestion.title,
      state: suggestion.state,
      body: suggestion.body,
      confidence: currentStateTrust.confidence,
      stability: suggestion.stability,
      availability: currentStateTrust.availability,
      transferSafety: transfer.transferSafety,
      transferWarning: transfer.transferWarning,
      reason: suggestion.reason,
      appearedBecause:
        currentStateTrust.availability === 'avoid_for_now'
          ? 'This matched your current state before, but repeated negative outcomes in this same state have pushed it into an avoid-for-now state.'
          : currentStateTrust.availability === 'cooling_off'
            ? 'This matched your current state, but recent mixed or negative outcomes in this state have lowered its priority for now.'
            : currentStateTrust.availability === 'recovering'
              ? 'This had a rough period in this state, but recent better outcomes in the same state are moving it back into consideration.'
              : suggestion.stability === 'stable'
                ? 'It matched active evidence for your current state and did not hit active instability warnings.'
                : 'It matched your current state, but some related evidence is still under review or retired, so it is shown cautiously.',
      supportingEvidence: supporting.flatMap((item) => item.references).slice(0, 4),
      weakeningEvidence: weakening.flatMap((item) => item.references).slice(0, 4),
      outcomeHistory: currentStateTrust.outcomeHistory,
      performanceScore: currentStateTrust.performanceScore,
      rankScore: currentStateTrust.rankScore,
      recoveryScore: currentStateTrust.recoveryScore,
      stateTrustMap,
      transferReviews: assessedTransferReviews,
    };
  });

  return items.sort((a, b) => b.rankScore - a.rankScore);
};