import React, { useState, useEffect } from 'react';
import { Heart, Clock, Users, Trash2, ChefHat } from 'lucide-react';
import { Recipe } from '../types';
import { getFavoriteRecipes, removeFavoriteRecipe } from '../utils/localStorage';

interface FavoriteRecipesProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

export const FavoriteRecipes: React.FC<FavoriteRecipesProps> = ({ onSelectRecipe }) => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    setFavorites(getFavoriteRecipes());
  }, []);

  const handleRemoveFavorite = (recipeId: string) => {
    removeFavoriteRecipe(recipeId);
    setFavorites(getFavoriteRecipes());
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No favorite recipes yet.</p>
        <p className="text-sm text-gray-400 mt-2">
          Generate and save recipes to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
        <Heart className="w-5 h-5 text-pink-600" />
        <span>Favorite Recipes ({favorites.length})</span>
      </h3>
      
      <div className="grid gap-4">
        {favorites.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => onSelectRecipe(recipe)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-lg mb-1">
                  {recipe.title}
                </h4>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {recipe.description}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavorite(recipe.id);
                }}
                className="ml-3 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                title="Remove from favorites"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.totalTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ChefHat className="w-4 h-4" />
                  <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(recipe.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};