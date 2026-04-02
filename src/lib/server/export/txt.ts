import { nanoid } from 'nanoid';
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
  await writeText(['exports', fileName], script);
  return {
    fileName,
    downloadUrl: `/download/${fileName}`
  };
}
