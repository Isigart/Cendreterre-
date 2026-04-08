import { Redis } from "@upstash/redis";
import { seedRecipes, seedWeeklyPlan } from "../src/data/seed-recipes";

async function seed() {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  console.log("Seeding BatchChef recipes...\n");

  // Seed each recipe
  for (const recipe of seedRecipes) {
    await redis.set(`recipes:${recipe.id}`, recipe);
    await redis.sadd("recipes:index", recipe.id);
    console.log(`  ✓ ${recipe.title} (${recipe.costPerServing}€/repas)`);
  }

  // Seed weekly plan for current week
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 604800000;
  const weekNumber = Math.ceil((diff / oneWeek + start.getDay() + 1) / 7);
  const weekId = `${now.getFullYear()}-${String(weekNumber).padStart(2, "0")}`;

  const plan = { ...seedWeeklyPlan, weekId };
  await redis.set(`recipes:week:${weekId}`, plan);
  console.log(`\n  ✓ Weekly plan published for ${weekId}`);

  console.log(`\nDone! ${seedRecipes.length} recipes seeded.`);
}

seed().catch(console.error);
