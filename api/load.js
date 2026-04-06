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

  const { code } = body;
  if (!code || typeof code !== "string" || code.length < 3 || code.length > 20) {
    return new Response(
      JSON.stringify({ ok: false, error: "Code invalide" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const key = "ctl:" + code.toLowerCase().trim();

  try {
    const raw = await redis.get(key);
    if (!raw) {
      return new Response(
        JSON.stringify({ ok: true, hero: null, world: null }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    return new Response(
      JSON.stringify({ ok: true, hero: data.hero || null, world: data.world || null }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: e.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
