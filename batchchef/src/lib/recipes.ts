import { getRedis, keys, getCurrentWeekId } from "./redis";
import type { Recipe, WeeklyPlan, ShoppingList, ShoppingListItem, SharedIngredient } from "./types";

export async function getRecipe(id: string): Promise<Recipe | null> {
  const redis = getRedis();
  return redis.get<Recipe>(keys.recipe(id));
}

export async function getWeeklyRecipes(weekId?: string): Promise<Recipe[]> {
  const redis = getRedis();
  const week = weekId || getCurrentWeekId();
  const plan = await redis.get<WeeklyPlan>(keys.weeklyPlan(week));
  if (!plan) return [];

  const recipes = await Promise.all(
    plan.recipeIds.map((id) => redis.get<Recipe>(keys.recipe(id)))
  );
  return recipes.filter((r): r is Recipe => r !== null);
}

export async function saveRecipe(recipe: Recipe): Promise<void> {
  const redis = getRedis();
  await redis.set(keys.recipe(recipe.id), recipe);
  await redis.sadd(keys.recipeIndex(), recipe.id);
}

export async function publishWeeklyPlan(
  weekId: string,
  recipeIds: string[]
): Promise<void> {
  const redis = getRedis();
  const plan: WeeklyPlan = {
    weekId,
    recipeIds,
    publishedAt: new Date().toISOString(),
  };
  await redis.set(keys.weeklyPlan(weekId), plan);
}

export function generateShoppingList(
  recipes: Recipe[],
  servingsMap: Record<string, number>
): ShoppingList {
  const ingredientMap = new Map<string, ShoppingListItem>();
  const ingredientRecipeMap = new Map<string, Set<string>>();

  for (const recipe of recipes) {
    const multiplier = (servingsMap[recipe.id] || recipe.servings) / recipe.servings;

    for (const ing of recipe.ingredients) {
      const key = `${ing.name.toLowerCase()}|${ing.unit}`;

      if (!ingredientRecipeMap.has(key)) {
        ingredientRecipeMap.set(key, new Set());
      }
      ingredientRecipeMap.get(key)!.add(recipe.id);

      if (ingredientMap.has(key)) {
        const existing = ingredientMap.get(key)!;
        existing.quantity += ing.quantity * multiplier;
        existing.estimatedCost += ing.estimatedCost * multiplier;
        existing.recipeIds = Array.from(new Set([...existing.recipeIds, recipe.id]));
      } else {
        ingredientMap.set(key, {
          name: ing.name,
          quantity: Math.round(ing.quantity * multiplier * 100) / 100,
          unit: ing.unit,
          category: ing.category,
          estimatedCost: Math.round(ing.estimatedCost * multiplier * 100) / 100,
          recipeIds: [recipe.id],
        });
      }
    }
  }

  const ingredients = Array.from(ingredientMap.values()).sort((a, b) =>
    a.category.localeCompare(b.category)
  );

  // Detect shared ingredients (used in 2+ recipes)
  const sharedIngredients: SharedIngredient[] = [];
  for (const [key, recipeIds] of Array.from(ingredientRecipeMap.entries())) {
    if (recipeIds.size >= 2) {
      const item = ingredientMap.get(key)!;
      // Estimated saving: ~30% of cost for shared ingredients (bulk buying)
      const saving = Math.round(item.estimatedCost * 0.3 * 100) / 100;
      sharedIngredients.push({
        name: item.name,
        totalQuantity: item.quantity,
        unit: item.unit,
        usedInRecipes: Array.from(recipeIds),
        estimatedSaving: saving,
      });
    }
  }

  const totalEstimatedCost = ingredients.reduce((sum, i) => sum + i.estimatedCost, 0);
  const totalSavings = sharedIngredients.reduce((sum, s) => sum + s.estimatedSaving, 0);

  return {
    sessionId: "",
    ingredients,
    totalEstimatedCost: Math.round(totalEstimatedCost * 100) / 100,
    sharedIngredients,
    totalSavings: Math.round(totalSavings * 100) / 100,
  };
}
