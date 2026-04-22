import React, { useMemo, useState } from 'react';
import RecommendationLedgerCard from '../../components/support/RecommendationLedgerCard';
import RecommendationStateMatrix from '../../components/support/RecommendationStateMatrix';
import TransferTrustLegend from '../../components/support/TransferTrustLegend';
import SupportCard from '../../components/support/SupportCard';
import {
  ActiveTrial,
  CanonicalStateId,
  CurrentState,
  RecommendationLedgerItem,
  RevalidationResult,
  SupportOutcome,
  ThresholdSummary,
  TransferDecision,
  TrialReflectionRecord,
} from '../../types/core';

interface HelpNowHomeProps {
  currentState: CurrentState;
  thresholdSummary: ThresholdSummary;
  personalizedSupports: Array<unknown>;
  recommendationLedger: RecommendationLedgerItem[];
  activeTrial: ActiveTrial | null;
  onApplyRouteState: (canonicalId: CanonicalStateId) => void;
  onStartTrial: (recommendationId: string, supportTitle: string) => void;
  onClearTrial: () => void;
  onLogOutcome: (supportTitle: string, supportRoute: string, outcome: SupportOutcome, recommendationId?: string) => void;
  onSaveTrialReflection: (supportTitle: string, outcome: SupportOutcome, prompt: TrialReflectionRecord['prompt'], note: string, recommendationId?: string) => void;
  onReviewTransfer: (recommendationId: string, transferSafety: RecommendationLedgerItem['transferSafety'], transferWarning: string | undefined, decision: TransferDecision, reason: string) => void;
  onRevalidateSupport: (recommendationId: string, result: RevalidationResult, note: string) => void;
  recentOutcomeSummary?: string;
}

interface StarterSupport {
  title: string;
  body: string;
}

const ROUTES: Array<{ id: CanonicalStateId; title: string; body: string }> = [
  { id: 'in_pain', title: 'Pain spike', body: 'Pain-aware support comes first when the body is leading everything else.' },
  { id: 'overloaded', title: 'Overloaded', body: 'Too much input, too many demands, or too much happening at once.' },
  { id: 'activated', title: 'Activated', body: 'For hot, reactive, panicky, or emotionally up states.' },
  { id: 'shut_down', title: 'Shut down', body: 'For collapse, numbness, or needing lower-demand support.' },
  { id: 'stuck', title: 'Stuck', body: 'For task lock, avoidance, indecision, and getting going again.' },
  { id: 'unclear', title: 'Unclear', body: 'When the user does not know yet and just needs a calmer first action.' },
];

const STARTER_SUPPORTS: Record<CanonicalStateId, StarterSupport[]> = {
  steady: [
    { title: 'Light reset', body: 'Take one slower breath and choose the next tiny helpful action.' },
    { title: 'Keep it steady', body: 'Stay with what is working and avoid turning this into a bigger task.' },
  ],
  in_pain: [
    { title: 'Reduce alarm, not all pain', body: 'Unclench one area, reduce one sensory stressor, and do not force deep breathing.' },
    { title: 'Pain-aware pause', body: 'Change position, lower input, and delay any non-urgent decisions for a few minutes.' },
  ],
  overloaded: [
    { title: 'Reduce input', body: 'Lower one source of sound, light, conversation, or task pressure immediately.' },
    { title: 'Shrink the field', body: 'Pick one thing to ignore for 10 minutes so your system has less to carry.' },
  ],
  activated: [
    { title: 'Do less first', body: 'Do not reply yet. Step back, cool the body, and slow the next action down.' },
    { title: 'Longer exhale', body: 'Use a gentle longer exhale pattern instead of big deep breaths.' },
  ],
  shut_down: [
    { title: 'One tiny step', body: 'Choose the smallest possible action that proves movement is still available.' },
    { title: 'Reduce demand language', body: 'Do not ask for a plan. Ask only what would make this 5 percent easier.' },
  ],
  stuck: [
    { title: 'Break the first edge', body: 'Touch the task, do not finish the task. Open it, name it, or move one piece.' },
    { title: 'Externalize the next step', body: 'Say or write the next tiny action so it does not have to stay in your head.' },
  ],
  unclear: [
    { title: 'Start with the body', body: 'Lower one source of friction and notice whether the body or environment is louder.' },
    { title: 'Pick the safest support', body: 'Choose the least demanding support first, then decide if you need more.' },
  ],
};

