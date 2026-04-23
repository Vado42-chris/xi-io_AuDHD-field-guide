import React, { useEffect, useMemo, useState } from 'react';
import GuidedActionPanel from '../../components/patterns/GuidedActionPanel';
import OutcomeChooser from '../../components/patterns/OutcomeChooser';
import TrialBanner from '../../components/patterns/TrialBanner';
import RecommendationLedgerCard from '../../components/support/RecommendationLedgerCard';
import RecommendationStateMatrix from '../../components/support/RecommendationStateMatrix';
import TransferTrustLegend from '../../components/support/TransferTrustLegend';
import SupportCard from '../../components/support/SupportCard';
import { getDisplayStateLabel } from '../../lib/state/stateLabels';
import {
  ActiveTrial,
  CanonicalStateId,
  CurrentState,
  CustomStateLabel,
  RecommendationLedgerItem,
  RevalidationResult,
  SensorySupportRecord,
  SupportOutcome,
  ThresholdSummary,
  TransferDecision,
  TrialReflectionRecord,
} from '../../types/core';

interface HelpNowHomeProps {
  currentState: CurrentState;
  customStates: CustomStateLabel[];
  thresholdSummary: ThresholdSummary;
  personalizedSupports: Array<unknown>;
  recommendationLedger: RecommendationLedgerItem[];
  activeTrial: ActiveTrial | null;
  favoriteComfortTools: SensorySupportRecord[];
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

const READINESS_DISMISSED_KEY = 'fg_help_now_readiness_guide_dismissed_v1';

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
  if (first.status.trustFreshness === 'fresh') return 'These come first because they are the strongest current fit and have been confirmed more recently.';
  if (first.status.availability === 'recovering') return 'These come first because they still fit now, even though they are being re-tested carefully.';
  return 'These come first because they are the safest current fit from what the app knows right now.';
};

const buildReadinessGuideBody = (thresholdSummary: ThresholdSummary) => {
  if (thresholdSummary.readiness === 'not_ready') {
    return 'The app can help you right away with starter supports, state check-ins, and gentle logging. Personalized suggestions are still warming up, so the safest path is to use the app, log what happened, and let the evidence build first.';
  }
  if (thresholdSummary.readiness === 'warming_up') {
    return 'The app has started learning from your entries and support attempts. Personalized suggestions may appear, but they should still be treated as cautious and checked against what actually happens.';
  }
  return 'The app has enough evidence to start giving more grounded personalized suggestions. Keep logging outcomes so it can stay current and notice when something changes.';
};

