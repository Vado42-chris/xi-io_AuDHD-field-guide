import React, { useMemo, useState } from 'react';
import SupportCard from '../../components/support/SupportCard';
import {
  CanonicalStateId,
  CurrentState,
  PersonalizedSupportSuggestion,
  SupportOutcome,
  ThresholdSummary,
} from '../../types/core';

interface HelpNowHomeProps {
  currentState: CurrentState;
  thresholdSummary: ThresholdSummary;
  personalizedSupports: PersonalizedSupportSuggestion[];
  onApplyRouteState: (canonicalId: CanonicalStateId) => void;
  onLogOutcome: (supportTitle: string, supportRoute: string, outcome: SupportOutcome) => void;
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

export const HelpNowHome: React.FC<HelpNowHomeProps> = ({
  currentState,
  thresholdSummary,
  personalizedSupports,
  onApplyRouteState,
  onLogOutcome,
  recentOutcomeSummary,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<CanonicalStateId>(currentState.canonicalId);
  const [selectedSupportTitle, setSelectedSupportTitle] = useState<string | null>(null);

  const activeSupports = useMemo(() => STARTER_SUPPORTS[selectedRoute] || STARTER_SUPPORTS.unclear, [selectedRoute]);

  const handleRouteSelect = (routeId: CanonicalStateId) => {
    setSelectedRoute(routeId);
    setSelectedSupportTitle(null);
    onApplyRouteState(routeId);
  };

  const handleOutcome = (outcome: SupportOutcome) => {
    if (!selectedSupportTitle) return;
    onLogOutcome(selectedSupportTitle, selectedRoute, outcome);
  };

  const hasTailoredSupports = personalizedSupports.length > 0;
  const isCautious = thresholdSummary.suggestionStability === 'cautious' || !thresholdSummary.canPersonalize;

  return (
    <div className="fg-content-card fg-glass fg-help-layout">
      <div className="fg-header">
        <div className="fg-kicker">Help Now</div>
        <h1 className="fg-section-title">A calmer first action, not a dashboard.</h1>
        <p className="fg-section-body">
          Pick what feels closest right now, get a low-demand starter support, and log whether it helped.
          Tailored support becomes more specific only when the evidence has earned it, and stays cautious when the evidence is unstable.
        </p>
      </div>

      <div className="fg-help-meta">
        <div className="fg-meta-pill fg-glass">Current state: {currentState.label} · {currentState.intensity}</div>
        <div className="fg-meta-pill fg-glass">Threshold: {thresholdSummary.readiness}</div>
        <div className="fg-meta-pill fg-glass">Suggestion mode: {thresholdSummary.suggestionStability}</div>
        {recentOutcomeSummary ? <div className="fg-meta-pill fg-glass">Latest outcome: {recentOutcomeSummary}</div> : null}
      </div>

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
          <div className="fg-grid">
            {personalizedSupports.map((support) => (
              <SupportCard
                key={support.title}
                kicker={support.stability === 'cautious' ? 'Use gently' : 'Tailored support'}
                title={support.title}
                body={`${support.body} ${support.reason}`}
                active={selectedSupportTitle === support.title}
                onSelect={() => setSelectedSupportTitle(support.title)}
              />
            ))}
          </div>
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
            {selectedSupportTitle
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
              disabled={!selectedSupportTitle}
            >
              {outcome.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HelpNowHome;