import { AppSection } from '../types/core';

export const SECTION_LABELS: Record<AppSection, { kicker: string; label: string }> = {
  help_now: { kicker: 'Immediate support', label: 'Help Now' },
  journal: { kicker: 'Interactive continuity', label: 'Journal' },
  learn_me: { kicker: 'Patterns over time', label: 'Learn Me' },
  customize: { kicker: 'User-owned controls', label: 'Customize' },
};

export const APP_SECTIONS: AppSection[] = ['help_now', 'journal', 'learn_me', 'customize'];