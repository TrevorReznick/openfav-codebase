import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));

    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ detail: 'Server missing DEEPSEEK_API_KEY' }), { status: 500 });
    }

    const url = new URL('https://fly-fastapi-composio-agent.fly.dev/api/v1/chat');
    if (body.prompt) url.searchParams.append('prompt', body.prompt);
    if (body.use_tools !== undefined) url.searchParams.append('use_tools', String(body.use_tools));
    if (body.user_id) url.searchParams.append('user_id', String(body.user_id));

    const fetchRes = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'Accept': 'application/json'
      },
      body: body.messages ? JSON.stringify({ messages: body.messages }) : undefined
    });

    const data = await fetchRes.json().catch(() => ({}));
    return new Response(JSON.stringify(data), {
      status: fetchRes.ok ? 200 : fetchRes.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ detail: (err as Error).message }), { status: 500 });
  }
};

export const get: APIRoute = () => new Response(JSON.stringify({ ok: true }), { status: 200 });
