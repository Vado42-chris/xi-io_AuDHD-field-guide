import { LearningSignal, PatternReviewSummary, SensorySupportRecord } from '../../types/core';

export const buildPatternReviewSummary = (
  signals: LearningSignal[],
  sensorySupports: SensorySupportRecord[]
): PatternReviewSummary => {
  const repeatedStressors = signals
    .filter((s) => s.kind === 'stressor' && s.confidence === 'repeated')
    .map((s) => s.label);

  const repeatedDestressers = signals
    .filter((s) => s.kind === 'destresser' && s.confidence === 'repeated')
    .map((s) => s.label);

  const strongestSupports = sensorySupports
    .map((record) => ({
      label: record.label,
      score: record.outcomeCounts.helped + record.outcomeCounts.a_little - record.outcomeCounts.worse,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.label);

  const contradictionCount = sensorySupports.reduce((sum, record) => {
    return sum + (record.outcomeCounts.helped > 0 && record.outcomeCounts.worse > 0 ? 1 : 0);
  }, 0);

  const evidenceCount = signals.filter((s) => s.confirmed).length + sensorySupports.filter((s) => s.confirmed).length;

  let confidenceLevel: PatternReviewSummary['confidenceLevel'] = 'early';
  if (evidenceCount >= 6 && contradictionCount <= 1) confidenceLevel = 'trusted';
  else if (evidenceCount >= 3) confidenceLevel = 'learning';

  const cautionNotes: string[] = [];
  if (contradictionCount > 0) cautionNotes.push('Some supports show mixed outcomes and should be treated carefully.');
  if (evidenceCount < 3) cautionNotes.push('The pattern base is still small, so suggestions should stay broad.');
  if (repeatedStressors.length === 0) cautionNotes.push('No repeated stressors are confirmed strongly enough yet.');

  return {
    confidenceLevel,
    evidenceCount,
    contradictionCount,
    repeatedStressors,
    repeatedDestressers,
    strongestSupports,
    cautionNotes,
  };
};