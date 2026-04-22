import { JournalThread, ThreadMemoryEntry } from '../../types/core';

const TAG_RULES: Array<{ tag: string; keywords: string[] }> = [
  { tag: 'pain', keywords: ['pain', 'back', 'ache', 'sciatica'] },
  { tag: 'overload', keywords: ['overload', 'too much', 'noise', 'bright'] },
  { tag: 'social', keywords: ['message', 'reply', 'conflict', 'text'] },
  { tag: 'task-lock', keywords: ['stuck', 'start', 'task', 'decision'] },
  { tag: 'regulation', keywords: ['calm', 'regulate', 'support', 'steady'] },
];

const STRESSOR_RULES: Array<{ label: string; keywords: string[] }> = [
  { label: 'Pain', keywords: ['pain', 'back', 'ache', 'sciatica'] },
  { label: 'Overload', keywords: ['overload', 'noise', 'bright', 'too much'] },
  { label: 'Social friction', keywords: ['message', 'reply', 'conflict'] },
  { label: 'Task pressure', keywords: ['stuck', 'task', 'decision'] },
];

const DESTRESSER_RULES: Array<{ label: string; keywords: string[] }> = [
  { label: 'Reduce input', keywords: ['reduce input', 'quiet', 'dark', 'less input'] },
  { label: 'Pause before replying', keywords: ['wait', 'reply later', 'do less'] },
  { label: 'Position change', keywords: ['position', 'lie down', 'sit differently'] },
  { label: 'Longer exhale', keywords: ['exhale', 'breath', 'breathing'] },
];

const includesAny = (text: string, keywords: string[]) => keywords.some((keyword) => text.includes(keyword));

export const buildThreadMemoryEntry = (thread: JournalThread): ThreadMemoryEntry => {
  const corpus = `${thread.title} ${thread.messages.map((message) => message.text).join(' ')}`.toLowerCase();

  const suggestedTags = TAG_RULES.filter((rule) => includesAny(corpus, rule.keywords)).map((rule) => rule.tag);
  const stressorTags = STRESSOR_RULES.filter((rule) => includesAny(corpus, rule.keywords)).map((rule) => rule.label);
  const destresserTags = DESTRESSER_RULES.filter((rule) => includesAny(corpus, rule.keywords)).map((rule) => rule.label);

  const lastUserMessage = [...thread.messages].reverse().find((message) => message.role === 'user');
  const summarySource = lastUserMessage?.text ?? thread.summary ?? thread.title;
  const summary = summarySource.length > 180 ? `${summarySource.slice(0, 177)}...` : summarySource;

  return {
    summary,
    suggestedTags,
    confirmedTags: thread.memory?.confirmedTags ?? thread.tags,
    stressorTags,
    destresserTags,
    status: thread.memory?.status ?? 'suggested',
    notes: thread.memory?.notes,
    lastStructuredAt: Date.now(),
  };
};