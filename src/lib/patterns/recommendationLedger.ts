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
  TrustMaturity,
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

const deriveTransferLearning = (reviews: TransferReviewRecord[]) => {
  const justified = reviews.filter((review) => review.outcomeAssessment === 'justified').length;
  const notJustified = reviews.filter((review) => review.outcomeAssessment === 'not_justified').length;
  const transferLearningScore = justified - notJustified;
  const learnedTransferTrust = justified * 2 - notJustified * 2;
  return { transferLearningScore, learnedTransferTrust };
};

const deriveTrustWeights = (performanceScore: number, learnedTransferTrust: number, normalUseCount: number) => {
  const rawDirect = Math.max(1, Math.abs(performanceScore) + Math.max(2, normalUseCount));
  const retryCap = Math.max(1, Math.floor(rawDirect * 0.5));
  const rawTransfer = Math.min(retryCap, Math.abs(learnedTransferTrust));
  const total = rawDirect + rawTransfer;
  const directTrustWeight = rawDirect;
  const transferTrustWeight = rawTransfer;
  const directTrustPercent = Math.round((directTrustWeight / total) * 100);
  const transferTrustPercent = 100 - directTrustPercent;
  return {
    directTrustWeight,
    transferTrustWeight,
    directTrustPercent,
    transferTrustPercent,
  };
};

const deriveTrustMaturity = (normalUseCount: number, directTrustPercent: number, transferTrustPercent: number): { trustMaturity: TrustMaturity; maturitySummary: string } => {
  if (normalUseCount >= 4 && directTrustPercent >= 70) {
    return {
      trustMaturity: 'proven_in_normal_use',
      maturitySummary: 'This now looks proven by normal use in this same state.',
    };
  }
  if (transferTrustPercent >= 50 || normalUseCount <= 1) {
    return {
      trustMaturity: 'mostly_retry_based',
      maturitySummary: 'This is still leaning heavily on careful retries, not enough normal use yet.',
    };
  }
  return {
    trustMaturity: 'blended',
    maturitySummary: 'This is part proven by normal use and part shaped by careful retries.',
  };
};

const deriveAvailability = (
  performanceScore: number,
  outcomeHistoryLength: number,
  worseCount: number,
  recoveryScore: number,
  learnedTransferTrust: number
): RecommendationAvailability => {
  const adjustedPerformance = performanceScore + learnedTransferTrust;
  if ((worseCount >= 2 || adjustedPerformance <= -4) && recoveryScore <= 1) return 'avoid_for_now';
  if ((worseCount >= 1 || (outcomeHistoryLength >= 2 && adjustedPerformance < 0)) && recoveryScore < 2) return 'cooling_off';
  if ((recoveryScore + Math.max(0, learnedTransferTrust)) >= 2 && (adjustedPerformance < 2 || worseCount >= 1)) return 'recovering';
  return 'active';
};

const deriveConfidence = (
  availability: RecommendationAvailability,
  performanceScore: number,
  stability: PersonalizedSupportSuggestion['stability'],
  supportingCount: number,
  learnedTransferTrust: number
): RecommendationConfidence => {
  const adjustedPerformance = performanceScore + learnedTransferTrust;
  if (availability === 'avoid_for_now') return 'low';
  if (adjustedPerformance >= 3) return 'high';
  if (adjustedPerformance <= -2) return 'low';
  if (stability === 'stable') return 'high';
  return supportingCount > 0 ? 'medium' : 'low';
};

const buildTrustSummary = (directTrustPercent: number, transferTrustPercent: number) => {
  return `${directTrustPercent}% earned from normal use, ${transferTrustPercent}% learned from supervised retries`;
};

