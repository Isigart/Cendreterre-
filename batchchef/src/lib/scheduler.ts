import type { Recipe, BatchSession, SessionTask, ChefTip } from "./types";

interface SchedulerInput {
  recipes: Recipe[];
  servingsPerRecipe: Record<string, number>;
  userId: string;
}

interface TimelineSlot {
  recipeId: string;
  recipeTitle: string;
  stepId: string;
  description: string;
  detailedDescription: string;
  durationMinutes: number;
  type: "active" | "passive";
  tip?: ChefTip;
  // Internal scheduling fields
  earliestStart: number; // minutes from session start
  scheduledStart: number;
  scheduledEnd: number;
}

/**
 * BatchChef Session Scheduler
 *
 * Takes 5 recipes and produces an optimized sequence of tasks.
 * The key insight: during passive steps (simmering, baking, resting),
 * the user can do active work on other recipes.
 *
 * Strategy:
 * 1. Sort recipes by total passive time (desc) — start longest waits first
 * 2. Build a timeline: schedule active tasks, then fill passive wait windows
 *    with active tasks from other recipes
 * 3. Output a flat task list — user sees ONE task at a time
 */
export function createOptimizedSession(input: SchedulerInput): BatchSession {
  const { recipes, servingsPerRecipe, userId } = input;

  // Phase 1: Extract all steps from all recipes with recipe context
  const allSteps: TimelineSlot[] = [];
  for (const recipe of recipes) {
    let cumulativeTime = 0;
    for (const step of recipe.steps) {
      allSteps.push({
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        stepId: step.id,
        description: step.description,
        detailedDescription: step.detailedDescription,
        durationMinutes: step.durationMinutes,
        type: step.type,
        tip: step.tip,
        earliestStart: cumulativeTime,
        scheduledStart: 0,
        scheduledEnd: 0,
      });
      cumulativeTime += step.durationMinutes;
    }
  }

  // Phase 2: Sort recipes by passive time (most passive first = start simmering early)
  const recipesByPassiveTime = [...recipes].sort(
    (a, b) => b.totalPassiveMinutes - a.totalPassiveMinutes
  );

  // Phase 3: Schedule tasks using a greedy timeline approach
  const scheduled: TimelineSlot[] = [];
  let currentTime = 0;

  // Track progress per recipe: which step index we're at
  const recipeProgress = new Map<string, number>();
  for (const r of recipes) {
    recipeProgress.set(r.id, 0);
  }

  // Track active passive tasks (things simmering/baking in background)
  const activePassiveTasks: { recipeId: string; endsAt: number }[] = [];

  // Process recipes in order of passive time
  const recipeOrder = recipesByPassiveTime.map((r) => r.id);
  let safetyCounter = 0;
  const maxIterations = allSteps.length * 3;

  while (hasUnscheduledSteps(recipeProgress, recipes) && safetyCounter < maxIterations) {
    safetyCounter++;

    // Clean up finished passive tasks
    activePassiveTasks.splice(
      0,
      activePassiveTasks.length,
      ...activePassiveTasks.filter((t) => t.endsAt > currentTime)
    );

    // Find the next step to schedule
    let scheduledThisRound = false;

    for (const recipeId of recipeOrder) {
      const recipe = recipes.find((r) => r.id === recipeId)!;
      const stepIndex = recipeProgress.get(recipeId)!;

      if (stepIndex >= recipe.steps.length) continue;

      const step = recipe.steps[stepIndex];

      if (step.type === "active") {
        // Schedule active task now
        const slot: TimelineSlot = {
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          stepId: step.id,
          description: step.description,
          detailedDescription: step.detailedDescription,
          durationMinutes: step.durationMinutes,
          type: "active",
          tip: step.tip,
          earliestStart: 0,
          scheduledStart: currentTime,
          scheduledEnd: currentTime + step.durationMinutes,
        };
        scheduled.push(slot);
        currentTime += step.durationMinutes;
        recipeProgress.set(recipeId, stepIndex + 1);
        scheduledThisRound = true;

        // Check if next step for this recipe is passive — if so, schedule it immediately
        const nextStepIndex = stepIndex + 1;
        if (nextStepIndex < recipe.steps.length) {
          const nextStep = recipe.steps[nextStepIndex];
          if (nextStep.type === "passive") {
            const passiveSlot: TimelineSlot = {
              recipeId: recipe.id,
              recipeTitle: recipe.title,
              stepId: nextStep.id,
              description: nextStep.description,
              detailedDescription: nextStep.detailedDescription,
              durationMinutes: nextStep.durationMinutes,
              type: "passive",
              tip: nextStep.tip,
              earliestStart: 0,
              scheduledStart: currentTime,
              scheduledEnd: currentTime + nextStep.durationMinutes,
            };
            scheduled.push(passiveSlot);
            activePassiveTasks.push({
              recipeId: recipe.id,
              endsAt: currentTime + nextStep.durationMinutes,
            });
            recipeProgress.set(recipeId, nextStepIndex + 1);
            // Don't advance currentTime — passive tasks run in background
          }
        }
        break; // Restart the recipe loop after scheduling
      } else {
        // Passive step that wasn't preceded by an active step
        // (e.g., first step is passive, or consecutive passive steps)
        const passiveSlot: TimelineSlot = {
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          stepId: step.id,
          description: step.description,
          detailedDescription: step.detailedDescription,
          durationMinutes: step.durationMinutes,
          type: "passive",
          tip: step.tip,
          earliestStart: 0,
          scheduledStart: currentTime,
          scheduledEnd: currentTime + step.durationMinutes,
        };
        scheduled.push(passiveSlot);
        activePassiveTasks.push({
          recipeId: recipe.id,
          endsAt: currentTime + step.durationMinutes,
        });
        recipeProgress.set(recipeId, stepIndex + 1);
        scheduledThisRound = true;
        break;
      }
    }

    if (!scheduledThisRound) {
      // Nothing schedulable — fast forward to when next passive task ends
      if (activePassiveTasks.length > 0) {
        const earliestEnd = Math.min(...activePassiveTasks.map((t) => t.endsAt));
        currentTime = earliestEnd;
      } else {
        currentTime++;
      }
    }
  }

  // Phase 4: Calculate total session time
  // The session ends when the last task (active or passive) finishes
  const lastActiveEnd = Math.max(...scheduled.filter(s => s.type === "active").map(s => s.scheduledEnd), 0);
  const lastPassiveEnd = Math.max(...scheduled.filter(s => s.type === "passive").map(s => s.scheduledEnd), 0);
  const estimatedTotalMinutes = Math.max(lastActiveEnd, lastPassiveEnd);

  // Phase 5: Convert to session tasks with "next up" previews
  const tasks: SessionTask[] = scheduled.map((slot, index) => ({
    id: `task-${index}`,
    recipeId: slot.recipeId,
    recipeTitle: slot.recipeTitle,
    stepId: slot.stepId,
    description: slot.description,
    detailedDescription: slot.detailedDescription,
    durationMinutes: slot.durationMinutes,
    type: slot.type,
    tip: slot.tip,
    status: "pending" as const,
    nextTaskPreview:
      index < scheduled.length - 1
        ? `${scheduled[index + 1].recipeTitle} — ${scheduled[index + 1].description}`
        : undefined,
  }));

  const sessionId = generateSessionId();

  return {
    id: sessionId,
    userId,
    recipeIds: recipes.map((r) => r.id),
    servingsPerRecipe,
    tasks,
    currentTaskIndex: 0,
    estimatedTotalMinutes,
    status: "planning",
    createdAt: new Date().toISOString(),
  };
}

function hasUnscheduledSteps(
  progress: Map<string, number>,
  recipes: Recipe[]
): boolean {
  for (const recipe of recipes) {
    const index = progress.get(recipe.id) || 0;
    if (index < recipe.steps.length) return true;
  }
  return false;
}

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Format session duration for display
 * e.g., 135 → "2h15"
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${String(mins).padStart(2, "0")}`;
}
