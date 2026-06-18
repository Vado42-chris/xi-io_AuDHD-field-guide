import React from 'react';

interface SupportCardProps {
  kicker: string;
  title: string;
  body: string;
  onSelect?: () => void;
  active?: boolean;
}

export const SupportCard: React.FC<SupportCardProps> = ({ kicker, title, body, onSelect, active = false }) => {
  const Component = onSelect ? 'button' : 'article';

  return (
    <Component
      {...(onSelect ? { type: 'button', onClick: onSelect } : {})}
      className="fg-card fg-glass fg-support-card"
      data-active={active}
    >
      <div className="fg-kicker">{kicker}</div>
      <h2 className="fg-card-title">{title}</h2>
      <p className="fg-card-copy">{body}</p>
    </Component>
  );
};

export default SupportCard;