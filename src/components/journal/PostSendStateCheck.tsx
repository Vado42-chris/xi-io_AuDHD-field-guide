import React from 'react';
import { CurrentState } from '../../types/core';

interface PostSendStateCheckProps {
  currentState: CurrentState;
  onKeep: () => void;
  onUpdate: () => void;
}

export const PostSendStateCheck: React.FC<PostSendStateCheckProps> = ({ currentState, onKeep, onUpdate }) => {
  return (
    <section className="fg-glass fg-post-send-check">
      <div>
        <div className="fg-kicker">After you send</div>
        <div className="fg-state-meta">Still feeling {currentState.label.toLowerCase()} · {currentState.intensity}?</div>
      </div>
      <div className="fg-chip-row">
        <button type="button" className="fg-choice-chip fg-glass" onClick={onKeep}>Yes</button>
        <button type="button" className="fg-choice-chip fg-glass" onClick={onUpdate}>Update</button>
      </div>
    </section>
  );
};

export default PostSendStateCheck;