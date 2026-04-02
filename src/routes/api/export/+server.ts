import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { exportScriptTxt } from '$lib/server/export/txt';
import type { RequestHandler } from './$types';

const schema = z.object({
  topic: z.string().min(1),
  script: z.string().min(1)
});

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return json({ message: 'Invalid export request', issues: parsed.error.flatten() }, { status: 400 });
  }
  const output = await exportScriptTxt(parsed.data.topic, parsed.data.script);
  return json(output);
};