const OUTCOMES: Array<{ id: SupportOutcome; label: string }> = [
  { id: 'helped', label: 'Helped' },
  { id: 'a_little', label: 'A little' },
  { id: 'no_change', label: 'No change' },
  { id: 'worse', label: 'Worse' },
  { id: 'skipped', label: 'Skipped' },
];

const buildWhyTheseFirst = (items: RecommendationLedgerItem[]) => {
  const first = items[0];
  if (!first) return 'No tailored supports are ready yet.';
  if (first.trustFreshness === 'fresh') return 'These come first because they are the strongest current fit and have been confirmed more recently.';
  if (first.availability === 'recovering') return 'These come first because they still fit now, even though they are being re-tested carefully.';
  return 'These come first because they are the safest current fit from what the app knows right now.';
};

const groupRecommendations = (items: RecommendationLedgerItem[]) => {
  const bestFitNow = items.filter((item) => item.availability === 'active' && item.trustFreshness === 'fresh');
  const worthTryingCarefully = items.filter((item) => item.availability === 'recovering' || (item.availability === 'active' && item.trustFreshness === 'aging'));
  const needsFreshCheck = items.filter((item) => item.trustFreshness === 'needs_recheck' && item.availability !== 'avoid_for_now');
  const avoidForNow = items.filter((item) => item.availability === 'avoid_for_now');
  return { bestFitNow, worthTryingCarefully, needsFreshCheck, avoidForNow };
};

