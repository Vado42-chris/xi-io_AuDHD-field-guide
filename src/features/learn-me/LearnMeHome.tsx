import React from 'react';
import LearningSignalCard from '../../components/learn-me/LearningSignalCard';
import PatternReviewSummaryCard from '../../components/learn-me/PatternReviewSummaryCard';
import SensorySupportCard from '../../components/learn-me/SensorySupportCard';
import ThresholdSummaryCard from '../../components/learn-me/ThresholdSummaryCard';
import { LearningSignal, PatternReviewSummary, SensorySupportRecord, ThresholdSummary } from '../../types/core';

interface LearnMeHomeProps {
  signals: LearningSignal[];
  sensorySupports: SensorySupportRecord[];
  summary: PatternReviewSummary;
  thresholdSummary: ThresholdSummary;
  onConfirmSignal: (signalId: string) => void;
  onConfirmSensory: (recordId: string) => void;
}

export const LearnMeHome: React.FC<LearnMeHomeProps> = ({
  signals,
  sensorySupports,
  summary,
  thresholdSummary,
  onConfirmSignal,
  onConfirmSensory,
}) => {
  const stressors = signals.filter((signal) => signal.kind === 'stressor');
  const destressers = signals.filter((signal) => signal.kind === 'destresser');

  return (
    <div className="fg-content-card fg-glass fg-help-layout">
      <div className="fg-header">
        <div className="fg-kicker">Learn Me</div>
        <h1 className="fg-section-title">Readable patterns, without pretending certainty.</h1>
        <p className="fg-section-body">
          This slice adds threshold visibility on top of pattern review. The app now shows whether it is still learning,
          warming up, or ready for tailored support, and makes that gate explicit instead of hidden.
        </p>
      </div>

      <ThresholdSummaryCard summary={thresholdSummary} />
      <PatternReviewSummaryCard summary={summary} />

      <section className="fg-panel-stack">
        <div className="fg-kicker">Stressors</div>
        <div className="fg-grid">
          {stressors.length > 0 ? (
            stressors.map((signal) => (
              <LearningSignalCard key={signal.id} signal={signal} onConfirm={() => onConfirmSignal(signal.id)} />
            ))
          ) : (
            <div className="fg-state-meta">No stressor candidates yet. More journal and support history will make this clearer.</div>
          )}
        </div>
      </section>

      <section className="fg-panel-stack">
        <div className="fg-kicker">De-stressers</div>
        <div className="fg-grid">
          {destressers.length > 0 ? (
            destressers.map((signal) => (
              <LearningSignalCard key={signal.id} signal={signal} onConfirm={() => onConfirmSignal(signal.id)} />
            ))
          ) : (
            <div className="fg-state-meta">No de-stresser candidates yet. Confirmed helpful supports will surface here.</div>
          )}
        </div>
      </section>

      <section className="fg-panel-stack">
        <div className="fg-kicker">Sensory supports</div>
        <div className="fg-grid">
          {sensorySupports.length > 0 ? (
            sensorySupports.map((record) => (
              <SensorySupportCard key={record.id} record={record} onConfirm={() => onConfirmSensory(record.id)} />
            ))
          ) : (
            <div className="fg-state-meta">No sensory support records yet. Supports tied to sound, light, pressure, temperature, and reduction will appear here.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LearnMeHome;