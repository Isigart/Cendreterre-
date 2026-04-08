"use client";

import type { Recipe } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  selected?: boolean;
  onToggle?: (id: string) => void;
  mode?: "normal" | "guided";
}

export default function RecipeCard({
  recipe,
  selected = false,
  onToggle,
  mode = "normal",
}: RecipeCardProps) {
  const difficultyLabel = ["", "Facile", "Moyen", "Avancé"][recipe.difficulty];
  const difficultyColor = ["", "text-sage-600", "text-chef-600", "text-red-600"][recipe.difficulty];

  return (
    <button
      onClick={() => onToggle?.(recipe.id)}
      className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
        selected
          ? "border-chef-500 bg-chef-50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{recipe.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{recipe.subtitle}</p>
        </div>

        {/* Cost badge */}
        <span
          className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${
            recipe.costBadge === "green"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {recipe.costPerServing.toFixed(2)}€
        </span>
      </div>

      {/* Meta info */}
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {recipe.totalMinutes}min
        </span>
        <span className={`${difficultyColor}`}>{difficultyLabel}</span>
        {recipe.conservation.freezer && (
          <span className="text-blue-500">❄️ Congélable</span>
        )}
      </div>

      {/* Chef tip preview */}
      {mode === "guided" && recipe.tips.pro && (
        <p className="mt-2 text-xs text-sage-700 bg-sage-50 rounded-lg p-2 line-clamp-2">
          💡 {recipe.tips.pro.guided}
        </p>
      )}

      {/* Nutrition summary */}
      <div className="mt-3 flex gap-3 text-xs text-gray-400">
        <span>{recipe.nutrition.calories} kcal</span>
        <span>{recipe.nutrition.protein}g prot.</span>
      </div>

      {/* Selection indicator */}
      {selected && (
        <div className="mt-3 flex items-center gap-1 text-chef-600 text-sm font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Sélectionnée
        </div>
      )}
    </button>
  );
}
