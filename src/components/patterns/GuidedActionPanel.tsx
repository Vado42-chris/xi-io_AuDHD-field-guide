import React from 'react';

interface GuidedActionPanelProps {
  kicker: string;
  body: string;
  textareaValue?: string;
  textareaPlaceholder?: string;
  onTextareaChange?: (value: string) => void;
  actions: Array<{ label: string; onClick: () => void }>;
}

export const GuidedActionPanel: React.FC<GuidedActionPanelProps> = ({
  kicker,
  body,
  textareaValue,
  textareaPlaceholder,
  onTextareaChange,
  actions,
}) => {
  return (
    <div className="fg-panel-stack fg-glass" style={{ padding: 14, borderRadius: 14, marginTop: 14 }}>
      <div className="fg-kicker">{kicker}</div>
      <div className="fg-card-copy">{body}</div>
      {onTextareaChange ? (
        <textarea
          className="fg-textarea"
          value={textareaValue ?? ''}
          onChange={(e) => onTextareaChange(e.target.value)}
          placeholder={textareaPlaceholder}
        />
      ) : null}
      <div className="fg-chip-row">
        {actions.map((action) => (
          <button key={action.label} type="button" className="fg-choice-chip fg-glass" onClick={action.onClick}>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GuidedActionPanel;