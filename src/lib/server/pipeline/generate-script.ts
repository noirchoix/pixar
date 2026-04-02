import { nanoid } from 'nanoid';
import { buildScriptPrompt } from '$lib/server/pipeline/prompts';
import { createJsonCompletion } from '$lib/server/llm/deepseek';
import { scoreScript } from '$lib/server/pipeline/scoring';
import type { ScriptRequest, ScriptResponse } from '$lib/types';

type LlmScriptResponse = {
  script?: string;
  refinementNotes?: string[] | string;
};

function fallbackScript(input: ScriptRequest): string {
  const lines: string[] = [];
  const { flow } = input;
  lines.push(`Title: ${flow.topic}`);
  lines.push('');
  lines.push(`Narration tone: ${flow.inferredCategory}`);
  lines.push('');

  for (const beat of flow.beats) {
    lines.push(`${beat.title.toUpperCase()}`);
    lines.push(`${beat.visibleAction} ${beat.emotionalTurn}`);
    lines.push('');
  }

  lines.push(`Ending feeling: ${flow.themeHypothesis}`);
  return lines.join('\n');
}

export async function generateScript(input: ScriptRequest): Promise<ScriptResponse> {
  let payload: LlmScriptResponse | null = null;

  try {
    payload = await createJsonCompletion<LlmScriptResponse>(
      [
        { role: 'system', content: 'You are a short-film scriptwriter who writes clean spoken-performance text.' },
        { role: 'user', content: buildScriptPrompt(input) }
      ],
      2200
    );
  } catch {
    payload = null;
  }

  const script = payload?.script?.trim() || fallbackScript(input);
  const normalizedRefinementNotes = Array.isArray(payload?.refinementNotes)
    ? payload.refinementNotes.filter((note): note is string => typeof note === 'string' && Boolean(note.trim()))
    : typeof payload?.refinementNotes === 'string' && payload.refinementNotes.trim()
      ? payload.refinementNotes
          .split(/\n+|(?<=[.!?])\s+(?=[A-Z])/)
          .map((note) => note.trim())
          .filter(Boolean)
      : [];

  const refinementNotes = normalizedRefinementNotes.length
    ? normalizedRefinementNotes
    : [
        'Refined toward active verbs and spoken clarity.',
        'Kept the story tied to a single core contradiction.',
        'Protected runtime fit with a compact beat progression.'
      ];

  const score = scoreScript(script, input.flow);

  return {
    storyId: nanoid(),
    flowId: input.flow.requestId,
    script,
    category: input.flow.inferredCategory,
    runtimeSeconds: input.flow.runtimeSeconds,
    estimatedWordCount: script.trim().split(/\s+/).filter(Boolean).length,
    score,
    refinementNotes
  };
}
