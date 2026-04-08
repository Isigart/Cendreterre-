"use client";

import type { SessionTask, CookingMode } from "@/lib/types";
import SessionTimer from "./SessionTimer";

interface StepViewProps {
  task: SessionTask;
  mode: CookingMode;
  stepNumber: number;
  totalSteps: number;
  onComplete: () => void;
  onSkip: () => void;
}

export default function StepView({
  task,
  mode,
  stepNumber,
  totalSteps,
  onComplete,
  onSkip,
}: StepViewProps) {
  const description = mode === "guided" ? task.detailedDescription : task.description;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col bg-gray-50">
      {/* Progress bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>
            Étape {stepNumber}/{totalSteps}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
            {task.recipeTitle}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-chef-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main content — ONE TASK */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        {/* Task type badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            task.type === "passive"
              ? "bg-sage-100 text-sage-700"
              : "bg-chef-100 text-chef-700"
          }`}
        >
          {task.type === "passive" ? "⏳ En attente" : "👨‍🍳 À faire"}
        </div>

        {/* Task description */}
        <h2 className="text-xl font-bold text-gray-900 text-center leading-relaxed max-w-md">
          {description}
        </h2>

        {/* Timer */}
        {task.durationMinutes > 0 && (
          <SessionTimer
            durationMinutes={task.durationMinutes}
            isPassive={task.type === "passive"}
            onComplete={onComplete}
            autoStart={task.type === "passive"}
          />
        )}

        {/* Chef tip */}
        {task.tip && (
          <div className="w-full max-w-md bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">💡 Astuce du chef</span>
              <br />
              {mode === "guided" ? task.tip.guided : task.tip.normal}
            </p>
          </div>
        )}

        {/* Next up preview */}
        {task.nextTaskPreview && (
          <div className="w-full max-w-md text-center text-sm text-gray-400">
            Ensuite → {task.nextTaskPreview}
          </div>
        )}
      </div>

      {/* Bottom actions — big touch targets for kitchen use */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 space-y-3">
        <button
          onClick={onComplete}
          className="w-full py-4 rounded-xl bg-chef-500 text-white font-bold text-lg hover:bg-chef-600 active:bg-chef-700 transition-colors"
        >
          {task.type === "passive" ? "C'est prêt !" : "Étape terminée ✓"}
        </button>
        <button
          onClick={onSkip}
          className="w-full py-3 rounded-xl text-gray-400 text-sm hover:text-gray-600 transition-colors"
        >
          Passer cette étape
        </button>
      </div>
    </div>
  );
}
