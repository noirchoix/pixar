import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { exportScriptTxt } from '$lib/server/export/txt';
import type { RequestHandler } from './$types';

const schema = z.object({
  topic: z.string().trim().min(1, 'Topic is required'),
  script: z.string().trim().min(1, 'Script is required')
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
      {
        message: 'Invalid export request',
        issues: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  try {
    const output = await exportScriptTxt(parsed.data.topic, parsed.data.script);

    return json({
      ok: true,
      fileName: output.fileName,
      downloadUrl: output.downloadUrl,
      inlineContent: output.inlineContent
    });
  } catch (err) {
    console.error('Export failed:', err);

    return json(
      { message: 'Failed to export script' },
      { status: 500 }
    );
  }
};