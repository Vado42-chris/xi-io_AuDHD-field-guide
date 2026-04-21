import React from 'react';
import LearningSignalCard from '../../components/learn-me/LearningSignalCard';
import MemoryVaultEntryCard from '../../components/learn-me/MemoryVaultEntryCard';
import MemoryVaultSummaryCard from '../../components/learn-me/MemoryVaultSummaryCard';
import PatternReviewSummaryCard from '../../components/learn-me/PatternReviewSummaryCard';
import SensorySupportCard from '../../components/learn-me/SensorySupportCard';
import ThresholdSummaryCard from '../../components/learn-me/ThresholdSummaryCard';
import { LearningSignal, MemoryVaultEntry, MemoryVaultSummary, PatternReviewSummary, SensorySupportRecord, ThresholdSummary } from '../../types/core';

interface LearnMeHomeProps {
  signals: LearningSignal[];
  sensorySupports: SensorySupportRecord[];
  memoryEntries: MemoryVaultEntry[];
  memorySummary: MemoryVaultSummary;
  summary: PatternReviewSummary;
  thresholdSummary: ThresholdSummary;
  onConfirmSignal: (signalId: string) => void;
  onConfirmSensory: (recordId: string) => void;
  onConfirmMemoryEntry: (entryId: string) => void;
}

export const LearnMeHome: React.FC<LearnMeHomeProps> = ({
  signals,
  sensorySupports,
  memoryEntries,
  memorySummary,
  summary,
  thresholdSummary,
  onConfirmSignal,
  onConfirmSensory,
  onConfirmMemoryEntry,
}) => {
  const stressors = signals.filter((signal) => signal.kind === 'stressor');
  const destressers = signals.filter((signal) => signal.kind === 'destresser');

  return (
    <div className="fg-content-card fg-glass fg-help-layout">
      <div className="fg-header">
        <div className="fg-kicker">Learn Me</div>
        <h1 className="fg-section-title">Readable patterns, without pretending certainty.</h1>
        <p className="fg-section-body">
          This slice adds a cross-thread memory vault. Structured memory from individual threads can now be reviewed together,
          confirmed, and used to make pattern evidence more legible across the whole product.
        </p>
      </div>

      <ThresholdSummaryCard summary={thresholdSummary} />
      <PatternReviewSummaryCard summary={summary} />
      <MemoryVaultSummaryCard summary={memorySummary} />

      <section className="fg-panel-stack">
        <div className="fg-kicker">Memory vault entries</div>
        <div className="fg-grid">
          {memoryEntries.length > 0 ? (
            memoryEntries.map((entry) => (
              <MemoryVaultEntryCard key={entry.id} entry={entry} onConfirm={() => onConfirmMemoryEntry(entry.id)} />
            ))
          ) : (
            <div className="fg-state-meta">No memory entries yet. Structured thread memory will appear here as journal threads build up.</div>
          )}
        </div>
      </section>

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