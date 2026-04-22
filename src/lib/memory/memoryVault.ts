import { JournalThread, MemoryVaultEntry, MemoryVaultSummary } from '../../types/core';

const repeatedValues = (values: string[]): string[] => {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([value]) => value);
};

const hasConflict = (entry: Pick<MemoryVaultEntry, 'stressorTags' | 'destresserTags'>): boolean => {
  const stressorSet = new Set(entry.stressorTags.map((value) => value.toLowerCase()));
  const destresserSet = new Set(entry.destresserTags.map((value) => value.toLowerCase()));
  return Array.from(stressorSet).some((value) => destresserSet.has(value));
};

export const buildMemoryVaultEntries = (threads: JournalThread[]): MemoryVaultEntry[] => {
  return threads
    .filter((thread) => thread.memory)
    .map((thread) => {
      const entry: MemoryVaultEntry = {
        id: `memory-${thread.id}`,
        threadId: thread.id,
        threadTitle: thread.title,
        summary: thread.memory?.summary ?? thread.summary ?? thread.title,
        confirmedTags: thread.memory?.confirmedTags ?? thread.tags,
        stressorTags: thread.memory?.stressorTags ?? [],
        destresserTags: thread.memory?.destresserTags ?? [],
        createdAt: thread.updatedAt,
        confirmed: (thread.memory?.confirmedTags?.length ?? 0) > 0,
        status: thread.memory?.status ?? 'suggested',
        notes: thread.memory?.notes,
        hasConflict: false,
        provenanceSource: thread.memory?.provenanceSource ?? 'thread',
        supersedesEntryId: thread.memory?.supersedesEntryId,
        revisionHistory: thread.memory?.revisionHistory ?? [],
      };
      return { ...entry, hasConflict: hasConflict(entry) };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
};

export const buildMemoryVaultSummary = (entries: MemoryVaultEntry[]): MemoryVaultSummary => {
  return {
    totalEntries: entries.length,
    confirmedEntries: entries.filter((entry) => entry.confirmed).length,
    repeatedTags: repeatedValues(entries.flatMap((entry) => entry.confirmedTags)),
    repeatedStressors: repeatedValues(entries.flatMap((entry) => entry.stressorTags)),
    repeatedDestressers: repeatedValues(entries.flatMap((entry) => entry.destresserTags)),
    conflictEntries: entries.filter((entry) => entry.hasConflict).length,
    revisedEntries: entries.filter((entry) => entry.revisionHistory.length > 0).length,
  };
};