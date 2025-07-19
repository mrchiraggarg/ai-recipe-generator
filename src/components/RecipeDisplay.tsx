import React, { useState } from 'react';
import { Clock, Users, ChefHat, Heart, Save, Tag } from 'lucide-react';
import { Recipe } from '../types';
import { saveFavoriteRecipe, isFavoriteRecipe } from '../utils/localStorage';

interface RecipeDisplayProps {
  recipe: Recipe;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  const [isFavorited, setIsFavorited] = useState(isFavoriteRecipe(recipe.id));

  const handleSaveFavorite = () => {
    saveFavoriteRecipe(recipe);
    setIsFavorited(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
            <p className="text-blue-100 text-lg">{recipe.description}</p>
          </div>
          <button
            onClick={handleSaveFavorite}
            disabled={isFavorited}
            className={`ml-4 p-3 rounded-full transition-all duration-200 ${
              isFavorited 
                ? 'bg-pink-500 text-white cursor-default' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title={isFavorited ? 'Recipe saved!' : 'Save to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Meta Information */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Total Time</p>
              <p className="font-semibold text-gray-800">{recipe.totalTime}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Servings</p>
              <p className="font-semibold text-gray-800">{recipe.servings}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ChefHat className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-xs text-gray-500">Difficulty</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Save className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-xs text-gray-500">Prep Time</p>
              <p className="font-semibold text-gray-800">{recipe.prepTime}</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center space-x-2 mb-2">
              <Tag className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded border border-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Ingredients */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h3>
          <div className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
              >
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <span className="text-gray-800">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h3>
          <div className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-gray-800 pt-1">{instruction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nutritional Information */}
      {recipe.nutritionalInfo && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Nutritional Information (per serving)</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recipe.nutritionalInfo.calories && (
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-2xl font-bold text-orange-600">{recipe.nutritionalInfo.calories}</p>
                <p className="text-sm text-gray-600">Calories</p>
              </div>
            )}
            {recipe.nutritionalInfo.protein && (
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-2xl font-bold text-red-600">{recipe.nutritionalInfo.protein}</p>
                <p className="text-sm text-gray-600">Protein</p>
              </div>
            )}
            {recipe.nutritionalInfo.carbs && (
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-2xl font-bold text-blue-600">{recipe.nutritionalInfo.carbs}</p>
                <p className="text-sm text-gray-600">Carbs</p>
              </div>
            )}
            {recipe.nutritionalInfo.fat && (
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-2xl font-bold text-yellow-600">{recipe.nutritionalInfo.fat}</p>
                <p className="text-sm text-gray-600">Fat</p>
              </div>
            )}
            {recipe.nutritionalInfo.fiber && (
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-2xl font-bold text-green-600">{recipe.nutritionalInfo.fiber}</p>
                <p className="text-sm text-gray-600">Fiber</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};