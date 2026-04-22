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
export type MemoryEntryStatus = 'suggested' | 'confirmed' | 'outdated' | 'superseded';
export type PatternResolutionStatus = 'active' | 'under_review' | 'retired';
export type SuggestionStability = 'stable' | 'cautious';
export type RecommendationConfidence = 'low' | 'medium' | 'high';
export type RecommendationAvailability = 'active' | 'recovering' | 'cooling_off' | 'avoid_for_now';
export type TransferSafety = 'safe' | 'caution' | 'avoid';
export type TransferDecision = 'approved' | 'rejected';
export type TransferOutcomeAssessment = 'pending' | 'justified' | 'not_justified';

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

export interface MemoryRevision {
  id: string;
  changedAt: number;
  actor: 'user' | 'system';
  previousSummary: string;
  previousConfirmedTags: string[];
  previousStatus: MemoryEntryStatus;
  previousNotes?: string;
  nextSummary: string;
  nextConfirmedTags: string[];
  nextStatus: MemoryEntryStatus;
  nextNotes?: string;
  reason: string;
}

export interface ThreadMemoryEntry {
  summary: string;
  suggestedTags: string[];
  confirmedTags: string[];
  stressorTags: string[];
  destresserTags: string[];
  status: MemoryEntryStatus;
  notes?: string;
  provenanceSource: 'thread';
  supersedesEntryId?: string;
  revisionHistory: MemoryRevision[];
  lastStructuredAt: number;
}

export interface MemoryVaultEntry {
  id: string;
  threadId: string;
  threadTitle: string;
  summary: string;
  confirmedTags: string[];
  stressorTags: string[];
  destresserTags: string[];
  createdAt: number;
  confirmed: boolean;
  status: MemoryEntryStatus;
  notes?: string;
  hasConflict: boolean;
  provenanceSource: 'thread';
  supersedesEntryId?: string;
  revisionHistory: MemoryRevision[];
}

export interface MemoryVaultSummary {
  totalEntries: number;
  confirmedEntries: number;
  repeatedTags: string[];
  repeatedStressors: string[];
  repeatedDestressers: string[];
  conflictEntries: number;
  revisedEntries: number;
}

export interface PatternEvidenceReference {
  type: 'memory' | 'support_log';
  id: string;
  title: string;
  detail: string;
  createdAt: number;
}

export interface PatternResolutionEvent {
  id: string;
  changedAt: number;
  actor: 'user' | 'system';
  previousStatus: PatternResolutionStatus;
  nextStatus: PatternResolutionStatus;
  reason: string;
}

export interface PatternEvidenceItem {
  id: string;
  label: string;
  kind: 'stressor' | 'destresser' | 'threshold';
  confidence: 'emerging' | 'repeated' | 'gated';
  references: PatternEvidenceReference[];
  contested: boolean;
  resolutionStatus: PatternResolutionStatus;
  resolutionNote?: string;
  resolutionHistory: PatternResolutionEvent[];
}

export interface PatternEvidenceSummary {
  totalItems: number;
  contestedItems: number;
  repeatedItems: number;
  underReviewItems: number;
  retiredItems: number;
}

export interface RecommendationOutcomeEvent {
  id: string;
  outcome: SupportOutcome;
  createdAt: number;
  stateLabel: string;
  supportRoute: string;
}

export interface RecommendationStateTrust {
  state: CanonicalStateId;
  confidence: RecommendationConfidence;
  availability: RecommendationAvailability;
  performanceScore: number;
  recoveryScore: number;
  rankScore: number;
  transferLearningScore: number;
  learnedTransferTrust: number;
  directTrustWeight: number;
  transferTrustWeight: number;
  directTrustPercent: number;
  transferTrustPercent: number;
  outcomeHistory: RecommendationOutcomeEvent[];
}

export interface TransferReviewRecord {
  id: string;
  recommendationId: string;
  currentState: CanonicalStateId;
  transferSafety: TransferSafety;
  transferWarning?: string;
  decision: TransferDecision;
  reason?: string;
  createdAt: number;
  outcomeAssessment: TransferOutcomeAssessment;
  assessedAt?: number;
}

export interface RecommendationLedgerItem {
  id: string;
  title: string;
  state: CanonicalStateId;
  body: string;
  confidence: RecommendationConfidence;
  stability: SuggestionStability;
  availability: RecommendationAvailability;
  transferSafety: TransferSafety;
  transferWarning?: string;
  reason: string;
  appearedBecause: string;
  trustSummary: string;
  supportingEvidence: PatternEvidenceReference[];
  weakeningEvidence: PatternEvidenceReference[];
  outcomeHistory: RecommendationOutcomeEvent[];
  performanceScore: number;
  rankScore: number;
  recoveryScore: number;
  transferLearningScore: number;
  learnedTransferTrust: number;
  directTrustWeight: number;
  transferTrustWeight: number;
  directTrustPercent: number;
  transferTrustPercent: number;
  stateTrustMap: RecommendationStateTrust[];
  transferReviews: TransferReviewRecord[];
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
  recommendationId?: string;
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
  unstableEvidenceCount: number;
  retiredEvidenceCount: number;
  canPersonalize: boolean;
  suggestionStability: SuggestionStability;
  message: string;
}

export interface PersonalizedSupportSuggestion {
  title: string;
  body: string;
  reason: string;
  state: CanonicalStateId;
  stability: SuggestionStability;
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