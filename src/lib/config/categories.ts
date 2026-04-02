import type { CategoryProfile, StoryCategory } from '$lib/types';

export const CATEGORY_PROFILES: Record<StoryCategory, CategoryProfile> = {
  'emotional-family': {
    key: 'emotional-family',
    label: 'Emotional Family',
    wordsPer10SecMin: 18,
    wordsPer10SecMax: 24,
    sentenceStyle: 'balanced',
    dialogueRatio: 0.25,
    pauseWeight: 0.35,
    humorWeight: 0.25,
    sensoryWeight: 0.8
  },
  'whimsical-adventure': {
    key: 'whimsical-adventure',
    label: 'Whimsical Adventure',
    wordsPer10SecMin: 19,
    wordsPer10SecMax: 26,
    sentenceStyle: 'balanced',
    dialogueRatio: 0.3,
    pauseWeight: 0.25,
    humorWeight: 0.45,
    sensoryWeight: 0.7
  },
  comedy: {
    key: 'comedy',
    label: 'Comedy',
    wordsPer10SecMin: 22,
    wordsPer10SecMax: 30,
    sentenceStyle: 'dense',
    dialogueRatio: 0.4,
    pauseWeight: 0.15,
    humorWeight: 0.9,
    sensoryWeight: 0.5
  },
  wonder: {
    key: 'wonder',
    label: 'Wonder',
    wordsPer10SecMin: 16,
    wordsPer10SecMax: 23,
    sentenceStyle: 'balanced',
    dialogueRatio: 0.2,
    pauseWeight: 0.4,
    humorWeight: 0.2,
    sensoryWeight: 0.85
  },
  melancholy: {
    key: 'melancholy',
    label: 'Melancholy',
    wordsPer10SecMin: 14,
    wordsPer10SecMax: 20,
    sentenceStyle: 'sparse',
    dialogueRatio: 0.18,
    pauseWeight: 0.5,
    humorWeight: 0.1,
    sensoryWeight: 0.75
  },
  mystery: {
    key: 'mystery',
    label: 'Mystery',
    wordsPer10SecMin: 16,
    wordsPer10SecMax: 22,
    sentenceStyle: 'sparse',
    dialogueRatio: 0.22,
    pauseWeight: 0.45,
    humorWeight: 0.1,
    sensoryWeight: 0.6
  },
  'horror-light': {
    key: 'horror-light',
    label: 'Horror Light',
    wordsPer10SecMin: 12,
    wordsPer10SecMax: 18,
    sentenceStyle: 'sparse',
    dialogueRatio: 0.15,
    pauseWeight: 0.6,
    humorWeight: 0.08,
    sensoryWeight: 0.7
  }
};

export const CATEGORY_KEYWORDS: Record<StoryCategory, string[]> = {
  'emotional-family': ['family', 'home', 'memory', 'loss', 'friendship', 'parent', 'child', 'belong', 'lonely'],
  'whimsical-adventure': ['quest', 'journey', 'magic', 'adventure', 'creature', 'discover', 'explore', 'fantasy'],
  comedy: ['funny', 'chaos', 'awkward', 'embarrassing', 'mischief', 'ridiculous', 'silly'],
  wonder: ['star', 'sky', 'dream', 'ocean', 'tiny', 'giant', 'light', 'mystery', 'beautiful'],
  melancholy: ['goodbye', 'quiet', 'regret', 'missed', 'alone', 'autumn', 'old', 'faded'],
  mystery: ['secret', 'missing', 'clue', 'hidden', 'door', 'unknown', 'locked'],
  'horror-light': ['shadow', 'dark', 'haunted', 'monster', 'night', 'creepy', 'fear']
};