const formatTrialElapsed = (startedAt: number) => {
  const diffMs = Date.now() - startedAt;
  const minutes = Math.max(0, Math.floor(diffMs / (60 * 1000)));
  if (minutes <= 0) return 'Started just now';
  if (minutes === 1) return 'Started 1 minute ago';
  if (minutes < 60) return `Started ${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return 'Started 1 hour ago';
  return `Started ${hours} hours ago`;
};

const getReflectionPrompt = (outcome: SupportOutcome): { id: TrialReflectionRecord['prompt']; label: string } => {
  if (outcome === 'helped') return { id: 'what_helped', label: 'What part helped?' };
  if (outcome === 'worse') return { id: 'what_made_it_harder', label: 'What made it harder?' };
  return { id: 'what_changed', label: 'What changed?' };
};

export const HelpNowHome: React.FC<HelpNowHomeProps> = ({
  currentState,
  thresholdSummary,
  recommendationLedger,
  activeTrial,
  onApplyRouteState,
  onStartTrial,
  onClearTrial,
  onLogOutcome,
  onSaveTrialReflection,
  onReviewTransfer,
  onRevalidateSupport,
  recentOutcomeSummary,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<CanonicalStateId>(currentState.canonicalId);
  const [selectedSupportTitle, setSelectedSupportTitle] = useState<string | null>(null);
  const [pendingReflection, setPendingReflection] = useState<{ supportTitle: string; outcome: SupportOutcome; recommendationId?: string } | null>(null);
  const [reflectionNote, setReflectionNote] = useState('');

  const activeSupports = useMemo(() => STARTER_SUPPORTS[selectedRoute] || STARTER_SUPPORTS.unclear, [selectedRoute]);
  const groupedRecommendations = useMemo(() => groupRecommendations(recommendationLedger), [recommendationLedger]);
  const selectedLedgerItem = recommendationLedger.find((item) => item.title === selectedSupportTitle);
  const activeTrialElapsed = useMemo(() => (activeTrial ? formatTrialElapsed(activeTrial.startedAt) : null), [activeTrial]);

  const handleRouteSelect = (routeId: CanonicalStateId) => {
    setSelectedRoute(routeId);
    setSelectedSupportTitle(null);
    onApplyRouteState(routeId);
  };

  const handleOutcome = (outcome: SupportOutcome) => {
    const titleToUse = selectedSupportTitle || activeTrial?.supportTitle;
    const recommendationIdToUse = selectedLedgerItem?.id || activeTrial?.recommendationId;
    if (!titleToUse) return;
    onLogOutcome(titleToUse, selectedRoute, outcome, recommendationIdToUse);
    setPendingReflection({ supportTitle: titleToUse, outcome, recommendationId: recommendationIdToUse });
    setReflectionNote('');
  };

  const handleSaveReflection = () => {
    if (!pendingReflection || !reflectionNote.trim()) return;
    const prompt = getReflectionPrompt(pendingReflection.outcome);
    onSaveTrialReflection(pendingReflection.supportTitle, pendingReflection.outcome, prompt.id, reflectionNote, pendingReflection.recommendationId);
    setPendingReflection(null);
    setReflectionNote('');
  };

  const hasTailoredSupports = recommendationLedger.length > 0;
  const isCautious = thresholdSummary.suggestionStability === 'cautious' || !thresholdSummary.canPersonalize;

  const renderRecommendationGroup = (title: string, description: string, items: RecommendationLedgerItem[], allowTryNow = false) => {
    if (items.length === 0) return null;
    return (
      <div className="fg-panel-stack fg-glass" style={{ padding: 18, borderRadius: 18 }}>
        <div className="fg-kicker">{title}</div>
        <div className="fg-state-meta">{description}</div>
        <div className="fg-grid" style={{ marginTop: 12 }}>
          {items.map((item) => (
            <SupportCard
              key={item.id}
              kicker={item.priorityReason}
              title={item.title}
              body={item.body}
              active={selectedSupportTitle === item.title || activeTrial?.recommendationId === item.id}
              onSelect={() => setSelectedSupportTitle(item.title)}
              primaryActionLabel={allowTryNow ? (activeTrial?.recommendationId === item.id ? 'Trying now' : 'Try this now') : undefined}
              onPrimaryAction={allowTryNow ? () => onStartTrial(item.id, item.title) : undefined}
            />
          ))}
        </div>
      </div>
    );
  };

  const reflectionPrompt = pendingReflection ? getReflectionPrompt(pendingReflection.outcome) : null;

  return (
    <div className="fg-content-card fg-glass fg-help-layout">
      <div className="fg-header">
        <div className="fg-kicker">Help Now</div>
        <h1 className="fg-section-title">A calmer first action, not a dashboard.</h1>
        <p className="fg-section-body">
          Pick what feels closest right now, get a low-demand starter support, and log whether it helped.
          Recommendation trust is state-specific, guarded transfers can be reviewed, and older trust can ask for a simple fresh check instead of quietly fading in the background.
        </p>
      </div>

      <div className="fg-help-meta">
        <div className="fg-meta-pill fg-glass">Current state: {currentState.label} · {currentState.intensity}</div>
        <div className="fg-meta-pill fg-glass">Threshold: {thresholdSummary.readiness}</div>
        <div className="fg-meta-pill fg-glass">Suggestion mode: {thresholdSummary.suggestionStability}</div>
        {recentOutcomeSummary ? <div className="fg-meta-pill fg-glass">Latest outcome: {recentOutcomeSummary}</div> : null}
      </div>

      {activeTrial ? (
        <section className="fg-panel-stack fg-glass" style={{ padding: 18, borderRadius: 18 }}>
          <div className="fg-kicker">Currently trying</div>
          <div className="fg-card-copy">You are currently trying “{activeTrial.supportTitle}”. {activeTrialElapsed}.</div>
          <div className="fg-state-meta">When you feel ready, tell the app how it went. There is no rush.</div>
          <div className="fg-chip-row">
            <button type="button" className="fg-choice-chip fg-glass" onClick={onClearTrial}>Clear</button>
          </div>
        </section>
      ) : null}

      <section className="fg-panel-stack">
        <div className="fg-kicker">What feels closest right now?</div>
        <div className="fg-grid">
          {ROUTES.map((route) => (
            <SupportCard
              key={route.id}
              kicker="Starter path"
              title={route.title}
              body={route.body}
              active={selectedRoute === route.id}
              onSelect={() => handleRouteSelect(route.id)}
            />
          ))}
        </div>
      </section>

      {hasTailoredSupports ? (
        <section className="fg-panel-stack">
          <div className="fg-kicker">{isCautious ? 'Cautious supports' : 'Tailored supports'}</div>
          <div className="fg-state-meta">Why these first: {buildWhyTheseFirst(recommendationLedger)}</div>
          {renderRecommendationGroup('Best fit now', 'These are the strongest current fit and need the least extra interpretation.', groupedRecommendations.bestFitNow, true)}
          {renderRecommendationGroup('Worth trying carefully', 'These may still help, but they need a little more care or a gentler retry.', groupedRecommendations.worthTryingCarefully)}
          {renderRecommendationGroup('Needs a fresh check', 'These used to help or still look promising, but they need a quick re-check before leaning on them.', groupedRecommendations.needsFreshCheck)}
          {renderRecommendationGroup('Avoid for now', 'These have enough recent friction or failed checks that they should stay out of the active queue for now.', groupedRecommendations.avoidForNow)}
          {selectedLedgerItem ? (
            <>
              <RecommendationLedgerCard item={selectedLedgerItem} onReviewTransfer={onReviewTransfer} onRevalidateSupport={onRevalidateSupport} />
              <RecommendationStateMatrix item={selectedLedgerItem} />
              <TransferTrustLegend />
            </>
          ) : null}
        </section>
      ) : (
        <section className="fg-panel-stack fg-glass" style={{ padding: 18, borderRadius: 18 }}>
          <div className="fg-kicker">Tailored supports are gated</div>
          <div className="fg-state-meta">{thresholdSummary.message}</div>
        </section>
      )}

      <section className="fg-panel-stack">
        <div className="fg-kicker">Starter supports</div>
        <div className="fg-grid">
          {activeSupports.map((support) => (
            <SupportCard
              key={support.title}
              kicker="Safe first action"
              title={support.title}
              body={support.body}
              active={selectedSupportTitle === support.title}
              onSelect={() => setSelectedSupportTitle(support.title)}
            />
          ))}
        </div>
      </section>

      <section className="fg-outcome-stack fg-glass" style={{ padding: 18, borderRadius: 18 }}>
        <div>
          <div className="fg-kicker">Did it help?</div>
          <div className="fg-state-meta">
            {activeTrial?.supportTitle
              ? `When you are done with “${activeTrial.supportTitle}”, tell the app how it went.`
              : selectedSupportTitle
                ? `Log what happened after trying “${selectedSupportTitle}”.`
                : 'Pick a support first, then log whether it helped.'}
          </div>
        </div>
        <div className="fg-outcome-row">
          {OUTCOMES.map((outcome) => (
            <button
              key={outcome.id}
              type="button"
              className="fg-choice-chip fg-glass"
              onClick={() => handleOutcome(outcome.id)}
              disabled={!selectedSupportTitle && !activeTrial}
            >
              {outcome.label}
            </button>
          ))}
        </div>
        {pendingReflection && reflectionPrompt ? (
          <div className="fg-panel-stack fg-glass" style={{ padding: 14, borderRadius: 14, marginTop: 14 }}>
            <div className="fg-kicker">Optional note</div>
            <div className="fg-card-copy">{reflectionPrompt.label}</div>
            <textarea
              className="fg-textarea"
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value)}
              placeholder="You can leave a short note here, or skip it."
            />
            <div className="fg-chip-row">
              <button type="button" className="fg-choice-chip fg-glass" onClick={handleSaveReflection}>Save note</button>
              <button type="button" className="fg-choice-chip fg-glass" onClick={() => { setPendingReflection(null); setReflectionNote(''); }}>Skip</button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default HelpNowHome;