
import { Question, PillarScore, ComprehensiveResult, JournalEntry, HistoryPoint, EnvironmentData } from './types';

export const analyzePatterns = (
  responses: Record<string, number>, 
  questions: Question[], 
  lexicon: JournalEntry[] = [],
  env?: EnvironmentData
): ComprehensiveResult => {
  const pillars: Record<string, { total: number; count: number; max: number }> = {
    autism: { total: 0, count: 0, max: 0 },
    adhd: { total: 0, count: 0, max: 0 },
    masking: { total: 0, count: 0, max: 0 },
    burnout: { total: 0, count: 0, max: 0 }
  };

  // Fibonacci weights for categorical importance
  const FIB = [13, 8, 5, 3, 2, 1, 1];

  questions.forEach((q, idx) => {
    const weight = idx < FIB.length ? FIB[idx] : 1;
    const val = responses[q.id] || 0;
    if (pillars[q.pillar]) {
      pillars[q.pillar].total += val * weight;
      pillars[q.pillar].count++;
      pillars[q.pillar].max += 4 * weight;
    }
  });

  const getPillar = (id: string, label: string): PillarScore => {
    const p = pillars[id];
    const score = p.total;
    const max = p.max;
    const percent = max > 0 ? (score / max) * 100 : 0;
    let indicator: PillarScore['indicator'] = 'Low';
    if (percent > 80) indicator = 'Very High';
    else if (percent > 60) indicator = 'High';
    else if (percent > 35) indicator = 'Moderate';
    return { score, max, label, percentile: Math.round(percent), indicator };
  };

  const results: ComprehensiveResult = {
    autism: getPillar('autism', 'Autistic Invariants'),
    adhd: getPillar('adhd', 'Kinetic Impulses'),
    masking: getPillar('masking', 'Camouflage Load'),
    burnout: getPillar('burnout', 'Nervous System Reserve'),
    hallberg: { R: 0, confidence: 0, invariants: [], contradictions: [], actionableIntel: [] }
  };

  // R-Factor Calculation: Combining baseline traits with recent sensory volatility
  const baselineLoad = Object.values(pillars).reduce((acc, curr) => acc + curr.total, 0) / 
                       Math.max(1, Object.values(pillars).reduce((acc, curr) => acc + curr.max, 0));
  
  const now = Date.now();
  let weightedEntropySum = 0;
  let totalWeight = 0;
  
  lexicon.forEach(entry => {
    const ageInHours = (now - entry.timestamp) / (1000 * 60 * 60);
    if (ageInHours <= 72) {
      const weight = Math.exp(-ageInHours / 18); // 18h half-life for sensory impact
      weightedEntropySum += (entry.sensoryEntropy / 100) * weight;
      totalWeight += weight;
    }
  });

  const recentEntropy = totalWeight > 0 ? (weightedEntropySum / totalWeight) : 0;
  const envModifier = env ? env.entropyModifier : 0.05;

  // The final Hallberg R-Factor: Normalized 0-1
  const R = (baselineLoad * 0.25) + (recentEntropy * 0.65) + (envModifier * 0.1);

  const invs: string[] = [];
  const intel: string[] = [];
  const contradictions: string[] = [];

  // IDENTITY FRICTION & ASYMMETRY DETECTION
  if (results.masking.percentile > 65 && results.burnout.percentile > 65) {
    contradictions.push("Identity Friction: Camouflage load is cannibalizing reserve.");
    intel.push("URGENT: Cease non-essential social masking. Identity preservation priority.");
  }
  
  if (results.autism.percentile > 70 && results.adhd.percentile > 70) {
    invs.push("AuDHD Oscillation: Concurrent demand for rigidity and novelty.");
  }

  if (R > 0.8) {
    intel.push("CRITICAL STALL: Engage dark-room protocol. Minimize all demands.");
  } else if (R > 0.6) {
    intel.push("WARNING: Cognitive bandwidth restricted. Use Plain Language only.");
  }

  results.hallberg = {
    R: parseFloat(R.toFixed(4)),
    confidence: Math.round((Object.keys(responses).length / questions.length) * 100),
    invariants: invs,
    contradictions,
    actionableIntel: intel
  };

  return results;
};

export const getHistoryTrend = (journal: JournalEntry[]): HistoryPoint[] => {
  return journal
    .slice(0, 14)
    .reverse()
    .map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString([], { weekday: 'short', day: 'numeric' }),
      value: entry.sensoryEntropy / 100,
      fullDate: entry.timestamp,
      mood: entry.mood,
      noteSnippet: entry.note.length > 40 ? entry.note.substring(0, 40) + '...' : entry.note
    }));
};
