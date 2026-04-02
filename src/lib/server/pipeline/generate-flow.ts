import { nanoid } from 'nanoid';
import { getTargetWordRange, allocateBeatBudgets } from '$lib/config/runtime';
import { inferCategory } from '$lib/server/pipeline/classify';
import { buildHeuristicContradiction } from '$lib/server/pipeline/heuristics';
import { getAppliedRules, PIXAR_DERIVED_NOTES } from '$lib/server/pipeline/rules';
import { buildFlowPrompt } from '$lib/server/pipeline/prompts';
import { createJsonCompletion } from '$lib/server/llm/deepseek';
import type { FlowRequest, FlowResponse, StoryBeat, StoryContradiction } from '$lib/types';

type LlmFlowResponse = {
  contradiction?: Partial<StoryContradiction>;
  beats?: Array<Partial<StoryBeat>>;
  notes?: string[];
};

function withFallbackBeatTitles(index: number) {
  return ['Hook', 'Comfort Zone', 'Disruption', 'Failed Response', 'Emotional Turn', 'Resolution'][index] ?? `Beat ${index + 1}`;
}

export async function generateFlow(input: FlowRequest): Promise<FlowResponse> {
  const inferredCategory = inferCategory(input.topic);
  const targetWordRange = getTargetWordRange(inferredCategory, input.runtimeSeconds);
  const beatBudgets = allocateBeatBudgets(input.runtimeSeconds, targetWordRange[0], targetWordRange[1]);
  const requestId = nanoid();
  const heuristic = buildHeuristicContradiction(input.topic);

  let llmPayload: LlmFlowResponse | null = null;
  try {
    llmPayload = await createJsonCompletion<LlmFlowResponse>(
      [
        { role: 'system', content: 'You are a structured story architect.' },
        { role: 'user', content: buildFlowPrompt(input, targetWordRange) }
      ],
      1500
    );
  } catch {
    llmPayload = null;
  }

  const contradiction: StoryContradiction = {
    protagonist: llmPayload?.contradiction?.protagonist || heuristic.protagonist,
    desire: llmPayload?.contradiction?.desire || heuristic.desire,
    flaw: llmPayload?.contradiction?.flaw || heuristic.flaw,
    comfortZone: llmPayload?.contradiction?.comfortZone || heuristic.comfortZone,
    oppositePressure: llmPayload?.contradiction?.oppositePressure || heuristic.oppositePressure,
    emotionalQuestion: llmPayload?.contradiction?.emotionalQuestion || heuristic.emotionalQuestion,
    themeHypothesis: llmPayload?.contradiction?.themeHypothesis || heuristic.themeHypothesis
  };

  const beats: StoryBeat[] = Array.from({ length: 6 }, (_, index) => {
    const raw = llmPayload?.beats?.[index];
    return {
      id: nanoid(8),
      title: raw?.title || withFallbackBeatTitles(index),
      purpose: raw?.purpose || `Advance the story through beat ${index + 1}.`,
      visibleAction: raw?.visibleAction || 'Use strong physical action that reveals emotion.',
      emotionalTurn: raw?.emotionalTurn || 'The character feels pushed toward change.',
      targetWords: beatBudgets[index]
    };
  });

  return {
    requestId,
    topic: input.topic,
    inferredCategory,
    runtimeSeconds: input.runtimeSeconds,
    targetWordRange,
    themeHypothesis: contradiction.themeHypothesis,
    contradiction,
    beats,
    appliedRules: getAppliedRules(input.customRules),
    notes: [...PIXAR_DERIVED_NOTES, ...(llmPayload?.notes ?? [])]
  };
}
