import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { generateScript } from '$lib/server/pipeline/generate-script';
import { saveScript } from '$lib/server/storage/stories';
import type { RequestHandler } from './$types';

const beatSchema = z.object({
  id: z.string(),
  title: z.string(),
  purpose: z.string(),
  visibleAction: z.string(),
  emotionalTurn: z.string(),
  targetWords: z.number()
});

const flowSchema = z.object({
  requestId: z.string(),
  topic: z.string(),
  inferredCategory: z.string(),
  runtimeSeconds: z.number(),
  targetWordRange: z.tuple([z.number(), z.number()]),
  themeHypothesis: z.string(),
  contradiction: z.object({
    protagonist: z.string(),
    desire: z.string(),
    flaw: z.string(),
    comfortZone: z.string(),
    oppositePressure: z.string(),
    emotionalQuestion: z.string(),
    themeHypothesis: z.string()
  }),
  beats: z.array(beatSchema),
  appliedRules: z.array(z.string()),
  notes: z.array(z.string())
});

const schema = z.object({
  flow: flowSchema,
  voiceStyle: z.string().optional(),
  extraDirection: z.string().optional()
});

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return json({ message: 'Invalid script request', issues: parsed.error.flatten() }, { status: 400 });
  }
  const script = await generateScript(parsed.data as any);
  await saveScript(parsed.data.flow.topic, parsed.data.flow as any, script);
  return json(script);
};
