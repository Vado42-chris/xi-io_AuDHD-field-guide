import { Question, Badge, Article } from './types.ts';

export const SCENARIOS: Question[] = [
  {
    id: 'sc_logic',
    pillar: 'autism',
    type: 'scenario',
    text: "Truth Invariant: You are observing a system or conversation that is logically inconsistent but socially 'accepted.' What is your internal state?",
    options: [
      { label: "Acute distress; the error must be corrected regardless of hierarchy", value: 4 },
      { label: "High noise; I feel physical tension but suppress it to avoid friction", value: 3 },
      { label: "Observation; I notice it but calculate that masking is more efficient", value: 2 },
      { label: "Nominal; social context outweighs logical precision here", value: 0 }
    ]
  },
  {
    id: 'sc_sensory',
    pillar: 'autism',
    type: 'scenario',
    text: "Environmental Saturation: You are in a 'High Noise' zone (Grocery store, busy office). How is your CPU throughput affected?",
    options: [
      { label: "Stall; I lose access to verbal processing and complex decision making", value: 4 },
      { label: "Throttled; I can function but at a 3x higher energy cost", value: 3 },
      { label: "Buffered; I use noise-cancelling tools to maintain baseline", value: 2 },
      { label: "Nominal; environmental noise does not impact my internal state", value: 0 }
    ]
  },
  {
    id: 'sc_pda',
    pillar: 'adhd',
    type: 'scenario',
    text: "Demand Threat: A task you previously enjoyed is now 'required' of you by an external authority. Describe the physical sensation.",
    options: [
      { label: "System Lock; my nervous system perceives the demand as a lethal threat", value: 4 },
      { label: "High Friction; I feel intense resentment and physical heaviness", value: 3 },
      { label: "Bypass required; I must reframe it as my own choice to start", value: 2 },
      { label: "Nominal; I can follow instructions without autonomy triggers", value: 0 }
    ]
  }
];

export const VALIDATED_SCREENING: Question[] = [
  {
    id: 'mask_1',
    pillar: 'masking',
    type: 'validated',
    text: "I spend significant cognitive energy manually calculating my tone of voice and facial expressions.",
    options: [{ label: "Always", value: 4 }, { label: "Often", value: 3 }, { label: "Sometimes", value: 2 }, { label: "Never", value: 0 }]
  },
  {
    id: 'burn_1',
    pillar: 'burnout',
    type: 'validated',
    text: "Basic executive functions (showering, emails, eating) feel physically painful or impossible lately.",
    options: [{ label: "Severe", value: 4 }, { label: "Frequent", value: 3 }, { label: "Occasional", value: 2 }, { label: "None", value: 0 }]
  }
];

export const ALL_QUESTIONS = [...SCENARIOS, ...VALIDATED_SCREENING];

export const ARTICLES: Article[] = [
  {
    id: 'pda-whitepaper',
    title: "The Neuro-Biology of Autonomy (PDA)",
    category: "YOUR BRAIN",
    readTime: "8 min read",
    content: [
      "SYSTEM DEFINITION: Pathological Demand Avoidance (PDA) is a misnomer. In the xi-io framework, it is the 'Pervasive Drive for Autonomy.' It is a survival mechanism where the nervous system treats a loss of autonomy as a lethal threat to the self.",
      "THE AMYGDALA HIJACK: When a demand is issued—even by yourself—the brain's threat-detection center (the amygdala) may fire. This triggers a fight-flight-freeze response. In this state, executive function is bypassed. You are not 'lazy'; you are in a state of neuro-biological defense.",
      "STABILIZATION PROTOCOL: To bypass the PDA lock, the demand must be neutralized. This is done through 'Autonomous Reframing.' Instead of 'I have to do X,' the processor must reframe as 'I am choosing to stabilize my environment by doing X.' Removing the hierarchy removes the threat.",
      "CLINICAL CONTRAST: Unlike clinical models that view this as 'defiance,' xi-io views it as a high-fidelity protection invariant. If your autonomy is threatened, your system shuts down to protect its core identity."
    ]
  },
  {
    id: 'burnout-mechanics',
    title: "Burnout as System Depletion",
    category: "ENERGY",
    readTime: "10 min read",
    content: [
      "THE THERMODYNAMICS OF MASKING: Neurodivergent burnout is the result of a long-term energy deficit. If masking consumes 60% of your daily CPU cycles and environmental noise consumes 30%, you only have 10% left for 'Life Tasks.' Eventually, the reserve hits zero.",
      "RECOGNIZING THE STALL: Burnout looks like skill loss. Things you used to do easily now feel impossible. This is the brain's way of cutting 'non-essential' processes to keep the core OS running. Socializing is usually the first process to be terminated.",
      "RECOVERY PARAMETERS: Burnout cannot be fixed with 'self-care' like bubble baths. It requires a hard system reset: Zero-demand environments, sensory isolation, and the removal of social performance requirements for 48-72 hour cycles.",
      "PREVENTION: The xi-io Power Unit (Spoon) economy is designed to prevent this. By quantizing your energy, you can objectively see when you are reaching 'Critical Reserve' and execute a shutdown before the system crashes."
    ]
  },
  {
    id: 'sensory-invariants',
    title: "Sensory Processing as Data Throttling",
    category: "YOUR BRAIN",
    readTime: "6 min read",
    content: [
      "BANDWIDTH OVERLOAD: For many neurodivergent systems, the 'Sensory Filter' is thin or non-existent. While a neurotypical brain might discard 80% of environmental background noise, your brain processes 100% of it as high-priority data.",
      "THROTTLING EFFECTS: When the data stream is too high (bright lights, overlapping conversations), the cognitive CPU throttles. This results in 'brain fog' or slowed processing speeds. In severe cases, it triggers a total system crash (Meltdown).",
      "MITIGATION: Do not wait for overload. Use 'Active Buffering'—noise-canceling tech, tinted lenses, and frequent 'Data Purge' breaks. Your system needs more frequent cache-clearing than the standard human model."
    ]
  }
];

export const SPOON_COSTS: Record<string, number> = {
  "High-Intensity Socializing": 6,
  "Sudden Schedule Change": 5,
  "High-Noise Environment": 4,
  "Executive Complex Task": 4,
  "Verbal Phone Calls": 3,
  "Basic Maintenance": 1
};

export const PLAIN_LANGUAGE_MAP = [
  { tech: "PDA", human: "Autonomy Drive", psych: "A survival response where demands feel like threats to safety." },
  { tech: "R-Factor", human: "Noise Level", psych: "How much 'static' your brain is currently processing." },
  { tech: "Spoons", human: "Battery Life", psych: "A finite daily budget of cognitive energy." },
  { tech: "Masking", human: "Social Acting", psych: "Manual control of behavior to fit social expectations." }
];

// Added missing BADGES export to resolve import error in App.tsx
export const BADGES: Badge[] = [
  {
    id: 'first-calibration',
    label: "System Initialized",
    description: "Completed your first baseline mapping.",
    unlocked: true,
    humor: "Resistance to your own needs is futile."
  },
  {
    id: 'spoon-master',
    label: "Power Cycle",
    description: "Used the Spoon economy to prevent a total system crash.",
    unlocked: false,
    humor: "You didn't explode today. Achievement unlocked."
  }
];