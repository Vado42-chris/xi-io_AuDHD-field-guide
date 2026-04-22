import React from 'react';
import { RecommendationLedgerItem } from '../../types/core';

interface RecommendationStateMatrixProps {
  item: RecommendationLedgerItem;
}

export const RecommendationStateMatrix: React.FC<RecommendationStateMatrixProps> = ({ item }) => {
  return (
    <section className="fg-card fg-glass fg-learning-card">
      <div className="fg-kicker">State comparison</div>
      <h2 className="fg-card-title">{item.title} across states</h2>
      <div className="fg-grid" style={{ marginTop: 14 }}>
        {item.stateTrustMap.map((trust) => (
          <div key={trust.state} className="fg-glass" style={{ padding: 12, borderRadius: 14 }}>
            <div className="fg-kicker">{trust.state}</div>
            <div className="fg-card-copy">Current status: {trust.availability.replace('_', ' ')}</div>
            <div className="fg-card-copy">Confidence: {trust.confidence}</div>
            <div className="fg-card-copy">Trust mix: {trust.directTrustPercent}% normal use, {trust.transferTrustPercent}% supervised retries</div>
            <div className="fg-card-copy">Same-state results score: {trust.performanceScore}</div>
            <div className="fg-card-copy">Recovery push: {trust.recoveryScore}</div>
            <div className="fg-card-copy">Retry learning: {trust.learnedTransferTrust}</div>
            <div className="fg-state-meta">Outcomes logged: {trust.outcomeHistory.length}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendationStateMatrix;