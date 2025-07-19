import { Recipe } from '../types';

const FAVORITES_KEY = 'recipe_generator_favorites';

export const saveFavoriteRecipe = (recipe: Recipe): void => {
  try {
    const favorites = getFavoriteRecipes();
    const updatedFavorites = [...favorites, recipe];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error saving favorite recipe:', error);
  }
};

export const removeFavoriteRecipe = (recipeId: string): void => {
  try {
    const favorites = getFavoriteRecipes();
    const updatedFavorites = favorites.filter(recipe => recipe.id !== recipeId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing favorite recipe:', error);
  }
};

export const getFavoriteRecipes = (): Recipe[] => {
  try {
    const favoritesJson = localStorage.getItem(FAVORITES_KEY);
    if (!favoritesJson) return [];
    
    const favorites = JSON.parse(favoritesJson);
    return favorites.map((recipe: any) => ({
      ...recipe,
      createdAt: new Date(recipe.createdAt)
    }));
  } catch (error) {
    console.error('Error loading favorite recipes:', error);
    return [];
  }
};

export const isFavoriteRecipe = (recipeId: string): boolean => {
  const favorites = getFavoriteRecipes();
  return favorites.some(recipe => recipe.id === recipeId);
};