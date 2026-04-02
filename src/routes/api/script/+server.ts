import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { generateScript } from '$lib/server/pipeline/generate-script';
import { saveScript } from '$lib/server/storage/stories';
import { STORY_CATEGORIES } from '$lib/types';
import type { RequestHandler } from './$types';

const beatSchema = z.object({
  id: z.string(),
  title: z.string(),
  purpose: z.string(),
  visibleAction: z.string(),
  emotionalTurn: z.string(),
  targetWords: z.number()
});

const contradictionSchema = z.object({
  protagonist: z.string(),
  desire: z.string(),
  flaw: z.string(),
  comfortZone: z.string(),
  oppositePressure: z.string(),
  emotionalQuestion: z.string(),
  themeHypothesis: z.string()
});

const flowSchema = z.object({
  requestId: z.string(),
  topic: z.string(),
  inferredCategory: z.enum(STORY_CATEGORIES),
  runtimeSeconds: z.number(),
  targetWordRange: z.tuple([z.number(), z.number()]),
  themeHypothesis: z.string(),
  contradiction: contradictionSchema,
  beats: z.array(beatSchema),
  appliedRules: z.array(z.string()),
  notes: z.array(z.string())
});

const schema = z.object({
  flow: flowSchema,
  voiceStyle: z.string().trim().optional(),
  extraDirection: z.string().trim().optional()
});

export const POST: RequestHandler = async ({ request }) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json(
      { message: 'Request body must be valid JSON' },
      { status: 400 }
    );
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return json(
      { message: 'Invalid script request', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const script = await generateScript(parsed.data);

    try {
      await saveScript(parsed.data.flow.topic, parsed.data.flow, script);
    } catch (persistError) {
      console.warn('Script persistence skipped:', persistError);
    }

    return json(script);
  } catch (err) {
    console.error('/api/script failed:', err);

    return json(
      {
        message: err instanceof Error ? err.message : 'Failed to generate script'
      },
      { status: 500 }
    );
  }
};