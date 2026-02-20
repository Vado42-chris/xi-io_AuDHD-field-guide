
import { Question, NeuralNode, Addon, SpotifyTrack, NewsCategory } from './types.ts';

export const NEWS_CATEGORIES: NewsCategory[] = [
  { id: 'cat-sensory', name: 'Sensory Science', query: 'latest sensory processing research and grounding techniques for neurodivergence' },
  { id: 'cat-adhd', name: 'Executive Function', query: 'new ADHD productivity hacks and executive dysfunction strategies' },
  { id: 'cat-autism', name: 'Autism News', query: 'recent autism community news and neurodiversity affirming practices' },
  { id: 'cat-pda', name: 'PDA Strategies', query: 'Pathological Demand Avoidance bypass techniques and research' },
  { id: 'cat-burnout', name: 'Burnout Recovery', query: 'AuDHD burnout prevention and recovery advice' }
];

export const RELAY_VISUAL_PROMPTS = [
  "Futuristic neural network mesh, dark blue obsidian surfaces, minimalist sci-fi interface, high fidelity, calm atmosphere",
  "Abstract digital synapses firing in a deep ocean blue void, holographic geometry, minimalist, clean lines",
  "Cybernetic lattice of light, soft blue glow, minimalist architectural lines, macro perspective, futuristic tranquility",
  "Geometric crystal formations pulsating with deep azure light, dark void background, minimalist sci-fi aesthetics"
];

export const INTEL_VISUAL_PROMPTS = [
  "Minimalist digital archive, holographic book spines glowing emerald, dark brutalist interior, sci-fi library, cinematic lighting",
  "Infinite emerald data scrolls in a dark crystalline vault, glowing green accents, minimalist data visualization",
  "Holographic obsidian tablets floating in a quiet digital space, emerald light emission, clean layout, high tech zen",
  "A futuristic library shelf with glowing emerald light-bars, dark glass surfaces, minimalist medical-archive aesthetic"
];

export const NEURAL_NODES: NeuralNode[] = [
  { 
    id: 'node-social-logic', 
    name: 'Social Decoder', 
    icon: 'User', 
    description: 'Deconstruct complex social conflict and ambiguous signals.',
    systemInstruction: "You are the Social Signal Analyst. Deconstruct input for emotional invariants and logical demands. Determine if the signal is worth the user's cognitive battery (U-Units). Avoid flowery language; be clinical and objective. Focus on identifying potential sub-text.",
    inputHint: "Paste a confusing social thread or DM..."
  },
  { 
    id: 'node-pda-bypass', 
    name: 'Autonomy Lab', 
    icon: 'Bolt', 
    description: 'Reframing external demands into autonomous choices.',
    systemInstruction: "You are the Autonomy Coach. Take instructions or 'required' tasks and reframe them into autonomous choices to bypass PDA triggers. Avoid all 'should' or 'must' language. Focus on self-directed agency and logical reasons for the task that benefit the user.",
    inputHint: "Paste a work demand or overwhelming task list..."
  },
  { 
    id: 'node-intel-dense', 
    name: 'Intel Condenser', 
    icon: 'Patterns', 
    description: 'Summarize research into Plain Language mappings.',
    systemInstruction: "You are the Intel Condenser. Map technical research or news to the xi-io Plain Language framework. Focus on high-utility data for neurodivergent survival. Use grounding sources for facts.",
    inputHint: "Paste a research abstract or dense text..."
  },
  { 
    id: 'node-core', 
    name: 'Core Baseline', 
    icon: 'Home', 
    description: 'Somatic grounding and system stabilization.',
    systemInstruction: "Focus on immediate sensory safety and somatic grounding. Keep responses extremely brief, low-demand, and focused on physical regulation. Acknowledge current Sensory Entropy.",
    inputHint: "How is your sensory entropy right now?"
  }
];

