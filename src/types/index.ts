export interface Ingredient {
  id: string;
  name: string;
}

export interface RecipeFilters {
  dietaryPreferences: string[];
  cookingTime: string;
  difficulty: string;
  servings: number;
}

export interface NutritionalInfo {
  calories?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  fiber?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  totalTime: string;
  difficulty: string;
  servings: number;
  nutritionalInfo?: NutritionalInfo;
  tags: string[];
  createdAt: Date;
}

export interface ApiError {
  message: string;
  code?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';