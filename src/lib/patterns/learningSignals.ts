import { CanonicalStateId, JournalThread, LearningSignal, SensorySupportRecord, SupportLogEntry, SupportOutcome } from '../../types/core';

const STRESSOR_RULES = [
  { label: 'Pain', keywords: ['pain', 'back', 'sciatica', 'ache'] },
  { label: 'Overload', keywords: ['overload', 'too much', 'everything', 'noise', 'bright'] },
  { label: 'Social friction', keywords: ['message', 'reply', 'conflict', 'text', 'people'] },
  { label: 'Task pressure', keywords: ['task', 'stuck', 'start', 'decision', 'pressure'] },
];

const DESTRESSER_RULES = [
  { label: 'Reduce input', keywords: ['reduce input', 'lower', 'dark', 'quiet', 'silence'] },
  { label: 'Pause before replying', keywords: ['wait', 'hold', 'reply later', 'do less'] },
  { label: 'Position change', keywords: ['position', 'sit', 'lie down', 'change position'] },
  { label: 'Longer exhale', keywords: ['exhale', 'breath', 'breathing'] },
];

const SENSORY_RULES: Array<{ label: string; category: SensorySupportRecord['category']; keywords: string[] }> = [
  { label: 'Dark room', category: 'light', keywords: ['dark', 'lower light', 'dim'] },
  { label: 'Quiet / low sound', category: 'sound', keywords: ['quiet', 'silence', 'noise'] },
  { label: 'Pressure / weight', category: 'pressure', keywords: ['pressure', 'weighted', 'blanket'] },
  { label: 'Cool temperature', category: 'temperature', keywords: ['cold', 'cool', 'cloth'] },
  { label: 'Reduce input', category: 'reduction', keywords: ['reduce input', 'less input', 'step back'] },
];

const includesAny = (text: string, keywords: string[]) => keywords.some((keyword) => text.includes(keyword));

const makeSignal = (label: string, kind: LearningSignal['kind'], source: LearningSignal['source'], context: string, repeated: boolean): LearningSignal => ({
  id: `${kind}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  label,
  kind,
  source,
  confidence: repeated ? 'repeated' : 'emerging',
  contexts: [context],
  confirmed: false,
  createdAt: Date.now(),
});

export const deriveLearningSignals = (threads: JournalThread[], supportLog: SupportLogEntry[]): LearningSignal[] => {
  const signals = new Map<string, LearningSignal>();

  threads.forEach((thread) => {
    const corpus = `${thread.title} ${thread.summary ?? ''} ${thread.messages.map((m) => m.text).join(' ')}`.toLowerCase();

    STRESSOR_RULES.forEach((rule) => {
      if (includesAny(corpus, rule.keywords)) {
        const key = `stressor-${rule.label}`;
        const existing = signals.get(key);
        if (existing) {
          existing.confidence = 'repeated';
          existing.contexts = Array.from(new Set([...existing.contexts, thread.title]));
        } else {
          signals.set(key, makeSignal(rule.label, 'stressor', 'thread', thread.title, false));
        }
      }
    });

    DESTRESSER_RULES.forEach((rule) => {
      if (includesAny(corpus, rule.keywords)) {
        const key = `destresser-${rule.label}`;
        const existing = signals.get(key);
        if (existing) {
          existing.confidence = 'repeated';
          existing.contexts = Array.from(new Set([...existing.contexts, thread.title]));
        } else {
          signals.set(key, makeSignal(rule.label, 'destresser', 'thread', thread.title, false));
        }
      }
    });
  });

  supportLog.forEach((entry) => {
    if (entry.outcome === 'helped' || entry.outcome === 'a_little') {
      const key = `destresser-${entry.supportTitle}`;
      const existing = signals.get(key);
      if (existing) {
        existing.confidence = 'repeated';
        existing.contexts = Array.from(new Set([...existing.contexts, entry.supportRoute]));
      } else {
        signals.set(key, makeSignal(entry.supportTitle, 'destresser', 'support_log', entry.supportRoute, false));
      }
    }
  });

  return Array.from(signals.values());
};

const emptyOutcomeCounts = (): Record<SupportOutcome, number> => ({
  helped: 0,
  a_little: 0,
  no_change: 0,
  worse: 0,
  skipped: 0,
});

export const deriveSensorySupports = (supportLog: SupportLogEntry[]): SensorySupportRecord[] => {
  const records = new Map<string, SensorySupportRecord>();

  supportLog.forEach((entry) => {
    const corpus = `${entry.supportTitle} ${entry.supportRoute}`.toLowerCase();
    SENSORY_RULES.forEach((rule) => {
      if (includesAny(corpus, rule.keywords)) {
        const key = `sensory-${rule.label}`;
        const existing = records.get(key);
        if (existing) {
          existing.outcomeCounts[entry.outcome] += 1;
          if (!existing.helpfulStates.includes(entry.stateCanonicalId as CanonicalStateId)) {
            existing.helpfulStates.push(entry.stateCanonicalId as CanonicalStateId);
          }
        } else {
          const outcomeCounts = emptyOutcomeCounts();
          outcomeCounts[entry.outcome] = 1;
          records.set(key, {
            id: key,
            label: rule.label,
            category: rule.category,
            helpfulStates: [entry.stateCanonicalId as CanonicalStateId],
            outcomeCounts,
            confirmed: false,
            createdAt: Date.now(),
          });
        }
      }
    });
  });

  return Array.from(records.values());
};