import { useMemo, useState } from 'react';
import {
  EvidenceContribution,
  JournalThread,
  LearningSignal,
  MemoryVaultEntry,
  MemoryVaultSummary,
  PatternEvidenceItem,
  PatternEvidenceSummary,
  PatternResolutionEvent,
  PatternResolutionStatus,
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
  evidenceContributions: EvidenceContribution[];
}

interface EvidenceOverride {
  contested?: boolean;
  resolutionStatus?: PatternResolutionStatus;
  resolutionNote?: string;
  resolutionHistory?: PatternResolutionEvent[];
}

export interface LearningFeatureController {
  memoryEntries: MemoryVaultEntry[];
  memorySummary: MemoryVaultSummary;
  patternSummary: PatternReviewSummary;
  thresholdSummary: ThresholdSummary;
  evidenceItems: PatternEvidenceItem[];
  evidenceSummary: PatternEvidenceSummary;
  supportEvidence: EvidenceContribution[];
  supportEvidenceSummary: { total: number; confirmed: number; latestSource?: string };
  handleToggleEvidenceContested: (itemId: string) => void;
  handleResolveEvidence: (itemId: string, nextStatus: PatternResolutionStatus, note: string) => void;
}

export const useLearningFeatureController = ({
  journalThreads,
  learningSignals,
  sensorySupports,
  supportLog,
  evidenceContributions,
}: LearningFeatureControllerArgs): LearningFeatureController => {
  const [overrides, setOverrides] = useState<Record<string, EvidenceOverride>>({});

  const memoryEntries = useMemo(() => buildMemoryVaultEntries(journalThreads), [journalThreads]);
  const memorySummary = useMemo(() => buildMemoryVaultSummary(memoryEntries), [memoryEntries]);
  const patternSummary = useMemo(() => buildPatternReviewSummary(learningSignals, sensorySupports), [learningSignals, sensorySupports]);
  const baseEvidenceItems = useMemo(() => buildPatternEvidenceItems(memoryEntries, supportLog), [memoryEntries, supportLog]);
  const supportEvidence = useMemo(
    () => evidenceContributions.filter((item) => item.source === 'support_outcome' || item.source === 'trial_reflection' || item.source === 'revalidation'),
    [evidenceContributions]
  );
  const supportEvidenceSummary = useMemo(
    () => ({
      total: supportEvidence.length,
      confirmed: supportEvidence.filter((item) => item.confidence === 'confirmed').length,
      latestSource: supportEvidence[0]?.source,
    }),
    [supportEvidence]
  );

  const evidenceItems = useMemo(
    () => baseEvidenceItems.map((item) => {
      const override = overrides[item.id];
      if (!override) return item;
      return {
        ...item,
        contested: override.contested ?? item.contested,
        resolutionStatus: override.resolutionStatus ?? item.resolutionStatus,
        resolutionNote: override.resolutionNote ?? item.resolutionNote,
        resolutionHistory: override.resolutionHistory ?? item.resolutionHistory,
      };
    }),
    [baseEvidenceItems, overrides]
  );

  const evidenceSummary = useMemo(() => buildPatternEvidenceSummary(evidenceItems), [evidenceItems]);
  const thresholdSummary = useMemo(
    () => buildThresholdSummary(learningSignals, sensorySupports, evidenceItems),
    [learningSignals, sensorySupports, evidenceItems]
  );

  const handleToggleEvidenceContested = (itemId: string) => {
    setOverrides((prev) => {
      const current = prev[itemId] ?? {};
      const nextContested = !(current.contested ?? false);
      return {
        ...prev,
        [itemId]: {
          ...current,
          contested: nextContested,
          resolutionStatus: nextContested ? 'under_review' : current.resolutionStatus ?? 'active',
          resolutionNote: nextContested ? current.resolutionNote ?? 'Evidence was contested and moved under review.' : current.resolutionNote,
        },
      };
    });
  };

  const handleResolveEvidence = (itemId: string, nextStatus: PatternResolutionStatus, note: string) => {
    const source = evidenceItems.find((item) => item.id === itemId);
    if (!source) return;
    const event: PatternResolutionEvent = {
      id: `resolution-${Date.now()}`,
      changedAt: Date.now(),
      actor: 'user',
      previousStatus: source.resolutionStatus,
      nextStatus,
      reason: note || 'Evidence resolution updated by user.',
    };

    setOverrides((prev) => {
      const current = prev[itemId] ?? {};
      const priorHistory = current.resolutionHistory ?? source.resolutionHistory;
      return {
        ...prev,
        [itemId]: {
          ...current,
          contested: nextStatus === 'under_review',
          resolutionStatus: nextStatus,
          resolutionNote: note || current.resolutionNote || source.resolutionNote,
          resolutionHistory: [...priorHistory, event],
        },
      };
    });
  };

  return {
    memoryEntries,
    memorySummary,
    patternSummary,
    thresholdSummary,
    evidenceItems,
    evidenceSummary,
    supportEvidence,
    supportEvidenceSummary,
    handleToggleEvidenceContested,
    handleResolveEvidence,
  };
};