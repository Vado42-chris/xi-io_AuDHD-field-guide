import React from 'react';
import { Button, MetaLabel } from './primitives.ts';
import { Panel } from './Panel.ts';

export const HelpNowView: React.FC<{ onOpenRelay: () => void }> = ({ onOpenRelay }) => React.createElement(
  'div',
  { className: 'max-w-4xl mx-auto p-12 space-y-8' },
  React.createElement(
    'header',
    { className: 'space-y-4' },
    React.createElement(MetaLabel, { className: 'text-red-400' }, 'Help Now'),
    React.createElement('h2', { className: 'text-5xl font-thin tracking-tighter text-white' }, 'Capture First'),
    React.createElement(
      'p',
      { className: 'text-sm opacity-60 leading-relaxed max-w-2xl' },
      'Use this space to get words out before organizing them. In this skeleton pass, nothing typed here is saved, sent, exported, or added to a thread.'
    )
  ),
  React.createElement(
    Panel,
    { className: 'border-red-500/20 bg-red-500/[0.03]' },
    React.createElement(MetaLabel, { className: 'text-red-400' }, 'Private Draft Pad'),
    React.createElement('textarea', {
      className: 'w-full min-h-48 bg-black/30 border border-white/10 rounded-xl p-5 text-sm leading-relaxed focus:outline-none focus:border-red-400/40',
      placeholder: 'Write the raw thing here. Do not polish yet. Name the pressure, the need, the next safe action.',
    }),
    React.createElement(
      'div',
      { className: 'flex flex-wrap gap-3 mt-6' },
      React.createElement(Button, { primary: true, onClick: onOpenRelay }, 'Open Neural Relay'),
      React.createElement(
        'div',
        { className: 'text-[10px] uppercase tracking-[0.2em] opacity-40 flex items-center' },
        'Not saved in this pass'
      )
    )
  )
);
