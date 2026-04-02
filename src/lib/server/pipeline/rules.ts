export const GLOBAL_HARD_RULES = [
  'The protagonist must want something concrete, not vague self-improvement.',
  'The story must attack the protagonist comfort zone with the polar opposite pressure.',
  'Every beat must cause or intensify the next beat.',
  'Visible action must carry the emotional movement whenever possible.',
  'The ending must answer the emotional question, not only the plot question.',
  'Prefer active verbs over noun-heavy phrasing.',
  'Keep the subject close to the main verb when possible.',
  'Avoid passive, agreeable, or opinionless protagonists.'
];

export const GLOBAL_SOFT_RULES = [
  'Open with a world image tied to story pressure.',
  'Use humor to reveal character, world rules, or discomfort.',
  'Use sensory details when emotional revelation needs embodiment.',
  'Simplify. Combine. Avoid detours that do not serve the core contradiction.',
  'Support characters should mirror, deny, exploit, challenge, or validate the same central contradiction.'
];

export const PIXAR_DERIVED_NOTES = [
  'Stories are strongest when discomfort forces growth.',
  'Theme often becomes clear after structure emerges.',
  'A beat outline should map emotional changes into visible action.',
  'Timing matters, so runtime should be beat-budgeted rather than treated as a flat word count.'
];

export function getAppliedRules(customRules: string[] = []) {
  return [...GLOBAL_HARD_RULES, ...GLOBAL_SOFT_RULES, ...customRules];
}
