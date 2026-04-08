// ===== RECIPES =====

export type CostBadge = "green" | "blue"; // green: <3€, blue: <5€

export interface ChefTip {
  normal: string;
  guided: string;
}

export interface RecipeStep {
  id: string;
  order: number;
  description: string;
  detailedDescription: string; // for guided mode
  durationMinutes: number;
  type: "active" | "passive"; // active = hands-on, passive = simmering/baking/resting
  tip?: ChefTip;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  servings: number;
  costPerServing: number; // in euros
  costBadge: CostBadge;
  totalActiveMinutes: number;
  totalPassiveMinutes: number;
  totalMinutes: number;
  difficulty: 1 | 2 | 3;
  season: "spring" | "summer" | "autumn" | "winter" | "all";
  tags: string[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tips: {
    pro: ChefTip;
    vigilance: ChefTip;
    batch: ChefTip;
    substitution?: ChefTip;
    nutrition?: ChefTip;
  };
  nutrition: NutritionInfo;
  conservation: {
    fridge: number; // days
    freezer: number | null; // days, null = do not freeze
    note?: string;
  };
  createdAt: string;
  validatedByChef: boolean;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: "produce" | "meat" | "dairy" | "pantry" | "spice" | "other";
  estimatedCost: number; // euros
}

// ===== WEEKLY PLAN =====

export interface WeeklyPlan {
  weekId: string; // YYYY-WW format
  recipeIds: string[];
  publishedAt: string;
}

// ===== SESSIONS =====

export type TaskStatus = "pending" | "active" | "completed" | "skipped";

export interface SessionTask {
  id: string;
  recipeId: string;
  recipeTitle: string;
  stepId: string;
  description: string;
  detailedDescription: string;
  durationMinutes: number;
  type: "active" | "passive";
  tip?: ChefTip;
  status: TaskStatus;
  startedAt?: string;
  completedAt?: string;
  nextTaskPreview?: string;
}

export interface BatchSession {
  id: string;
  userId: string;
  recipeIds: string[];
  servingsPerRecipe: Record<string, number>;
  tasks: SessionTask[];
  currentTaskIndex: number;
  estimatedTotalMinutes: number;
  actualStartedAt?: string;
  completedAt?: string;
  status: "planning" | "active" | "paused" | "completed";
  createdAt: string;
}

// ===== USERS =====

export type CookingMode = "normal" | "guided";

export interface User {
  id: string;
  email: string;
  name: string;
  mode: CookingMode;
  householdSize: number;
  dietaryRestrictions: string[];
  createdAt: string;
}

export interface UserSubscription {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: "trialing" | "active" | "canceled" | "past_due";
  currentPeriodEnd: string;
  trialEnd?: string;
}

// ===== SHARED INGREDIENTS =====

export interface SharedIngredient {
  name: string;
  totalQuantity: number;
  unit: string;
  usedInRecipes: string[];
  estimatedSaving: number; // euros saved by buying once
}

export interface ShoppingList {
  sessionId: string;
  ingredients: ShoppingListItem[];
  totalEstimatedCost: number;
  sharedIngredients: SharedIngredient[];
  totalSavings: number;
}

export interface ShoppingListItem {
  name: string;
  quantity: number;
  unit: string;
  category: Ingredient["category"];
  estimatedCost: number;
  recipeIds: string[];
}
