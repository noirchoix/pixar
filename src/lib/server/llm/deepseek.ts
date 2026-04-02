import { env } from '$env/dynamic/private';

const DEFAULT_MODEL = 'deepseek-chat';
const DEFAULT_BASE_URL = 'https://api.deepseek.com';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

function getConfig() {
  const apiKey = env.DEEPSEEK_API_KEY;
  const model = env.DEEPSEEK_MODEL || DEFAULT_MODEL;
  const baseUrl = env.DEEPSEEK_BASE_URL || DEFAULT_BASE_URL;

  if (!apiKey) {
    throw new Error('Missing DEEPSEEK_API_KEY');
  }

  return { apiKey, model, baseUrl };
}

export async function createJsonCompletion<T>(messages: ChatMessage[], maxTokens = 1800): Promise<T> {
  const { apiKey, model, baseUrl } = getConfig();

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.8,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`DeepSeek request failed: ${response.status} ${text}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (!content || typeof content !== 'string') {
    throw new Error('DeepSeek returned an empty completion.');
  }

  return JSON.parse(content) as T;
}