const groupRecommendations = (items: RecommendationLedgerItem[]) => {
  const bestFitNow = items.filter((item) => item.status.availability === 'active' && item.status.trustFreshness === 'fresh');
  const worthTryingCarefully = items.filter((item) => item.status.availability === 'recovering' || (item.status.availability === 'active' && item.status.trustFreshness === 'aging'));
  const needsFreshCheck = items.filter((item) => item.status.trustFreshness === 'needs_recheck' && item.status.availability !== 'avoid_for_now');
  const avoidForNow = items.filter((item) => item.status.availability === 'avoid_for_now');
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
  customStates,
  thresholdSummary,
  recommendationLedger,
  activeTrial,
  favoriteComfortTools,
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
  const [readinessGuideDismissed, setReadinessGuideDismissed] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(READINESS_DISMISSED_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [showMoreRecommendations, setShowMoreRecommendations] = useState(false);
  const [showSelectedRecommendationDetails, setShowSelectedRecommendationDetails] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(READINESS_DISMISSED_KEY, readinessGuideDismissed ? 'true' : 'false');
    } catch {
      // ignore storage failures in restricted environments
    }
  }, [readinessGuideDismissed]);

  const activeSupports = useMemo(() => STARTER_SUPPORTS[selectedRoute] || STARTER_SUPPORTS.unclear, [selectedRoute]);
  const groupedRecommendations = useMemo(() => groupRecommendations(recommendationLedger), [recommendationLedger]);
  const selectedLedgerItem = recommendationLedger.find((item) => item.title === selectedSupportTitle);
  const activeTrialElapsed = useMemo(() => (activeTrial ? formatTrialElapsed(activeTrial.startedAt) : null), [activeTrial]);
  const showReadinessGuide = !readinessGuideDismissed;
  const firstStarterSupport = activeSupports[0];
  const secondaryStarterSupports = activeSupports.slice(1);

  const handleRouteSelect = (routeId: CanonicalStateId) => {
    setSelectedRoute(routeId);
    setSelectedSupportTitle(null);
    setShowSelectedRecommendationDetails(false);
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
  const hasAdditionalRecommendationGroups = groupedRecommendations.worthTryingCarefully.length > 0 || groupedRecommendations.needsFreshCheck.length > 0 || groupedRecommendations.avoidForNow.length > 0;

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
              kicker={item.status.priorityReason}
              title={item.title}
              body={item.body}
              active={selectedSupportTitle === item.title || activeTrial?.recommendationId === item.id}
              onSelect={() => {
                setSelectedSupportTitle(item.title);
                setShowSelectedRecommendationDetails(false);
              }}
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

      {showReadinessGuide ? (
        <GuidedActionPanel
          kicker="How this works right now"
          body={buildReadinessGuideBody(thresholdSummary)}
          actions={[{ label: 'Got it', onClick: () => setReadinessGuideDismissed(true) }]}
        />
      ) : null}

      {favoriteComfortTools.length > 0 ? (
        <section className="fg-panel-stack fg-glass" style={{ padding: 18, borderRadius: 18 }}>
          <div className="fg-kicker">Pinned comforts</div>
          <div className="fg-state-meta">These come from Customize, so the support flow can keep your preferred comfort tools closer at hand.</div>
          <div className="fg-grid">
            {favoriteComfortTools.slice(0, 2).map((tool) => (
              <article key={tool.id} className="fg-card fg-glass">
                <h2 className="fg-card-title">{tool.label}</h2>
                <p className="fg-card-copy">Category: {tool.category}</p>
                <p className="fg-card-copy">Helpful states: {tool.helpfulStates.length > 0 ? tool.helpfulStates.map((state) => getDisplayStateLabel(state, customStates)).join(', ') : 'not learned yet'}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTrial ? (
        <TrialBanner
          title="Currently trying"
          body={`You are currently trying “${activeTrial.supportTitle}”. ${activeTrialElapsed}.`}
          meta="When you feel ready, tell the app how it went. There is no rush."
          onClear={onClearTrial}
        />
      ) : null}

      <section className="fg-panel-stack">
        <div className="fg-kicker">Start here</div>
        <div className="fg-state-meta">Choose the route that feels closest. Then use the first support before worrying about deeper options.</div>
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

      <section className="fg-panel-stack fg-glass" style={{ padding: 18, borderRadius: 18 }}>
        <div className="fg-kicker">First support to try</div>
        <div className="fg-state-meta">Keep the first move small. You can explore more options after that if needed.</div>
        <div className="fg-grid" style={{ marginTop: 12 }}>
          {firstStarterSupport ? (
            <SupportCard
              key={firstStarterSupport.title}
              kicker="Safe first action"
              title={firstStarterSupport.title}
              body={firstStarterSupport.body}
              active={selectedSupportTitle === firstStarterSupport.title}
              onSelect={() => setSelectedSupportTitle(firstStarterSupport.title)}
            />
          ) : null}
        </div>
        {secondaryStarterSupports.length > 0 ? (
          <div className="fg-panel-stack" style={{ marginTop: 12 }}>
            <div className="fg-kicker">Other starter option</div>
            <div className="fg-grid">
              {secondaryStarterSupports.map((support) => (
                <SupportCard
                  key={support.title}
                  kicker="Alternate first action"
                  title={support.title}
                  body={support.body}
                  active={selectedSupportTitle === support.title}
                  onSelect={() => setSelectedSupportTitle(support.title)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {hasTailoredSupports ? (
        <section className="fg-panel-stack">
          <div className="fg-kicker">{isCautious ? 'Best cautious fit' : 'Best tailored fit'}</div>
          <div className="fg-state-meta">Why these first: {buildWhyTheseFirst(recommendationLedger)}</div>
          {renderRecommendationGroup('Best fit now', 'These are the strongest current fit and need the least extra interpretation.', groupedRecommendations.bestFitNow, true)}

          {hasAdditionalRecommendationGroups ? (
            <div className="fg-chip-row">
              <button type="button" className="fg-choice-chip fg-glass" onClick={() => setShowMoreRecommendations((prev) => !prev)}>
                {showMoreRecommendations ? 'Show fewer options' : 'Show more options'}
              </button>
            </div>
          ) : null}

          {showMoreRecommendations ? (
            <>
              {renderRecommendationGroup('Worth trying carefully', 'These may still help, but they need a little more care or a gentler retry.', groupedRecommendations.worthTryingCarefully)}
              {renderRecommendationGroup('Needs a fresh check', 'These used to help or still look promising, but they need a quick re-check before leaning on them.', groupedRecommendations.needsFreshCheck)}
              {renderRecommendationGroup('Avoid for now', 'These have enough recent friction or failed checks that they should stay out of the active queue for now.', groupedRecommendations.avoidForNow)}
            </>
          ) : null}

          {selectedLedgerItem ? (
            <section className="fg-panel-stack fg-glass" style={{ padding: 18, borderRadius: 18 }}>
              <div className="fg-kicker">Selected support</div>
              <div className="fg-state-meta">Open deeper detail only if you need the reasoning, transfer warnings, or fresh-check tools.</div>
              <div className="fg-chip-row">
                <button type="button" className="fg-choice-chip fg-glass" onClick={() => setShowSelectedRecommendationDetails((prev) => !prev)}>
                  {showSelectedRecommendationDetails ? 'Hide deeper detail' : 'Show deeper detail'}
                </button>
              </div>
              {showSelectedRecommendationDetails ? (
                <>
                  <RecommendationLedgerCard item={selectedLedgerItem} onReviewTransfer={onReviewTransfer} onRevalidateSupport={onRevalidateSupport} />
                  <RecommendationStateMatrix item={selectedLedgerItem} customStates={customStates} />
                  <TransferTrustLegend />
                </>
              ) : null}
            </section>
          ) : null}
        </section>
      ) : (
        <section className="fg-panel-stack fg-glass" style={{ padding: 18, borderRadius: 18 }}>
          <div className="fg-kicker">Tailored supports are gated</div>
          <div className="fg-state-meta">{thresholdSummary.message}</div>
        </section>
      )}

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
        <OutcomeChooser outcomes={OUTCOMES} disabled={!selectedSupportTitle && !activeTrial} onChoose={handleOutcome} />
        {pendingReflection && reflectionPrompt ? (
          <GuidedActionPanel
            kicker="Optional note"
            body={reflectionPrompt.label}
            textareaValue={reflectionNote}
            textareaPlaceholder="You can leave a short note here, or skip it."
            onTextareaChange={setReflectionNote}
            actions={[
              { label: 'Save note', onClick: handleSaveReflection },
              { label: 'Skip', onClick: () => { setPendingReflection(null); setReflectionNote(''); } },
            ]}
          />
        ) : null}
      </section>
    </div>
  );
};

export default HelpNowHome;