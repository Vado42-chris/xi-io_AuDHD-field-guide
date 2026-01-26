
export enum Page {
  Landing = 'landing',
  Assessment = 'assessment',
  Dashboard = 'dashboard',
  Spoons = 'spoons',
  Tracking = 'tracking',
  Coach = 'coach',
  Resources = 'resources',
  Settings = 'settings',
  Calendar = 'calendar'
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
  sensoryLoad: number;
  note: string;
  spoonsRemaining: number;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  content: string[];
}

// Added missing Badge interface to resolve import error in constants.ts
export interface Badge {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
  humor: string;
}

export interface Question {
  id: string;
  pillar: 'autism' | 'adhd' | 'masking' | 'burnout';
  text: string;
  type: 'validated' | 'scenario';
  options: { label: string; value: number }[];
}

export interface SensorySettings {
  darkMode: boolean;
  reducedMotion: boolean;
  dyslexicFont: boolean;
  fontSize: number;
  dashboardWidgets: string[];
  signalSubscriptions: string[];
}

export interface HistoryPoint {
  date: string;
  value: number;
  fullDate: number;
}

export interface EnvironmentData {
  latitude: number | null;
  longitude: number | null;
  entropyModifier: number;
  lastUpdated: number;
}

export interface SyncPacket {
  responses: Record<string, number>;
  journal: JournalEntry[];
  lexicon: Record<string, number>;
  timestamp: number;
  version: string;
}
