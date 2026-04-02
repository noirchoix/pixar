import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { generateFlow } from '$lib/server/pipeline/generate-flow';
import { saveFlow } from '$lib/server/storage/stories';
import type { RequestHandler } from './$types';

const schema = z.object({
  topic: z.string().min(3),
  runtimeSeconds: z.number().min(30).max(600),
  audience: z.string().optional(),
  customNotes: z.string().optional(),
  customRules: z.array(z.string()).optional()
});

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return json({ message: 'Invalid flow request', issues: parsed.error.flatten() }, { status: 400 });
  }
  const flow = await generateFlow(parsed.data);
  await saveFlow(flow);
  return json(flow);
};
