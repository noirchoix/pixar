import type { StoryContradiction } from '$lib/types';

const defaults = {
  desire: 'to finally reach what they believe will complete them',
  flaw: 'they confuse control with safety',
  comfortZone: 'staying close to what already feels predictable',
  oppositePressure: 'a situation that demands vulnerability, improvisation, and trust',
  emotionalQuestion: 'can they let go of the false thing they cling to and accept what truly matters?',
  themeHypothesis: 'a meaningful life is found in connection and lived experience, not in rigid certainty'
};

export function buildHeuristicContradiction(topic: string): StoryContradiction {
  const cleanTopic = topic.trim();
  const protagonist = cleanTopic.startsWith('a ') || cleanTopic.startsWith('an ')
    ? cleanTopic
    : `someone connected to ${cleanTopic}`;

  return {
    protagonist,
    desire: defaults.desire,
    flaw: defaults.flaw,
    comfortZone: defaults.comfortZone,
    oppositePressure: defaults.oppositePressure,
    emotionalQuestion: defaults.emotionalQuestion,
    themeHypothesis: defaults.themeHypothesis
  };
}
