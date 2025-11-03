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
    apiKey?: string;
    useTools?: boolean;
    userId?: string;
    messages?: ChatMessage[];
  }
): Promise<ChatResponse> {
  const { apiKey: providedApiKey, useTools = false, userId = 'default', messages } = options;

  const API_ENDPOINT = import.meta.env.PUBLIVC_SERVER_API_URL || 'https://fly-fastapi-composio-agent.fly.dev/api/v1/chat';

  const url = new URL(import.meta.env.PUBLIC_SERVER_API_URL);
  
  // Add query parameters
  url.searchParams.append('prompt', prompt);
  url.searchParams.append('use_tools', useTools.toString());
  url.searchParams.append('user_id', userId);

  // Determine API key: prefer explicit prop, then common env variants
  const envApiKey = import.meta.env.PUBLIC_DEEPSEEK_API_KEY || import.meta.env.VITE_DEEPSEEK_API_KEY || import.meta.env.DEEPSEEK_API_KEY || import.meta.env.PUBLIC_VITE_DEEPSEEK_API_KEY;
  const finalApiKey = providedApiKey || envApiKey;

  // If no key available client-side, optionally use a server-side proxy
  const useProxy = import.meta.env.USE_CHAT_PROXY === 'true';
  if (!finalApiKey && useProxy) {
    const proxyRes = await fetch('/api/chat-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, use_tools: useTools, user_id: userId, messages }),
    });

    if (!proxyRes.ok) {
      const errorData = await proxyRes.json().catch(() => ({}));
      throw new Error(`Proxy request failed with status ${proxyRes.status}: ${errorData.detail || 'Unknown error'}`);
    }

    return proxyRes.json();
  }

  if (!finalApiKey) {
    throw new Error('Deepseek API key is not defined in environment variables or options');
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': finalApiKey,
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
