import React from 'react';
import { Button, MetaLabel } from './primitives.ts';
import { Panel } from './Panel.ts';

export const HelpNowView: React.FC<{ onOpenRelay: () => void }> = ({ onOpenRelay }) => React.createElement(
  'div',
  { className: 'max-w-5xl mx-auto p-12 space-y-8' },
  React.createElement(
    'header',
    { className: 'space-y-4' },
    React.createElement(MetaLabel, { className: 'text-red-400' }, 'Help Now'),
    React.createElement('h2', { className: 'text-5xl font-thin tracking-tighter text-white' }, 'Capture First, Sort Later'),
    React.createElement(
      'p',
      { className: 'text-sm opacity-65 leading-relaxed max-w-2xl' },
      'This is a pressure-release surface for moments when polished words are too expensive. Use it to name what is happening, what you need, and the next safe step before deciding where the thought belongs.'
    )
  ),
  React.createElement(
    'div',
    { className: 'grid lg:grid-cols-[1.4fr_0.8fr] gap-6' },
    React.createElement(
      Panel,
      { className: 'border-red-500/20 bg-red-500/[0.03]' },
      React.createElement(MetaLabel, { className: 'text-red-400' }, 'Private Draft Pad'),
      React.createElement('textarea', {
        className: 'w-full min-h-64 bg-black/30 border border-white/10 rounded-xl p-5 text-sm leading-relaxed focus:outline-none focus:border-red-400/40',
        placeholder: 'Raw capture only. What happened? What are you feeling in your body? What do you need? What is the next safe action?',
      }),
      React.createElement(
        'div',
        { className: 'flex flex-wrap gap-3 mt-6 items-center' },
        React.createElement(Button, { primary: true, onClick: onOpenRelay }, 'Open Neural Relay'),
        React.createElement(
          'div',
          { className: 'text-[10px] uppercase tracking-[0.2em] opacity-45' },
          'Static draft pad: not saved, sent, exported, or threaded'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'space-y-4' },
      React.createElement(
        Panel,
        { className: 'p-6' },
        React.createElement(MetaLabel, null, 'Use When'),
        React.createElement(
          'ul',
          { className: 'space-y-3 text-xs leading-relaxed opacity-70' },
          React.createElement('li', null, '• You need to vent before organizing.'),
          React.createElement('li', null, '• You need a neutral place to catch the first version.'),
          React.createElement('li', null, '• You are not ready to make it permanent.')
        )
      ),
      React.createElement(
        Panel,
        { className: 'p-6 border-[#4DB6AC]/20' },
        React.createElement(MetaLabel, null, 'Next Step'),
        React.createElement(
          'p',
          { className: 'text-xs leading-relaxed opacity-70' },
          'After capture, open Neural Relay when you are ready to turn the raw text into a message, plan, or reflection. This pass does not move text automatically.'
        )
      )
    )
  )
);
