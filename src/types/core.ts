export type AppSection = 'help_now' | 'journal' | 'learn_me' | 'customize';

export type CanonicalStateId =
  | 'steady'
  | 'overloaded'
  | 'activated'
  | 'shut_down'
  | 'in_pain'
  | 'stuck'
  | 'unclear';

export type StateIntensity = 'low' | 'medium' | 'high';

export type SupportOutcome = 'helped' | 'a_little' | 'no_change' | 'worse' | 'skipped';

export type LearningKind = 'stressor' | 'destresser' | 'sensory';
export type ConfidenceLevel = 'early' | 'learning' | 'trusted';
export type PersonalizationReadiness = 'not_ready' | 'warming_up' | 'ready';

export interface CurrentState {
  canonicalId: CanonicalStateId;
  label: string;
  intensity: StateIntensity;
  updatedAt: number;
  source: 'user' | 'thread_prompt' | 'support_flow';
}

export interface CustomStateLabel {
  id: string;
  label: string;
  canonicalId: CanonicalStateId;
  favorite: boolean;
  hidden: boolean;
  order: number;
}

export interface AppIdentity {
  id: string;
  username: string;
  avatarColor: string;
  isProvisioned: boolean;
}

export interface StateSnapshot {
  canonicalId: CanonicalStateId;
  label: string;
  intensity: StateIntensity;
  recordedAt: number;
}

export interface JournalMessage {
  id: string;
  role: 'user' | 'ibal';
  text: string;
  createdAt: number;
}

export interface StateTransition {
  id: string;
  from: StateSnapshot;
  to: StateSnapshot;
  createdAt: number;
  source: 'post_send' | 'manual';
}

export interface ThreadMemoryEntry {
  summary: string;
  suggestedTags: string[];
  confirmedTags: string[];
  stressorTags: string[];
  destresserTags: string[];
  lastStructuredAt: number;
}

export interface JournalThread {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  startingState: StateSnapshot;
  currentState: StateSnapshot;
  summary?: string;
  tags: string[];
  messages: JournalMessage[];
  transitions: StateTransition[];
  memory?: ThreadMemoryEntry;
}

export interface ThreadSummary {
  id: string;
  title: string;
  updatedAt: number;
  startingStateLabel: string;
  summary?: string;
}

export interface SupportLogEntry {
  id: string;
  stateLabel: string;
  stateCanonicalId: CanonicalStateId;
  supportTitle: string;
  supportRoute: string;
  outcome: SupportOutcome;
  createdAt: number;
}

export interface LearningSignal {
  id: string;
  label: string;
  kind: LearningKind;
  source: 'thread' | 'support_log' | 'manual';
  confidence: 'emerging' | 'repeated';
  contexts: string[];
  confirmed: boolean;
  createdAt: number;
}

export interface SensorySupportRecord {
  id: string;
  label: string;
  category: 'sound' | 'touch' | 'movement' | 'pressure' | 'temperature' | 'light' | 'reduction';
  helpfulStates: CanonicalStateId[];
  outcomeCounts: Record<SupportOutcome, number>;
  confirmed: boolean;
  favorite: boolean;
  hidden: boolean;
  createdAt: number;
}

export interface PatternReviewSummary {
  confidenceLevel: ConfidenceLevel;
  evidenceCount: number;
  contradictionCount: number;
  repeatedStressors: string[];
  repeatedDestressers: string[];
  strongestSupports: string[];
  cautionNotes: string[];
}

export interface ThresholdSummary {
  readiness: PersonalizationReadiness;
  confirmedEvidence: number;
  targetEvidence: number;
  contradictionCount: number;
  canPersonalize: boolean;
  message: string;
}

export interface PersonalizedSupportSuggestion {
  title: string;
  body: string;
  reason: string;
  state: CanonicalStateId;
}

export const DEFAULT_CUSTOM_STATES: CustomStateLabel[] = [
  { id: 'steady', label: 'Steady', canonicalId: 'steady', favorite: true, hidden: false, order: 0 },
  { id: 'overloaded', label: 'Overloaded', canonicalId: 'overloaded', favorite: true, hidden: false, order: 1 },
  { id: 'activated', label: 'Activated', canonicalId: 'activated', favorite: true, hidden: false, order: 2 },
  { id: 'shut_down', label: 'Shut Down', canonicalId: 'shut_down', favorite: true, hidden: false, order: 3 },
  { id: 'in_pain', label: 'In Pain', canonicalId: 'in_pain', favorite: true, hidden: false, order: 4 },
  { id: 'stuck', label: 'Stuck', canonicalId: 'stuck', favorite: true, hidden: false, order: 5 },
  { id: 'unclear', label: 'Unclear', canonicalId: 'unclear', favorite: true, hidden: false, order: 6 },
];

export const DEFAULT_CURRENT_STATE: CurrentState = {
  canonicalId: 'unclear',
  label: 'Unclear',
  intensity: 'medium',
  updatedAt: Date.now(),
  source: 'user',
};

export const DEFAULT_IDENTITY: AppIdentity = {
  id: 'user-base',
  username: 'G-STAKEHOLDER',
  avatarColor: '#7ED9CC',
  isProvisioned: true,
};