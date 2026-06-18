import { useMemo, useState } from 'react';
import {
  JournalThread,
  LearningSignal,
  MemoryVaultEntry,
  MemoryVaultSummary,
  PatternEvidenceItem,
  PatternEvidenceSummary,
  PatternReviewSummary,
  SensorySupportRecord,
  SupportLogEntry,
  ThresholdSummary,
} from '../types/core';
import { buildPatternReviewSummary } from '../lib/patterns/patternReview';
import { buildThresholdSummary } from '../lib/patterns/personalizationThreshold';
import { buildMemoryVaultEntries, buildMemoryVaultSummary } from '../lib/memory/memoryVault';
import { buildPatternEvidenceItems, buildPatternEvidenceSummary } from '../lib/patterns/patternEvidence';

interface LearningFeatureControllerArgs {
  journalThreads: JournalThread[];
  learningSignals: LearningSignal[];
  sensorySupports: SensorySupportRecord[];
  supportLog: SupportLogEntry[];
}

export interface LearningFeatureController {
  memoryEntries: MemoryVaultEntry[];
  memorySummary: MemoryVaultSummary;
  patternSummary: PatternReviewSummary;
  thresholdSummary: ThresholdSummary;
  evidenceItems: PatternEvidenceItem[];
  evidenceSummary: PatternEvidenceSummary;
  handleToggleEvidenceContested: (itemId: string) => void;
}

export const useLearningFeatureController = ({
  journalThreads,
  learningSignals,
  sensorySupports,
  supportLog,
}: LearningFeatureControllerArgs): LearningFeatureController => {
  const [contestedIds, setContestedIds] = useState<string[]>([]);

  const memoryEntries = useMemo(() => buildMemoryVaultEntries(journalThreads), [journalThreads]);
  const memorySummary = useMemo(() => buildMemoryVaultSummary(memoryEntries), [memoryEntries]);
  const patternSummary = useMemo(() => buildPatternReviewSummary(learningSignals, sensorySupports), [learningSignals, sensorySupports]);
  const thresholdSummary = useMemo(() => buildThresholdSummary(learningSignals, sensorySupports), [learningSignals, sensorySupports]);
  const baseEvidenceItems = useMemo(() => buildPatternEvidenceItems(memoryEntries, supportLog), [memoryEntries, supportLog]);
  const evidenceItems = useMemo(
    () => baseEvidenceItems.map((item) => ({ ...item, contested: item.contested || contestedIds.includes(item.id) })),
    [baseEvidenceItems, contestedIds]
  );
  const evidenceSummary = useMemo(() => buildPatternEvidenceSummary(evidenceItems), [evidenceItems]);

  const handleToggleEvidenceContested = (itemId: string) => {
    setContestedIds((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  };

  return {
    memoryEntries,
    memorySummary,
    patternSummary,
    thresholdSummary,
    evidenceItems,
    evidenceSummary,
    handleToggleEvidenceContested,
  };
};