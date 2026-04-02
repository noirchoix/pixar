import { CATEGORY_KEYWORDS } from '$lib/config/categories';
import type { StoryCategory } from '$lib/types';

export function inferCategory(topic: string): StoryCategory {
  const lower = topic.toLowerCase();
  let bestCategory: StoryCategory = 'emotional-family';
  let bestScore = -1;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [StoryCategory, string[]][]) {
    const score = keywords.reduce((acc, keyword) => acc + (lower.includes(keyword) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  if (bestScore <= 0) {
    if (lower.includes('ghost') || lower.includes('fear')) return 'horror-light';
    if (lower.includes('funny') || lower.includes('awkward')) return 'comedy';
    if (lower.includes('quest') || lower.includes('magic')) return 'whimsical-adventure';
  }

  return bestCategory;
}
