import fs from 'node:fs/promises';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import { getStorageDir } from '$lib/server/storage/fs';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const filePath = path.join(getStorageDir(), 'exports', params.name);
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${params.name}"`
      }
    });
  } catch {
    throw error(404, 'File not found.');
  }
};
