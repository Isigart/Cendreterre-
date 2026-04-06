export const config = { runtime: "edge" };

import { Redis } from "@upstash/redis";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const redis = getRedis();
  if (!redis) {
    return new Response(
      JSON.stringify({ ok: false, error: "Redis not configured" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { code, hero, world } = body;
  if (!code || typeof code !== "string" || code.length < 3 || code.length > 20) {
    return new Response(
      JSON.stringify({ ok: false, error: "Code invalide (3-20 caractères)" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const key = "ctl:" + code.toLowerCase().trim();

  try {
    const data = { hero: hero || null, world: world || null, updated: Date.now() };
    await redis.set(key, JSON.stringify(data), { ex: 60 * 60 * 24 * 90 }); // 90 jours
    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: e.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
