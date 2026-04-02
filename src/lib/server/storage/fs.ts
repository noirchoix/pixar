import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '$env/dynamic/private';

const DEFAULT_STORAGE_DIR = '.local';

export function isNetlify() {
  return !!env.NETLIFY;
}

export function getStorageDir() {
  return path.resolve(process.cwd(), env.APP_STORAGE_DIR || DEFAULT_STORAGE_DIR);
}

export async function ensureDir(...segments: string[]) {
  if (isNetlify()) {
    throw new Error('Filesystem persistence is disabled on Netlify production.');
  }

  const dir = path.join(getStorageDir(), ...segments);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function writeJson<T>(segments: string[], value: T) {
  if (isNetlify()) {
    return null;
  }

  const dir = await ensureDir(...segments.slice(0, -1));
  const filePath = path.join(dir, segments[segments.length - 1]);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf8');
  return filePath;
}

export async function writeText(segments: string[], text: string) {
  if (isNetlify()) {
    return null;
  }

  const dir = await ensureDir(...segments.slice(0, -1));
  const filePath = path.join(dir, segments[segments.length - 1]);
  await fs.writeFile(filePath, text, 'utf8');
  return filePath;
}