import { Question, PillarScore, ComprehensiveResult, JournalEntry, HistoryPoint, EnvironmentData } from '../types';

export const analyzePatterns = (
  responses: Record<string, number>, 
  questions: Question[], 
  journal: JournalEntry[] = [],
  env?: EnvironmentData
): ComprehensiveResult => {
  const pillars: Record<string, { total: number; count: number; max: number }> = {
    autism: { total: 0, count: 0, max: 0 },
    adhd: { total: 0, count: 0, max: 0 },
    masking: { total: 0, count: 0, max: 0 },
    burnout: { total: 0, count: 0, max: 0 }
  };

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

  const baselineLoad = Object.values(pillars).reduce((acc, curr) => acc + curr.total, 0) / 
                       Math.max(1, Object.values(pillars).reduce((acc, curr) => acc + curr.max, 0));
  
  const now = Date.now();
  const recentEntries = journal.filter(e => now - e.timestamp < 1000 * 60 * 60 * 6);
  const recentEntropy = recentEntries.reduce((acc, curr) => acc + (curr.sensoryLoad / 100), 0) / Math.max(1, recentEntries.length);
  
  // Environment Entropy: Simulate higher load in urban/unknown locations
  const envModifier = env ? env.entropyModifier : 0.05;

  const R = (baselineLoad * 0.2) + (recentEntropy * 0.6) + (envModifier * 0.2);

  const invs: string[] = [];
  const intel: string[] = [];

  if (results.masking.percentile > 70) invs.push("High-Fidelity Masking: Identity fragmentation risk detected.");
  
  if (R > 0.75) {
    intel.push("CRITICAL: Sensory stall imminent. Execute isolation protocol.");
    intel.push("Zero-demand environment required.");
  } else if (R > 0.5) {
    intel.push("HIGH NOISE: Deploy noise-cancelling tools.");
    intel.push("Autonomous reframing: Shift focus to core invariants.");
  } else {
    intel.push("STABLE FLOW: Optimal window for complex social integration.");
  }

  results.hallberg = {
    R: parseFloat(R.toFixed(4)),
    confidence: Math.round((Object.keys(responses).length / questions.length) * 100),
    invariants: invs,
    contradictions: [],
    actionableIntel: intel
  };

  return results;
};

export const getHistoryTrend = (journal: JournalEntry[]): HistoryPoint[] => {
  return journal
    .slice(0, 14)
    .reverse()
    .map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString([], { weekday: 'short' }),
      value: entry.sensoryLoad / 100,
      fullDate: entry.timestamp
    }));
};