export const ALL_QUESTIONS: Question[] = [
  {
    id: 'au_v_1', pillar: 'autism', type: 'validated',
    text: "How often do you find yourself focusing on small details rather than the whole picture?",
    options: [{label: "Always", value: 4}, {label: "Often", value: 3}, {label: "Sometimes", value: 1}, {label: "Rarely", value: 0}]
  },
  {
    id: 'au_v_2', pillar: 'autism', type: 'validated',
    text: "Do you struggle with 'unwritten' social rules in new environments?",
    options: [{label: "Constantly", value: 4}, {label: "Usually", value: 3}, {label: "Occasionally", value: 2}, {label: "Never", value: 0}]
  },
  {
    id: 'ad_v_1', pillar: 'adhd', type: 'validated',
    text: "Difficulty organizing tasks that require a sequence of steps?",
    options: [{label: "Severe", value: 4}, {label: "Frequent", value: 3}, {label: "Occasional", value: 2}, {label: "Minimal", value: 0}]
  },
  {
    id: 'ad_v_2', pillar: 'adhd', type: 'validated',
    text: "How often do you leave your seat in situations where remaining seated is expected?",
    options: [{label: "Very Often", value: 4}, {label: "Often", value: 3}, {label: "Sometimes", value: 1}, {label: "Rarely", value: 0}]
  },
  {
    id: 'ma_v_1', pillar: 'masking', type: 'validated',
    text: "Effort required to monitor your own body language or facial expressions?",
    options: [{label: "Constant", value: 4}, {label: "High", value: 3}, {label: "Moderate", value: 1}, {label: "Low", value: 0}]
  },
  {
    id: 'bu_v_1', pillar: 'burnout', type: 'validated',
    text: "Physical exhaustion that is not resolved by a standard sleep cycle?",
    options: [{label: "Chronic", value: 4}, {label: "Significant", value: 3}, {label: "Periodic", value: 1}, {label: "Nominal", value: 0}]
  }
];

export const ADDONS: Addon[] = [
  {
    id: 'spotify-regulation',
    name: 'Spotify Therapy',
    version: '1.5.0',
    description: 'R-Factor sensitive acoustic regulation. Generates low-entropy playlists based on stability.',
    author: 'Xibalba Systems',
    enabled: true,
    isConnected: false
  }
];

export const NEURAL_HARMONICS: SpotifyTrack[] = [
  { id: 'h1', title: 'Deep Delta baseline', artist: 'Neural Core', duration: '12:00', mode: 'Ambient' },
  { id: 'h2', title: 'Pink Noise (Filtered)', artist: 'Somatic Sync', duration: '60:00', mode: 'Ambient' },
  { id: 'h3', title: 'Steady Pulse 90bpm', artist: 'Focus Engine', duration: '08:45', mode: 'Focus' },
  { id: 'h4', title: 'Lo-Fi Invariants', artist: 'Pattern Lab', duration: '15:20', mode: 'Focus' },
  { id: 'h5', title: 'Dopamine Sprint', artist: 'Kinetic Release', duration: '03:15', mode: 'Release' },
  { id: 'h6', title: 'Hyper-Focus Core', artist: 'Release Node', duration: '04:50', mode: 'Release' }
];

export const U_UNIT_COSTS: Record<string, number> = {
  "High-Entropy Social Media": 5,
  "Dense Research Analysis": 4,
  "External Demand Triage": 3,
  "Sensory Regulation": -2,
  "Deep Interest Flow": -4
};

export const DEMO_BASELINE = {
  responses: {
    au_v_1: 4,
    au_v_2: 3,
    ad_v_1: 4,
    ad_v_2: 2,
    ma_v_1: 4,
    bu_v_1: 3
  },
  journal: [
    { id: 'demo-1', timestamp: Date.now() - 86400000 * 2, mood: 3, sensoryEntropy: 80, note: 'High sensory entropy at grocery store.', uUnitsRemaining: 4 },
    { id: 'demo-2', timestamp: Date.now() - 86400000 * 1, mood: 7, sensoryEntropy: 20, note: 'Deep interest flow session on Hallberg math.', uUnitsRemaining: 15 },
    { id: 'demo-3', timestamp: Date.now() - 43200000, mood: 5, sensoryEntropy: 50, note: 'Navigating work demand triage.', uUnitsRemaining: 8 }
  ],
  threads: {
    'demo-relay-1': {
      id: 'demo-relay-1',
      title: 'Work Reframing',
      timestamp: Date.now(),
      nodeId: 'node-pda-bypass',
      messages: [
        { role: 'user', text: 'My boss said I HAVE to finish this report by Friday or else.', id: 'u1' },
        { role: 'ai', text: '### SIGNAL ANALYSIS\nExternal threat detected. PDA bypass protocol engaged.\n\n### RECOMMENDED CHOICE\nYou are not finishing a report for a boss; you are completing a data synthesis for your own archive of expertise. Choose to finalize the export on your own terms by Thursday morning to avoid the high-entropy Friday rush.', id: 'a1' }
      ]
    }
  }
};
