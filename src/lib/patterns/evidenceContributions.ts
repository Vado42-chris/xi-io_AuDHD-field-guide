import {
  EvidenceContribution,
  RevalidationRecord,
  SupportLogEntry,
  TrialReflectionRecord,
} from '../../types/core';

const confidenceFromOutcome = (outcome: SupportLogEntry['outcome']): EvidenceContribution['confidence'] => {
  if (outcome === 'helped' || outcome === 'worse') return 'confirmed';
  if (outcome === 'a_little') return 'repeated';
  return 'emerging';
};

const confidenceFromReflectionPrompt = (prompt: TrialReflectionRecord['prompt']): EvidenceContribution['confidence'] => {
  if (prompt === 'what_helped' || prompt === 'what_made_it_harder') return 'confirmed';
  return 'emerging';
};

const confidenceFromRevalidation = (result: RevalidationRecord['result']): EvidenceContribution['confidence'] => {
  if (result === 'still_helps' || result === 'no_longer_helps') return 'confirmed';
  return 'repeated';
};

export const deriveEvidenceContributions = (
  supportLog: SupportLogEntry[],
  trialReflections: TrialReflectionRecord[],
  revalidationRecords: RevalidationRecord[]
): EvidenceContribution[] => {
  const fromOutcomes: EvidenceContribution[] = supportLog.map((entry) => ({
    id: `evidence-outcome-${entry.id}`,
    source: 'support_outcome',
    stateCanonicalId: entry.stateCanonicalId,
    relatedRecommendationId: entry.recommendationId,
    tags: [entry.supportTitle.toLowerCase(), entry.outcome.replace('_', ' ')],
    summary: `${entry.supportTitle} ended with ${entry.outcome.replace('_', ' ')} in ${entry.stateLabel}.`,
    confidence: confidenceFromOutcome(entry.outcome),
    createdAt: entry.createdAt,
  }));

  const fromReflections: EvidenceContribution[] = trialReflections.map((entry) => ({
    id: `evidence-reflection-${entry.id}`,
    source: 'trial_reflection',
    stateCanonicalId: entry.stateCanonicalId,
    relatedRecommendationId: entry.recommendationId,
    tags: [entry.supportTitle.toLowerCase(), entry.prompt.replace('_', ' ')],
    summary: `${entry.supportTitle}: ${entry.note}`,
    confidence: confidenceFromReflectionPrompt(entry.prompt),
    createdAt: entry.createdAt,
  }));

  const fromRevalidation: EvidenceContribution[] = revalidationRecords.map((entry) => ({
    id: `evidence-revalidation-${entry.id}`,
    source: 'revalidation',
    stateCanonicalId: entry.currentState,
    relatedRecommendationId: entry.recommendationId,
    tags: [entry.result.replace(/_/g, ' '), 'fresh check'],
    summary: entry.note?.trim()
      ? `Fresh check: ${entry.note.trim()}`
      : `Fresh check result was ${entry.result.replace(/_/g, ' ')}.`,
    confidence: confidenceFromRevalidation(entry.result),
    createdAt: entry.createdAt,
  }));

  return [...fromOutcomes, ...fromReflections, ...fromRevalidation].sort((a, b) => b.createdAt - a.createdAt);
};

export default deriveEvidenceContributions;
