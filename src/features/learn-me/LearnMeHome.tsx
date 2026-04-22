import React from 'react';
import LearningSignalCard from '../../components/learn-me/LearningSignalCard';
import MemoryVaultEntryCard from '../../components/learn-me/MemoryVaultEntryCard';
import MemoryVaultSummaryCard from '../../components/learn-me/MemoryVaultSummaryCard';
import PatternEvidenceItemCard from '../../components/learn-me/PatternEvidenceItemCard';
import PatternEvidenceSummaryCard from '../../components/learn-me/PatternEvidenceSummaryCard';
import PatternReviewSummaryCard from '../../components/learn-me/PatternReviewSummaryCard';
import SensorySupportCard from '../../components/learn-me/SensorySupportCard';
import ThresholdSummaryCard from '../../components/learn-me/ThresholdSummaryCard';
import { EvidenceContribution, LearningSignal, MemoryEntryStatus, MemoryVaultEntry, MemoryVaultSummary, PatternEvidenceItem, PatternEvidenceSummary, PatternResolutionStatus, PatternReviewSummary, SensorySupportRecord, ThresholdSummary } from '../../types/core';

interface LearnMeHomeProps {
  signals: LearningSignal[];
  sensorySupports: SensorySupportRecord[];
  memoryEntries: MemoryVaultEntry[];
  memorySummary: MemoryVaultSummary;
  journalEvidence: EvidenceContribution[];
  supportEvidence: EvidenceContribution[];
  evidenceIntakeSummary: { total: number; journal: number; support: number; confirmed: number; latestSource?: string };
  supportEvidenceSummary: { total: number; confirmed: number; latestSource?: string };
  evidenceItems: PatternEvidenceItem[];
  evidenceSummary: PatternEvidenceSummary;
  summary: PatternReviewSummary;
  thresholdSummary: ThresholdSummary;
  onConfirmSignal: (signalId: string) => void;
  onConfirmSensory: (recordId: string) => void;
  onToggleEvidenceContested: (itemId: string) => void;
  onResolveEvidence: (itemId: string, nextStatus: PatternResolutionStatus, note: string) => void;
  onSaveMemoryEntry: (entryId: string, summary: string, confirmedTags: string[], status: MemoryEntryStatus, notes: string) => void;
}

const sourceLabel = (source: EvidenceContribution['source']) => {
  switch (source) {
    case 'support_outcome': return 'Support outcome';
    case 'trial_reflection': return 'Optional note';
    case 'revalidation': return 'Fresh check';
    case 'journal': return 'Journal';
    case 'manual': return 'Manual';
    case 'customization': return 'Customization';
    default: return 'Evidence';
  }
};

export const LearnMeHome: React.FC<LearnMeHomeProps> = ({
  signals,
  sensorySupports,
  memoryEntries,
  memorySummary,
  journalEvidence,
  supportEvidence,
  evidenceIntakeSummary,
  supportEvidenceSummary,
  evidenceItems,
  evidenceSummary,
  summary,
  thresholdSummary,
  onConfirmSignal,
  onConfirmSensory,
  onToggleEvidenceContested,
  onResolveEvidence,
  onSaveMemoryEntry,
}) => {
  const stressors = signals.filter((signal) => signal.kind === 'stressor');
  const destressers = signals.filter((signal) => signal.kind === 'destresser');
  const sharedEvidencePreview = [...journalEvidence.slice(0, 3), ...supportEvidence.slice(0, 3)]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6);

  return (
    <div className="fg-content-card fg-glass fg-help-layout">
      <div className="fg-header">
        <div className="fg-kicker">Learn Me</div>
        <h1 className="fg-section-title">Readable patterns, without pretending certainty.</h1>
        <p className="fg-section-body">
          Journal memory and Help Now activity now enter the same shared evidence intake. This keeps the app from learning through separate lanes that never meet.
        </p>
      </div>

      <ThresholdSummaryCard summary={thresholdSummary} />
      <PatternReviewSummaryCard summary={summary} />
      <MemoryVaultSummaryCard summary={memorySummary} />
      <PatternEvidenceSummaryCard summary={evidenceSummary} />

      <section className="fg-panel-stack">
        <div className="fg-kicker">Shared evidence intake</div>
        <div className="fg-state-meta">
          {evidenceIntakeSummary.total > 0
            ? `${evidenceIntakeSummary.total} evidence items are in view, ${evidenceIntakeSummary.journal} from journal memory, ${evidenceIntakeSummary.support} from support activity, with ${evidenceIntakeSummary.confirmed} already at confirmed strength.`
            : 'As journal memory and support activity build up, they will flow into the same intake here.'}
        </div>
        <div className="fg-grid">
          {sharedEvidencePreview.length > 0 ? (
            sharedEvidencePreview.map((item) => (
              <div key={item.id} className="fg-card fg-glass fg-learning-card">
                <div className="fg-kicker">{sourceLabel(item.source)}</div>
                <h2 className="fg-card-title">{item.summary}</h2>
                <p className="fg-card-copy">Confidence: {item.confidence}</p>
                {item.tags.length > 0 ? <p className="fg-card-copy">Tags: {item.tags.join(', ')}</p> : null}
              </div>
            ))
          ) : (
            <div className="fg-state-meta">No shared evidence yet. Journal summaries and support outcomes will appear here as they build up.</div>
          )}
        </div>
      </section>

      <section className="fg-panel-stack">
        <div className="fg-kicker">Support evidence coming in</div>
        <div className="fg-state-meta">
          {supportEvidenceSummary.total > 0
            ? `${supportEvidenceSummary.total} support-derived evidence items are in view, with ${supportEvidenceSummary.confirmed} already at confirmed strength.`
            : 'This is what the app is learning from recent support attempts, optional notes, and fresh checks.'}
        </div>
        <div className="fg-grid">
          {supportEvidence.length > 0 ? (
            supportEvidence.map((item) => (
              <div key={item.id} className="fg-card fg-glass fg-learning-card">
                <div className="fg-kicker">{sourceLabel(item.source)}</div>
                <h2 className="fg-card-title">{item.summary}</h2>
                <p className="fg-card-copy">Confidence: {item.confidence}</p>
                {item.tags.length > 0 ? <p className="fg-card-copy">Tags: {item.tags.join(', ')}</p> : null}
              </div>
            ))
          ) : (
            <div className="fg-state-meta">No support evidence yet. As Help Now outcomes, notes, and fresh checks build up, they will appear here.</div>
          )}
        </div>
      </section>

      <section className="fg-panel-stack">
        <div className="fg-kicker">Pattern evidence inspector</div>
        <div className="fg-grid">
          {evidenceItems.length > 0 ? (
            evidenceItems.map((item) => (
              <PatternEvidenceItemCard
                key={item.id}
                item={item}
                onToggleContested={() => onToggleEvidenceContested(item.id)}
                onResolve={(nextStatus, note) => onResolveEvidence(item.id, nextStatus, note)}
              />
            ))
          ) : (
            <div className="fg-state-meta">No pattern evidence items yet. More memory and support history will make this layer useful.</div>
          )}
        </div>
      </section>

      <section className="fg-panel-stack">
        <div className="fg-kicker">Memory vault entries</div>
        <div className="fg-grid">
          {memoryEntries.length > 0 ? (
            memoryEntries.map((entry) => (
              <MemoryVaultEntryCard key={entry.id} entry={entry} onSave={onSaveMemoryEntry} />
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