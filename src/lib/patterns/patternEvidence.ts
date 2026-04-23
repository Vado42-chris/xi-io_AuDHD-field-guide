import {
  MemoryVaultEntry,
  PatternEvidenceItem,
  PatternEvidenceReference,
  PatternEvidenceSummary,
  SupportLogEntry,
} from '../../types/core';

const buildMemoryRef = (entry: MemoryVaultEntry, detail: string): PatternEvidenceReference => ({
  type: 'memory',
  id: entry.id,
  title: entry.threadTitle,
  detail,
  createdAt: entry.createdAt,
});

const buildSupportRef = (entry: SupportLogEntry): PatternEvidenceReference => ({
  type: 'support_log',
  id: entry.id,
  title: entry.supportTitle,
  detail: `${entry.stateLabel} · ${entry.outcome.replace('_', ' ')}`,
  createdAt: entry.createdAt,
});

export const buildPatternEvidenceItems = (
  memoryEntries: MemoryVaultEntry[],
  supportLog: SupportLogEntry[]
): PatternEvidenceItem[] => {
  const stressorMap = new Map<string, PatternEvidenceReference[]>();
  const destresserMap = new Map<string, PatternEvidenceReference[]>();

  memoryEntries.forEach((entry) => {
    entry.stressorTags.forEach((label) => {
      const list = stressorMap.get(label) ?? [];
      list.push(buildMemoryRef(entry, entry.summary));
      stressorMap.set(label, list);
    });
    entry.destresserTags.forEach((label) => {
      const list = destresserMap.get(label) ?? [];
      list.push(buildMemoryRef(entry, entry.summary));
      destresserMap.set(label, list);
    });
  });

  const items: PatternEvidenceItem[] = [];

  stressorMap.forEach((references, label) => {
    const contested = references.some((ref) => ref.detail.toLowerCase().includes('outdated'));
    items.push({
      id: `pattern-stressor-${label}`,
      label,
      kind: 'stressor',
      confidence: references.length > 1 ? 'repeated' : 'emerging',
      references,
      contested,
      resolutionStatus: contested ? 'under_review' : 'active',
      resolutionNote: contested ? 'Derived evidence appears unstable or outdated and should be reviewed.' : undefined,
      resolutionHistory: [],
    });
  });

  destresserMap.forEach((references, label) => {
    const contested = references.some((ref) => ref.detail.toLowerCase().includes('outdated'));
    items.push({
      id: `pattern-destresser-${label}`,
      label,
      kind: 'destresser',
      confidence: references.length > 1 ? 'repeated' : 'emerging',
      references,
      contested,
      resolutionStatus: contested ? 'under_review' : 'active',
      resolutionNote: contested ? 'Derived evidence appears unstable or outdated and should be reviewed.' : undefined,
      resolutionHistory: [],
    });
  });

  const helpfulSupports = supportLog.filter((entry) => entry.outcome === 'helped' || entry.outcome === 'a_little');
  if (helpfulSupports.length > 0) {
    const contested = supportLog.some((entry) => entry.outcome === 'worse');
    items.push({
      id: 'pattern-threshold-supports',
      label: 'Support outcomes informing readiness',
      kind: 'threshold',
      confidence: helpfulSupports.length > 1 ? 'gated' : 'emerging',
      references: helpfulSupports.map(buildSupportRef),
      contested,
      resolutionStatus: contested ? 'under_review' : 'active',
      resolutionNote: contested ? 'Helpful support evidence is mixed with worse outcomes and should stay under review.' : undefined,
      resolutionHistory: [],
    });
  }

  return items.sort((a, b) => b.references.length - a.references.length);
};

export const buildPatternEvidenceSummary = (items: PatternEvidenceItem[]): PatternEvidenceSummary => ({
  totalItems: items.length,
  contestedItems: items.filter((item) => item.contested).length,
  repeatedItems: items.filter((item) => item.confidence === 'repeated' || item.confidence === 'gated').length,
  underReviewItems: items.filter((item) => item.resolutionStatus === 'under_review').length,
  retiredItems: items.filter((item) => item.resolutionStatus === 'retired').length,
});