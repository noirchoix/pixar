import type { FlowResponse, ScoreBreakdown } from '$lib/types';

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function scoreScript(script: string, flow: FlowResponse): ScoreBreakdown {
  const words = script.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const [minWords, maxWords] = flow.targetWordRange;

  const activeVerbMarkers = ['runs', 'steps', 'grabs', 'turns', 'opens', 'leans', 'climbs', 'holds', 'breathes', 'laughs', 'whispers'];
  const dialogueMarkers = script.match(/["“”]/g)?.length ?? 0;
  const activeVerbHits = activeVerbMarkers.reduce((acc, word) => acc + (script.toLowerCase().includes(word) ? 1 : 0), 0);
  const beatCoverage = flow.beats.reduce((acc, beat) => acc + (script.toLowerCase().includes(beat.title.toLowerCase().split(' ')[0]) ? 1 : 0), 0);

  const emotionalClarity = clamp(65 + Math.min(20, flow.contradiction.emotionalQuestion.length / 4));
  const causalCoherence = clamp(55 + beatCoverage * 5);
  const visualizability = clamp(50 + activeVerbHits * 6);
  const characterAgency = clamp(60 + (script.toLowerCase().includes('decides') ? 10 : 0) + (script.toLowerCase().includes('chooses') ? 10 : 0));
  const dialogueNaturalness = clamp(55 + Math.min(20, dialogueMarkers * 3));
  const runtimeFitPenalty = wordCount < minWords || wordCount > maxWords ? 12 : 0;
  const ruleCompliance = clamp(78 + activeVerbHits * 2 - runtimeFitPenalty);

  const overall = clamp(
    Math.round(
      (emotionalClarity + causalCoherence + visualizability + characterAgency + dialogueNaturalness + ruleCompliance) / 6
    )
  );

  return {
    emotionalClarity,
    causalCoherence,
    visualizability,
    characterAgency,
    dialogueNaturalness,
    ruleCompliance,
    overall
  };
}
