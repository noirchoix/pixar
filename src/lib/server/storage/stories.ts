import { env } from '$env/dynamic/private';
import { writeJson } from '$lib/server/storage/fs';
import type { FlowResponse, PersistedStory, ScriptResponse } from '$lib/types';

export async function saveFlow(flow: FlowResponse): Promise<PersistedStory> {
  const record: PersistedStory = {
    id: flow.requestId,
    createdAt: new Date().toISOString(),
    topic: flow.topic,
    flow
  };

  if (!env.NETLIFY) {
    await writeJson(['stories', `${flow.requestId}.json`], record);
  }

  return record;
}

export async function saveScript(
  topic: string,
  flow: FlowResponse,
  script: ScriptResponse
): Promise<PersistedStory> {
  const record: PersistedStory = {
    id: script.storyId,
    createdAt: new Date().toISOString(),
    topic,
    flow,
    script
  };

  if (!env.NETLIFY) {
    await writeJson(['stories', `${script.storyId}.json`], record);
  }

  return record;
}