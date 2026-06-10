import { EvidenceContribution, JournalThread, RevalidationRecord, SupportLogEntry, TrialReflectionRecord } from '../../types/core';

export const deriveEvidenceConfidenceFromOutcome = (
  outcome: SupportLogEntry['outcome']
): EvidenceContribution['confidence'] => {
  if (outcome === 'helped' || outcome === 'worse') return 'confirmed';
  if (outcome === 'a_little') return 'repeated';
  return 'emerging';
};

export const deriveEvidenceConfidenceFromReflection = (
  prompt: TrialReflectionRecord['prompt']
): EvidenceContribution['confidence'] => {
  if (prompt === 'what_helped' || prompt === 'what_made_it_harder') return 'confirmed';
  return 'emerging';
};

export const deriveEvidenceConfidenceFromRevalidation = (
  result: RevalidationRecord['result']
): EvidenceContribution['confidence'] => {
  if (result === 'still_helps' || result === 'no_longer_helps') return 'confirmed';
  return 'repeated';
};

export const deriveEvidenceConfidenceFromJournal = (
  thread: JournalThread
): EvidenceContribution['confidence'] => {
  if (thread.memory?.confirmedTags?.length) return 'confirmed';
  if (thread.memory?.suggestedTags?.length) return 'repeated';
  return 'emerging';
};

export const describeEvidenceConfidence = (
  confidence: EvidenceContribution['confidence']
): string => {
  switch (confidence) {
    case 'confirmed':
      return 'Confirmed means the app has a stronger reason to trust this signal, usually because it held up clearly or was explicitly reinforced.';
    case 'repeated':
      return 'Repeated means this signal has shown up more than once or has some reinforcement, but it is not fully settled yet.';
    case 'emerging':
    default:
      return 'Emerging means the app has noticed something worth watching, but it still needs more evidence before leaning on it.';
  }
};

export const describeEvidenceSource = (
  source: EvidenceContribution['source']
): string => {
  switch (source) {
    case 'journal':
      return 'This came from structured journal memory.';
    case 'support_outcome':
      return 'This came from logging what happened after a support attempt.';
    case 'trial_reflection':
      return 'This came from an optional note added after a support attempt.';
    case 'revalidation':
      return 'This came from a fresh check to see if an older support still holds up.';
    case 'manual':
      return 'This was added manually.';
    case 'customization':
      return 'This came from a user-owned customization choice.';
    default:
      return 'This came from the shared evidence intake.';
  }
};
