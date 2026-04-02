import { describe, expect, test } from 'vitest';
import { getTargetWordRange } from '../src/lib/config/runtime';
import { inferCategory } from '../src/lib/server/pipeline/classify';

describe('runtime sizing', () => {
  test('returns a valid word range', () => {
    const range = getTargetWordRange('emotional-family', 60);
    expect(range[0]).toBeLessThan(range[1]);
    expect(range[0]).toBeGreaterThan(0);
  });

  test('infers whimsical adventure from magic quest topics', () => {
    expect(inferCategory('a magic quest through a floating forest')).toBe('whimsical-adventure');
  });
});
