import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '$env/dynamic/private';

const DEFAULT_STORAGE_DIR = '.local';

export function isServerlessRuntime() {
  return (
    env.NETLIFY === 'true' ||
    !!env.AWS_LAMBDA_FUNCTION_NAME ||
    !!env.LAMBDA_TASK_ROOT ||
    !!env.NETLIFY_IMAGES_CDN_DOMAIN
  );
}

export function isPersistentFilesystemDisabled() {
  return isServerlessRuntime();
}

export function getStorageDir() {
  return path.resolve(process.cwd(), env.APP_STORAGE_DIR || DEFAULT_STORAGE_DIR);
}

export async function ensureDir(...segments: string[]) {
  if (isPersistentFilesystemDisabled()) {
    throw new Error('Filesystem persistence is disabled in serverless production.');
  }

  const dir = path.join(getStorageDir(), ...segments);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function writeJson<T>(segments: string[], value: T) {
  if (isPersistentFilesystemDisabled()) {
    return null;
  }

  const dir = await ensureDir(...segments.slice(0, -1));
  const filePath = path.join(dir, segments[segments.length - 1]);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf8');
  return filePath;
}

export async function writeText(segments: string[], text: string) {
  if (isPersistentFilesystemDisabled()) {
    return null;
  }

  const dir = await ensureDir(...segments.slice(0, -1));
  const filePath = path.join(dir, segments[segments.length - 1]);
  await fs.writeFile(filePath, text, 'utf8');
  return filePath;
}