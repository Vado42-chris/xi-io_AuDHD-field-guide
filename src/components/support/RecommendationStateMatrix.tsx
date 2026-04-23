import React from 'react';
import { getDisplayStateLabel } from '../../lib/state/stateLabels';
import { CustomStateLabel, RecommendationLedgerItem } from '../../types/core';

interface RecommendationStateMatrixProps {
  item: RecommendationLedgerItem;
  customStates?: CustomStateLabel[];
}

export const RecommendationStateMatrix: React.FC<RecommendationStateMatrixProps> = ({ item, customStates = [] }) => {
  return (
    <section className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">State comparison</div>
      <h2 className="fg-card-title">{item.title} across states</h2>
      <div className="fg-grid" style={{ marginTop: 14 }}>
        {item.stateTrustMap.map((trust) => (
          <div key={trust.state} className="fg-glass" style={{ padding: 12, borderRadius: 14 }}>
            <div className="fg-kicker">{getDisplayStateLabel(trust.state, customStates)}</div>
            <div className="fg-card-copy">Availability: {trust.availability}</div>
            <div className="fg-card-copy">Confidence: {trust.confidence}</div>
            <div className="fg-card-copy">Rank: {trust.rankScore}</div>
            <div className="fg-card-copy">Performance: {trust.performanceScore}</div>
            <div className="fg-card-copy">Recovery: {trust.recoveryScore}</div>
            <div className="fg-card-copy">Transfer learning: {trust.transferLearningScore}</div>
            <div className="fg-card-copy">Learned transfer trust: {trust.learnedTransferTrust}</div>
            <div className="fg-state-meta">Outcomes logged: {trust.outcomeHistory.length}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendationStateMatrix;