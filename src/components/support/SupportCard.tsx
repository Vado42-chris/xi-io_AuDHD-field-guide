import React from 'react';

interface SupportCardProps {
  kicker: string;
  title: string;
  body: string;
  onSelect?: () => void;
  active?: boolean;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
}

export const SupportCard: React.FC<SupportCardProps> = ({
  kicker,
  title,
  body,
  onSelect,
  active = false,
  primaryActionLabel,
  onPrimaryAction,
}) => {
  const Component = onSelect ? 'button' : 'article';

  return (
    <div className="fg-card fg-glass fg-support-card" data-active={active}>
      <Component
        {...(onSelect ? { type: 'button', onClick: onSelect } : {})}
        className="fg-panel-stack"
        style={{ background: 'transparent', border: 'none', padding: 0, textAlign: 'left', width: '100%' }}
      >
        <div className="fg-kicker">{kicker}</div>
        <h2 className="fg-card-title">{title}</h2>
        <p className="fg-card-copy">{body}</p>
      </Component>
      {primaryActionLabel && onPrimaryAction ? (
        <button type="button" className="fg-choice-chip fg-glass" onClick={onPrimaryAction}>
          {primaryActionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default SupportCard;