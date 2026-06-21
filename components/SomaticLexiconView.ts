import React from 'react';
import { JournalEntry } from '../types.ts';
import { Panel } from './Panel.ts';
import { MetaLabel } from './primitives.ts';

export const SomaticLexiconView: React.FC<{ lexicon: JournalEntry[] }> = ({ lexicon }) => {
  const recentEntries = [...lexicon]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return React.createElement(
    'div',
    { className: 'max-w-5xl mx-auto p-12 space-y-8' },
    React.createElement(
      'header',
      { className: 'space-y-4' },
      React.createElement(MetaLabel, null, 'Somatic Lexicon'),
      React.createElement('h2', { className: 'text-5xl font-thin tracking-tighter text-white' }, 'Body Signal Index'),
      React.createElement(
        'p',
        { className: 'text-sm opacity-65 leading-relaxed max-w-2xl' },
        'A read-only view of committed body-state entries. This pass makes the route visible and navigable without adding new storage, editing, export, or model behavior.'
      )
    ),
    React.createElement(
      'div',
      { className: 'grid md:grid-cols-3 gap-4' },
      React.createElement(
        Panel,
        null,
        React.createElement(MetaLabel, null, 'Entries'),
        React.createElement('div', { className: 'text-5xl font-thin text-white' }, lexicon.length.toString()),
        React.createElement('p', { className: 'text-xs opacity-45 mt-3 leading-relaxed' }, 'Committed records currently stored in the local trace.')
      ),
      React.createElement(
        Panel,
        null,
        React.createElement(MetaLabel, null, 'Average Mood'),
        React.createElement(
          'div',
          { className: 'text-5xl font-thin text-white' },
          lexicon.length ? (lexicon.reduce((sum, entry) => sum + entry.mood, 0) / lexicon.length).toFixed(1) : 'n/a'
        ),
        React.createElement('p', { className: 'text-xs opacity-45 mt-3 leading-relaxed' }, 'Computed from existing entries only.')
      ),
      React.createElement(
        Panel,
        null,
        React.createElement(MetaLabel, null, 'Average Entropy'),
        React.createElement(
          'div',
          { className: 'text-5xl font-thin text-white' },
          lexicon.length ? (lexicon.reduce((sum, entry) => sum + entry.sensoryEntropy, 0) / lexicon.length).toFixed(1) : 'n/a'
        ),
        React.createElement('p', { className: 'text-xs opacity-45 mt-3 leading-relaxed' }, 'Read-only signal summary for route coverage.')
      )
    ),
    React.createElement(
      Panel,
      { className: 'border-[#4DB6AC]/20' },
      React.createElement(MetaLabel, null, 'Recent Entries'),
      recentEntries.length === 0
        ? React.createElement('p', { className: 'text-sm opacity-55 leading-relaxed' }, 'No committed entries yet. This route is ready to display the local lexicon once tracking data exists.')
        : React.createElement(
            'div',
            { className: 'space-y-4' },
            recentEntries.map((entry) => React.createElement(
              'article',
              { key: entry.id, className: 'p-4 rounded-xl bg-white/5 border border-white/5' },
              React.createElement('div', { className: 'flex justify-between gap-4 text-[10px] uppercase tracking-[0.2em] opacity-45 mb-3' },
                React.createElement('span', null, new Date(entry.timestamp).toLocaleString()),
                React.createElement('span', null, `Mood ${entry.mood}/10 · Entropy ${entry.sensoryEntropy}/10`)
              ),
              React.createElement('p', { className: 'text-sm leading-relaxed opacity-75' }, entry.note || 'No note recorded.')
            ))
          )
    )
  );
};
