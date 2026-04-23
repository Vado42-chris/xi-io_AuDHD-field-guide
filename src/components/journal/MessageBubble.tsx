import React from 'react';
import { JournalMessage } from '../../types/core';

interface MessageBubbleProps {
  message: JournalMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`fg-message-row ${isUser ? 'fg-message-row-user' : 'fg-message-row-ibal'}`}>
      <div className={`fg-message-bubble fg-glass ${isUser ? 'fg-message-bubble-user' : 'fg-message-bubble-ibal'}`}>
        <div className="fg-kicker" style={{ marginBottom: 8 }}>{isUser ? 'You' : 'ibal'}</div>
        <div className="fg-message-text">{message.text}</div>
      </div>
    </div>
  );
};

export default MessageBubble;