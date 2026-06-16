
export enum Page {
  Landing = 'landing',
  HelpNow = 'help-now',
  Assessment = 'assessment',
  Tracking = 'tracking',
  Coach = 'coach',
  Resources = 'resources',
  Settings = 'settings',
  Provisioning = 'provisioning',
  Addons = 'addons',
  Report = 'report',
  Calendar = 'calendar'
}

export type SubscriptionTier = 'Standard' | 'Pro' | 'Enterprise' | 'Education';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  category: string;
  timestamp: number;
}

export interface NewsCategory {
  id: string;
  name: string;
  query: string;
}

export interface NeuralLinkConfig {
  uplinkType: 'Cloud' | 'Local' | 'Hybrid';
  privacyLevel: 'ZeroKnowledge' | 'Aggregated';
  autoSync: boolean;
}

export interface UserIdentity {
  id: string;
  username: string;
  isProvisioned: boolean;
  tier: SubscriptionTier;
  privacyMode: 'LocalOnly' | 'CloudSync';
  uplinkType: 'Local' | 'Google';
  avatarColor: string;
  institutionKey?: string;
  emergencyContacts: EmergencyContact[];
  subscribedCategories: string[];
  neuralConfig: NeuralLinkConfig;
  subscriptionActive: boolean;
}

export interface PillarScore {
  score: number;
  max: number;
  label: string;
  percentile: number;
  indicator: 'Low' | 'Moderate' | 'High' | 'Very High';
}

export interface ComprehensiveResult {
  autism: PillarScore;
  adhd: PillarScore;
  masking: PillarScore;
  burnout: PillarScore;
  hallberg: {
    R: number;
    confidence: number;
    invariants: string[];
    contradictions: string[];
    actionableIntel: string[];
  };
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  mood: number;
  sensoryEntropy: number;
  note: string;
  uUnitsRemaining: number;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  id: string;
  urls?: {title: string, uri: string}[];
}

export interface ChatThread {
  id: string;
  title: string;
  timestamp: number;
  messages: ChatMessage[];
  nodeId: string; 
}

export interface NeuralNode {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemInstruction: string;
  inputHint: string;
}

export interface Question {
  id: string;
  pillar: 'autism' | 'adhd' | 'masking' | 'burnout';
  type: 'scenario' | 'validated';
  text: string;
  options: { label: string; value: number }[];
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  category: 'academic' | 'music' | 'parenting' | 'workplace' | 'healthcare' | 'social';
  icon: string;
  installed: boolean;
  premium: boolean;
}

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  energy: number;
  therapeuticIntent: string;
  previewUrl?: string;
}

export interface SpotifyState {
  connected: boolean;
  currentPlaylist?: SpotifyTrack[];
}

export interface NeuralHarmonic {
  id: string;
  name: string;
  frequency: string;
  protocol: string;
  targetState: string;
}

export interface HistoryPoint {
  date: string;
  value: number;
  mood: number;
  noteSnippet: string;
}
