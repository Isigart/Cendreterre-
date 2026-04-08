import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

// Key patterns
export const keys = {
  recipe: (id: string) => `recipes:${id}`,
  weeklyPlan: (weekId: string) => `recipes:week:${weekId}`,
  recipeIndex: () => "recipes:index",

  session: (id: string) => `sessions:${id}`,
  activeSession: (userId: string) => `sessions:active:${userId}`,
  sessionHistory: (userId: string) => `sessions:history:${userId}`,

  user: (id: string) => `users:${id}`,
  userByEmail: (email: string) => `users:email:${email}`,
  subscription: (userId: string) => `users:subscription:${userId}`,

  nutritionCache: (code: string) => `nutrition:ciqual:${code}`,
};

// Current week ID in YYYY-WW format
export function getCurrentWeekId(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 604800000;
  const weekNumber = Math.ceil((diff / oneWeek + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-${String(weekNumber).padStart(2, "0")}`;
}
