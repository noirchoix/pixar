export const STORY_CATEGORIES = [
  'emotional-family',
  'whimsical-adventure',
  'comedy',
  'wonder',
  'melancholy',
  'mystery',
  'horror-light'
] as const;

export type StoryCategory = (typeof STORY_CATEGORIES)[number];

export type CategoryProfile = {
  key: StoryCategory;
  label: string;
  wordsPer10SecMin: number;
  wordsPer10SecMax: number;
  sentenceStyle: 'sparse' | 'balanced' | 'dense';
  dialogueRatio: number;
  pauseWeight: number;
  humorWeight: number;
  sensoryWeight: number;
};

export type FlowRequest = {
  topic: string;
  runtimeSeconds: number;
  audience?: string;
  customNotes?: string;
  customRules?: string[];
};

export type StoryContradiction = {
  protagonist: string;
  desire: string;
  flaw: string;
  comfortZone: string;
  oppositePressure: string;
  emotionalQuestion: string;
  themeHypothesis: string;
};

export type StoryBeat = {
  id: string;
  title: string;
  purpose: string;
  visibleAction: string;
  emotionalTurn: string;
  targetWords: number;
};

export type FlowResponse = {
  requestId: string;
  topic: string;
  inferredCategory: StoryCategory;
  runtimeSeconds: number;
  targetWordRange: [number, number];
  themeHypothesis: string;
  contradiction: StoryContradiction;
  beats: StoryBeat[];
  appliedRules: string[];
  notes: string[];
};

export type ScriptRequest = {
  flow: FlowResponse;
  voiceStyle?: string;
  extraDirection?: string;
};

export type ScoreBreakdown = {
  emotionalClarity: number;
  causalCoherence: number;
  visualizability: number;
  characterAgency: number;
  dialogueNaturalness: number;
  ruleCompliance: number;
  overall: number;
};

export type ScriptResponse = {
  storyId: string;
  flowId: string;
  script: string;
  category: StoryCategory;
  runtimeSeconds: number;
  estimatedWordCount: number;
  score: ScoreBreakdown;
  refinementNotes: string[];
};

export type PersistedStory = {
  id: string;
  createdAt: string;
  topic: string;
  flow?: FlowResponse;
  script?: ScriptResponse;
};

export type ExportResponse = {
  fileName: string;
  downloadUrl: string | null;
  inlineContent?: string | null;
};