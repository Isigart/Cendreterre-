import { NextResponse } from "next/server";
import { getWeeklyRecipes } from "@/lib/recipes";
import { getCurrentWeekId } from "@/lib/redis";

export async function GET() {
  try {
    const weekId = getCurrentWeekId();
    const recipes = await getWeeklyRecipes(weekId);

    return NextResponse.json({
      weekId,
      count: recipes.length,
      recipes: recipes.map((r) => ({
        id: r.id,
        title: r.title,
        subtitle: r.subtitle,
        costPerServing: r.costPerServing,
        costBadge: r.costBadge,
        totalMinutes: r.totalMinutes,
        difficulty: r.difficulty,
        tags: r.tags,
        nutrition: r.nutrition,
        conservation: r.conservation,
      })),
    });
  } catch (error) {
    console.error("Error fetching weekly recipes:", error);
    return NextResponse.json(
      { error: "Impossible de charger les recettes de la semaine" },
      { status: 500 }
    );
  }
}
