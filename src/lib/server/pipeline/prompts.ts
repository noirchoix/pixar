import type { FlowRequest, ScriptRequest } from '$lib/types';

export function buildFlowPrompt(input: FlowRequest, targetWordRange: [number, number]) {
  return `
You are generating a Pixar-inspired short-film story flow.
Return only valid JSON.

Requirements:
- Build a story around discomfort, character desire, and causal escalation.
- Keep it emotionally clear, visually playable, and structurally economical.
- Use six beats.
- The protagonist must want something concrete.
- Attack the comfort zone with the polar opposite pressure.
- The story should feel suitable for a short animated film.
- Avoid generic inspiration-speech writing.
- Favor visible action.

User topic: ${input.topic}
Runtime seconds: ${input.runtimeSeconds}
Audience: ${input.audience ?? 'general'}
Custom notes: ${input.customNotes ?? 'none'}
Custom rules: ${(input.customRules ?? []).join(' | ') || 'none'}
Target word range: ${targetWordRange[0]}-${targetWordRange[1]}

Return JSON with keys:
contradiction: {
  protagonist, desire, flaw, comfortZone, oppositePressure, emotionalQuestion, themeHypothesis
}
notes: string[]
beats: Array<{ title, purpose, visibleAction, emotionalTurn }>
`;
}

export function buildScriptPrompt(input: ScriptRequest) {
  const { flow, extraDirection, voiceStyle } = input;

  return `
You are writing a short animated script in plain text.
Return only valid JSON with keys:
script, refinementNotes

Requirements:
- Honor the approved beat flow exactly.
- Write for spoken performance.
- Keep sentences active and clear.
- Make emotional movement visible through action.
- Keep the tone aligned with the category.
- Avoid cliche moralizing.
- Keep the script within the approved target word range.
- Plain text only. No markdown.
- The text should be suitable for export into a .txt file.

Topic: ${flow.topic}
Category: ${flow.inferredCategory}
Runtime seconds: ${flow.runtimeSeconds}
Target word range: ${flow.targetWordRange[0]}-${flow.targetWordRange[1]}
Theme hypothesis: ${flow.themeHypothesis}
Voice style: ${voiceStyle ?? 'warm cinematic narration'}
Extra direction: ${extraDirection ?? 'none'}

Contradiction:
${JSON.stringify(flow.contradiction, null, 2)}

Beats:
${JSON.stringify(flow.beats, null, 2)}
`;
}
