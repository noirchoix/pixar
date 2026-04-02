import type { StoryCategory } from '$lib/types';
import { CATEGORY_PROFILES } from '$lib/config/categories';

export const RUNTIME_PRESETS = [
  { seconds: 60, label: '1 minute' },
  { seconds: 120, label: '2 minutes' },
  { seconds: 180, label: '3 minutes' }
] as const;

export function getTargetWordRange(category: StoryCategory, runtimeSeconds: number): [number, number] {
  const profile = CATEGORY_PROFILES[category];
  const units = runtimeSeconds / 10;
  return [
    Math.round(profile.wordsPer10SecMin * units),
    Math.round(profile.wordsPer10SecMax * units)
  ];
}

export function allocateBeatBudgets(runtimeSeconds: number, minWords: number, maxWords: number) {
  const averageWords = Math.round((minWords + maxWords) / 2);
  const longForm = runtimeSeconds > 90;
  const ratios = longForm
    ? [0.12, 0.17, 0.2, 0.18, 0.17, 0.16]
    : [0.14, 0.2, 0.22, 0.18, 0.16, 0.1];

  return ratios.map((ratio) => Math.max(20, Math.round(averageWords * ratio)));
}
