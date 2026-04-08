import { NextResponse } from "next/server";
import { getWeeklyRecipes } from "@/lib/recipes";
import { getCurrentWeekId } from "@/lib/redis";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const weekId = searchParams.get("week") || getCurrentWeekId();
    const recipes = await getWeeklyRecipes(weekId);

    return NextResponse.json({ recipes, weekId });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Impossible de charger les recettes" },
      { status: 500 }
    );
  }
}
