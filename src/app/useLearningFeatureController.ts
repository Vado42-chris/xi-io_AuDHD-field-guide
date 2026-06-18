import { useMemo } from 'react';
import {
  JournalThread,
  LearningSignal,
  MemoryVaultEntry,
  MemoryVaultSummary,
  PatternReviewSummary,
  SensorySupportRecord,
  ThresholdSummary,
} from '../types/core';
import { buildPatternReviewSummary } from '../lib/patterns/patternReview';
import { buildThresholdSummary } from '../lib/patterns/personalizationThreshold';
import { buildMemoryVaultEntries, buildMemoryVaultSummary } from '../lib/memory/memoryVault';

interface LearningFeatureControllerArgs {
  journalThreads: JournalThread[];
  learningSignals: LearningSignal[];
  sensorySupports: SensorySupportRecord[];
}

export interface LearningFeatureController {
  memoryEntries: MemoryVaultEntry[];
  memorySummary: MemoryVaultSummary;
  patternSummary: PatternReviewSummary;
  thresholdSummary: ThresholdSummary;
}

export const useLearningFeatureController = ({
  journalThreads,
  learningSignals,
  sensorySupports,
}: LearningFeatureControllerArgs): LearningFeatureController => {
  const memoryEntries = useMemo(() => buildMemoryVaultEntries(journalThreads), [journalThreads]);
  const memorySummary = useMemo(() => buildMemoryVaultSummary(memoryEntries), [memoryEntries]);
  const patternSummary = useMemo(() => buildPatternReviewSummary(learningSignals, sensorySupports), [learningSignals, sensorySupports]);
  const thresholdSummary = useMemo(() => buildThresholdSummary(learningSignals, sensorySupports), [learningSignals, sensorySupports]);

  return {
    memoryEntries,
    memorySummary,
    patternSummary,
    thresholdSummary,
  };
};