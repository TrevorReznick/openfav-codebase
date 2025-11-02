interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  response: string;
  model: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
    completion_tokens_details: any;
    prompt_tokens_details: {
      audio_tokens: number | null;
      cached_tokens: number;
    };
    prompt_cache_hit_tokens: number;
    prompt_cache_miss_tokens: number;
  };
}

export async function sendChatMessage(
  prompt: string,
  options: {
    apiKey: string;
    useTools?: boolean;
    userId?: string;
    messages?: ChatMessage[];
  }
): Promise<ChatResponse> {
  const { apiKey, useTools = false, userId = 'default', messages } = options;

  const url = new URL('https://fly-fastapi-composio-agent.fly.dev/api/v1/chat');
  
  // Add query parameters
  url.searchParams.append('prompt', prompt);
  url.searchParams.append('use_tools', useTools.toString());
  url.searchParams.append('user_id', userId);

  const apiKey = import.meta.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not defined in environment variables');
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      'Accept': 'application/json',
    },
    // If we have previous messages, send them in the body
    body: messages ? JSON.stringify({ messages }) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `API request failed with status ${response.status}: ${errorData.detail || 'Unknown error'}`
    );
  }

  return response.json();
}
