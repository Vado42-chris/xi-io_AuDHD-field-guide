import React from 'react';
import { Icons } from './icons.ts';

// Presentational shell panel. Locked overlay is visual only; do not add auth,
// billing, routing, storage, or provider behavior here.
export const Panel: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  locked?: boolean;
}> = ({ children, className = '', onClick, locked }) => React.createElement(
  'section',
  {
    onClick: !locked ? onClick : undefined,
    className: `xi-panel p-8 relative overflow-hidden ${className} ${onClick && !locked ? 'cursor-pointer hover:border-[#4DB6AC]/40' : ''}`,
  },
  locked && React.createElement(
    'div',
    { className: 'absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6' },
    React.createElement(Icons.Vault, { className: 'text-[#4DB6AC] mb-2' }),
    React.createElement('div', { className: 'text-[10px] font-black uppercase tracking-widest text-[#4DB6AC]' }, 'Uplink Restricted'),
    React.createElement('p', { className: 'text-[8px] opacity-40 uppercase mt-1' }, 'Upgrade to Pro Neural Link')
  ),
  children
);
