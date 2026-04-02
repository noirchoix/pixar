import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { getStorageDir } from '$lib/server/storage/fs';
import type { RequestHandler } from './$types';

function isSafeFileName(name: string) {
  return /^[a-zA-Z0-9._-]+$/.test(name);
}

export const GET: RequestHandler = async ({ params }) => {
  const { name } = params;

  if (!name || !isSafeFileName(name)) {
    throw error(400, 'Invalid file name.');
  }

  if (env.NETLIFY) {
    throw error(404, 'Download route is disabled in production.');
  }

  const filePath = path.join(getStorageDir(), 'exports', name);

  try {
    const content = await fs.readFile(filePath, 'utf8');

    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${name}"`,
        'Cache-Control': 'no-store'
      }
    });
  } catch {
    throw error(404, 'File not found.');
  }
};