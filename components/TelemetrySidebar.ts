import React from 'react';
import type { ComprehensiveResult, HistoryPoint } from '../types.ts';
import { MetaLabel } from './primitives.ts';

export const TelemetrySidebar: React.FC<{
  results: ComprehensiveResult;
  stability: number;
  selectedPoint?: HistoryPoint | null;
}> = ({ results, stability, selectedPoint }) => React.createElement(
  'aside',
  { className: 'w-80 flex flex-col border-l border-white/5 bg-[#080808]/50 p-6 overflow-y-auto xi-scroll' },
  React.createElement(MetaLabel, { className: 'mb-6' }, selectedPoint ? 'Temporal Slice' : 'Neural Telemetry'),
  React.createElement(
    'div',
    { className: 'space-y-8' },
    selectedPoint
      ? React.createElement(
          'div',
          null,
          React.createElement('div', { className: 'text-3xl font-thin text-white mb-2' }, selectedPoint.date),
          React.createElement(
            'div',
            { className: 'p-4 bg-white/5 rounded border border-white/5 mb-6' },
            React.createElement(MetaLabel, { className: 'text-[8px] opacity-40' }, 'Load Index'),
            React.createElement('div', { className: 'text-3xl font-bold tabular-nums text-orange-400' }, `${(selectedPoint.value * 100).toFixed(0)}%`)
          ),
          React.createElement('p', { className: 'text-sm italic opacity-60' }, `"${selectedPoint.noteSnippet}"`)
        )
      : React.createElement(
          React.Fragment,
          null,
          React.createElement(
            'div',
            null,
            React.createElement('div', { className: 'text-5xl font-thin tracking-tighter text-white' }, `${stability}%`),
            React.createElement(MetaLabel, { className: 'text-[8px] opacity-40 mt-1' }, 'Stability Confidence')
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 gap-4' },
            [results.autism, results.adhd, results.masking, results.burnout].map((p) => React.createElement(
              'div',
              { key: p.label, className: 'p-3 bg-white/5 rounded border border-white/5' },
              React.createElement('div', { className: 'text-[8px] uppercase opacity-30 mb-1' }, p.label),
              React.createElement('div', { className: 'text-lg font-bold' }, `${p.percentile}%`)
            ))
          ),
          React.createElement(
            'div',
            { className: 'space-y-3' },
            React.createElement(MetaLabel, { className: 'text-[8px] opacity-40' }, 'Actionable Intel'),
            results.hallberg.actionableIntel.map((intel, i) => React.createElement(
              'div',
              { key: i, className: 'text-[11px] font-light text-white/70 italic flex gap-2' },
              React.createElement('div', { className: 'w-1 h-1 bg-[#4DB6AC] rounded-full mt-1.5 shrink-0' }),
              intel
            ))
          )
        )
  )
);
