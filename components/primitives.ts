import React from 'react';

// Shared presentation primitives. Keep these free of app state and service calls.
export const MetaLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => React.createElement(
  'div',
  { className: `text-[10px] font-black tracking-[0.25em] uppercase text-[#4DB6AC] mb-2 leading-none whitespace-nowrap ${className}` },
  children
);

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  primary?: boolean;
  disabled?: boolean;
  danger?: boolean;
}> = ({ children, onClick, className = '', primary, disabled, danger }) => React.createElement(
  'button',
  {
    disabled,
    onClick,
    className: `xi-button ${primary ? 'xi-button-primary' : danger ? 'border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10' : 'xi-button-secondary'} ${disabled ? 'opacity-30' : ''} ${className}`,
  },
  children
);
