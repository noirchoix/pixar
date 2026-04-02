import { nanoid } from 'nanoid';
import { env } from '$env/dynamic/private';
import { writeText } from '$lib/server/storage/fs';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60);
}

export async function exportScriptTxt(topic: string, script: string) {
  const safeName = slugify(topic) || 'story';
  const fileName = `${safeName}-${nanoid(6)}.txt`;

  if (env.NETLIFY) {
    return {
      fileName,
      downloadUrl: null,
      inlineContent: script
    };
  }

  await writeText(['exports', fileName], script);

  return {
    fileName,
    downloadUrl: `/download/${fileName}`,
    inlineContent: null
  };
}