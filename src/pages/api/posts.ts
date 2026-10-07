import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  return new Response(JSON.stringify({
    url: url || '(空)',
    keyPrefix: key ? key.slice(0, 20) + '...' : '(空)',
    urlLength: url ? url.length : 0,
    keyLength: key ? key.length : 0,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};