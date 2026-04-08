import { NextResponse } from "next/server";
import { getRecipe } from "@/lib/recipes";
import { saveSession } from "@/lib/sessions";
import { createOptimizedSession } from "@/lib/scheduler";
import type { Recipe } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipeIds, servingsPerRecipe, userId } = body;

    if (
      !recipeIds ||
      !Array.isArray(recipeIds) ||
      recipeIds.length < 1 ||
      recipeIds.length > 5
    ) {
      return NextResponse.json(
        { error: "Sélectionnez entre 1 et 5 recettes" },
        { status: 400 }
      );
    }

    // Fetch all selected recipes
    const recipes: Recipe[] = [];
    for (const id of recipeIds) {
      const recipe = await getRecipe(id);
      if (!recipe) {
        return NextResponse.json(
          { error: `Recette introuvable : ${id}` },
          { status: 404 }
        );
      }
      recipes.push(recipe);
    }

    // Create optimized session
    const session = createOptimizedSession({
      recipes,
      servingsPerRecipe: servingsPerRecipe || {},
      userId: userId || "anonymous",
    });

    // Save to Redis
    await saveSession(session);

    return NextResponse.json({
      session: {
        id: session.id,
        estimatedTotalMinutes: session.estimatedTotalMinutes,
        taskCount: session.tasks.length,
        recipes: recipes.map((r) => ({ id: r.id, title: r.title })),
        status: session.status,
      },
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Impossible de créer la session" },
      { status: 500 }
    );
  }
}
