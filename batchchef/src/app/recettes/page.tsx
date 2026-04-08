"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RecipeSelector from "@/components/RecipeSelector";
import type { Recipe } from "@/lib/types";

export default function RecettesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode] = useState<"normal" | "guided">("normal");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("/api/recipes");
        const data = await res.json();
        setRecipes(data.recipes || []);
      } catch {
        console.error("Failed to fetch recipes");
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  const handleStartSession = async (
    recipeIds: string[],
    servings: Record<string, number>
  ) => {
    setCreating(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeIds, servingsPerRecipe: servings }),
      });
      const data = await res.json();
      if (data.session?.id) {
        router.push(`/session?id=${data.session.id}`);
      }
    } catch {
      console.error("Failed to create session");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🍳</div>
          <p className="text-gray-500">Chargement des recettes...</p>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">📅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Pas encore de recettes cette semaine
          </h2>
          <p className="text-gray-500">
            Les 20 nouvelles recettes arrivent chaque lundi.
            Reviens bientôt !
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Recettes de la semaine
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Choisis jusqu&apos;à 5 recettes pour ta session batch cooking
        </p>
      </div>

      <RecipeSelector
        recipes={recipes}
        mode={mode}
        onStartSession={handleStartSession}
      />

      {creating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4 animate-spin">🍳</div>
            <p className="font-semibold text-gray-900">
              Optimisation de ta session...
            </p>
            <p className="text-sm text-gray-500 mt-1">
              L&apos;IA calcule le meilleur enchaînement
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
