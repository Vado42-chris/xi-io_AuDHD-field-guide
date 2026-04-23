import { ThresholdSummary } from '../../types/core';

export const buildReadinessGuideBody = (thresholdSummary: ThresholdSummary): string => {
  if (thresholdSummary.readiness === 'not_ready') {
    return 'The app can help right away with calmer starter supports and simple logging, but personalized trust is still being built. Use the support flow, log what happened, and let the evidence grow before leaning too hard on tailored suggestions.';
  }
  if (thresholdSummary.readiness === 'warming_up') {
    return 'The app is warming up. It has enough signal to start suggesting patterns, but trust should still be treated as cautious until those patterns hold up across more real use.';
  }
  return 'The app has enough evidence to offer more grounded personalized support. Trust is stronger here, but it still stays healthiest when fresh outcomes keep it current.';
};

export const buildReadinessTrustLine = (thresholdSummary: ThresholdSummary): string => {
  if (thresholdSummary.readiness === 'not_ready') {
    return 'Trust is still early here. Treat the app as a calm helper, not a finished judge.';
  }
  if (thresholdSummary.readiness === 'warming_up') {
    return 'Trust is building here. Promising patterns can guide the next step, but they still need more proof.';
  }
  return 'Trust is stronger here. Patterns are more grounded, but they still stay accountable to new evidence.';
};

export default buildReadinessGuideBody;