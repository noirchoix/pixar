import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { generateFlow } from '$lib/server/pipeline/generate-flow';
import { saveFlow } from '$lib/server/storage/stories';
import type { RequestHandler } from './$types';

const schema = z.object({
  topic: z.string().trim().min(3, 'Topic must be at least 3 characters'),
  runtimeSeconds: z.number().min(30).max(600),
  audience: z.string().trim().optional(),
  customNotes: z.string().trim().optional(),
  customRules: z.array(z.string().trim()).optional()
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
      { message: 'Invalid flow request', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const flow = await generateFlow(parsed.data);

    // Persistence is optional in production/serverless environments.
    try {
      await saveFlow(flow);
    } catch (persistError) {
      console.warn('Flow persistence skipped:', persistError);
    }

    return json(flow);
  } catch (err) {
    console.error('/api/flow failed:', err);

    return json(
      {
        message: err instanceof Error ? err.message : 'Failed to generate flow'
      },
      { status: 500 }
    );
  }
};