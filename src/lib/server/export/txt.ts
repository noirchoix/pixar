import { nanoid } from 'nanoid';
import { writeText, isPersistentFilesystemDisabled } from '$lib/server/storage/fs';
import type { ExportResponse } from '$lib/types';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60);
}

export async function exportScriptTxt(topic: string, script: string): Promise<ExportResponse> {
  const safeName = slugify(topic) || 'story';
  const fileName = `${safeName}-${nanoid(6)}.txt`;

  if (isPersistentFilesystemDisabled()) {
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