"use client";

import { useState } from "react";
import type { Recipe } from "@/lib/types";
import RecipeCard from "./RecipeCard";
import { formatDuration } from "@/lib/scheduler";

interface RecipeSelectorProps {
  recipes: Recipe[];
  mode: "normal" | "guided";
  onStartSession: (recipeIds: string[], servings: Record<string, number>) => void;
}

export default function RecipeSelector({
  recipes,
  mode,
  onStartSession,
}: RecipeSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [servings, setServings] = useState<Record<string, number>>({});

  const toggleRecipe = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 5) {
        next.add(id);
      }
      return next;
    });
  };

  const selectedRecipes = recipes.filter((r) => selectedIds.has(r.id));
  const estimatedMinutes = selectedRecipes.reduce((sum, r) => {
    // Rough estimate: active time + max passive time (parallel)
    return sum + r.totalActiveMinutes;
  }, 0) + Math.max(...selectedRecipes.map((r) => r.totalPassiveMinutes), 0);

  const totalCost = selectedRecipes.reduce((sum, r) => {
    const s = servings[r.id] || r.servings;
    return sum + r.costPerServing * s;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Selection counter */}
      <div className="sticky top-14 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {selectedIds.size}/5
            </span>
            <span className="text-sm text-gray-500 ml-2">recettes choisies</span>
          </div>
          {selectedIds.size > 0 && (
            <div className="text-right text-sm">
              <div className="text-gray-500">
                ~{formatDuration(estimatedMinutes)} · {totalCost.toFixed(2)}€
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recipe grid */}
      <div className="px-4 grid gap-3 sm:grid-cols-2">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            selected={selectedIds.has(recipe.id)}
            onToggle={toggleRecipe}
            mode={mode}
          />
        ))}
      </div>

      {/* Servings adjuster for selected recipes */}
      {selectedIds.size > 0 && (
        <div className="px-4 space-y-3">
          <h3 className="font-semibold text-gray-900">Nombre de portions</h3>
          {selectedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3"
            >
              <span className="text-sm text-gray-700 truncate flex-1">
                {recipe.title}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setServings((s) => ({
                      ...s,
                      [recipe.id]: Math.max(1, (s[recipe.id] || recipe.servings) - 1),
                    }))
                  }
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-6 text-center">
                  {servings[recipe.id] || recipe.servings}
                </span>
                <button
                  onClick={() =>
                    setServings((s) => ({
                      ...s,
                      [recipe.id]: Math.min(12, (s[recipe.id] || recipe.servings) + 1),
                    }))
                  }
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Start session button */}
      {selectedIds.size > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
          <button
            onClick={() => onStartSession(Array.from(selectedIds), servings)}
            className="w-full py-4 rounded-xl bg-chef-500 text-white font-bold text-lg hover:bg-chef-600 active:bg-chef-700 transition-colors"
          >
            Lancer ma session · ~{formatDuration(estimatedMinutes)}
          </button>
        </div>
      )}
    </div>
  );
}