const buildStateTrust = (
  recommendationId: string,
  stability: PersonalizedSupportSuggestion['stability'],
  supportingCount: number,
  supportLog: SupportLogEntry[],
  transferReviews: TransferReviewRecord[]
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

    const relevantReviews = assessTransferReviews(recommendationId, state, transferReviews, supportLog);
    const { transferLearningScore, learnedTransferTrust } = deriveTransferLearning(relevantReviews);
    const performanceScore = outcomeHistory.reduce((sum, event) => sum + scoreOutcome(event.outcome), 0);
    const worseCount = outcomeHistory.filter((event) => event.outcome === 'worse').length;
    const recoveryScore = deriveRecoveryScore(outcomeHistory);
    const availability = deriveAvailability(performanceScore, outcomeHistory.length, worseCount, recoveryScore, learnedTransferTrust);
    const confidence = deriveConfidence(availability, performanceScore, stability, supportingCount, learnedTransferTrust);
    const { directTrustWeight, transferTrustWeight, directTrustPercent, transferTrustPercent } = deriveTrustWeights(performanceScore, learnedTransferTrust, outcomeHistory.length);
    const { trustMaturity, maturitySummary } = deriveTrustMaturity(outcomeHistory.length, directTrustPercent, transferTrustPercent);
    const rankScore = performanceScore + recoveryScore + Math.min(learnedTransferTrust, directTrustWeight) + (confidence === 'high' ? 3 : confidence === 'medium' ? 1 : 0) - (availability === 'cooling_off' ? 4 : availability === 'avoid_for_now' ? 8 : 0);

    return {
      state,
      confidence,
      availability,
      performanceScore,
      recoveryScore,
      rankScore,
      transferLearningScore,
      learnedTransferTrust,
      directTrustWeight,
      transferTrustWeight,
      directTrustPercent,
      transferTrustPercent,
      trustMaturity,
      maturitySummary,
      outcomeHistory,
    };
  });
};

const deriveTransferSafety = (currentState: CanonicalStateId, stateTrustMap: RecommendationStateTrust[]): { transferSafety: TransferSafety; transferWarning?: string } => {
  const current = stateTrustMap.find((entry) => entry.state === currentState);
  const otherStates = stateTrustMap.filter((entry) => entry.state !== currentState);
  const strongElsewhere = otherStates.some((entry) => entry.availability === 'active' && entry.rankScore >= 3);

  if (!current) {
    return { transferSafety: 'caution', transferWarning: 'No current-state history is available for this support yet.' };
  }

  if ((current.availability === 'avoid_for_now' || current.availability === 'cooling_off') && strongElsewhere) {
    return {
      transferSafety: current.availability === 'avoid_for_now' ? 'avoid' : 'caution',
      transferWarning: `This support looks better in other states, but it is ${current.availability.replace('_', ' ')} for ${currentState.replace('_', ' ')}. Do not assume it will transfer cleanly.`,
    };
  }

  if (current.availability === 'recovering') {
    return {
      transferSafety: 'caution',
      transferWarning: `This support is still rebuilding trust for ${currentState.replace('_', ' ')}. Treat it like a careful retry, not a fully proven option yet.`,
    };
  }

  if (current.availability === 'avoid_for_now') {
    return {
      transferSafety: 'avoid',
      transferWarning: `This support is still avoid for now in ${currentState.replace('_', ' ')} even if it works better elsewhere.`,
    };
  }

  return { transferSafety: 'safe' };
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
    const stateTrustMap = buildStateTrust(recommendationId, suggestion.stability, supporting.length, supportLog, transferReviews);
    const currentStateTrust = stateTrustMap.find((entry) => entry.state === currentState)!;
    const transfer = deriveTransferSafety(currentState, stateTrustMap);
    const assessedTransferReviews = assessTransferReviews(recommendationId, currentState, transferReviews, supportLog);
    const trustSummary = buildTrustSummary(currentStateTrust.directTrustPercent, currentStateTrust.transferTrustPercent);

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
        currentStateTrust.trustMaturity === 'proven_in_normal_use'
          ? 'This lane is now mostly backed by what happened when it was used in the same state over time.'
          : currentStateTrust.trustMaturity === 'mostly_retry_based'
            ? 'This lane still depends a lot on careful retry history, so it is not as grounded in normal same-state use yet.'
            : 'This lane is being shaped by both normal use and careful retry history, and it is moving toward stronger same-state proof.',
      trustSummary,
      trustMaturity: currentStateTrust.trustMaturity,
      maturitySummary: currentStateTrust.maturitySummary,
      supportingEvidence: supporting.flatMap((item) => item.references).slice(0, 4),
      weakeningEvidence: weakening.flatMap((item) => item.references).slice(0, 4),
      outcomeHistory: currentStateTrust.outcomeHistory,
      performanceScore: currentStateTrust.performanceScore,
      rankScore: currentStateTrust.rankScore,
      recoveryScore: currentStateTrust.recoveryScore,
      transferLearningScore: currentStateTrust.transferLearningScore,
      learnedTransferTrust: currentStateTrust.learnedTransferTrust,
      directTrustWeight: currentStateTrust.directTrustWeight,
      transferTrustWeight: currentStateTrust.transferTrustWeight,
      directTrustPercent: currentStateTrust.directTrustPercent,
      transferTrustPercent: currentStateTrust.transferTrustPercent,
      stateTrustMap,
      transferReviews: assessedTransferReviews,
    };
  });

  return items.sort((a, b) => b.rankScore - a.rankScore);
};