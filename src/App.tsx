import React, { useState, useCallback } from 'react';
import { ChefHat, Sparkles, BookOpen } from 'lucide-react';
import { Ingredient, RecipeFilters, Recipe, LoadingState } from './types';
import { IngredientInput } from './components/IngredientInput';
import { RecipeFilters as RecipeFiltersComponent } from './components/RecipeFilters';
import { RecipeDisplay } from './components/RecipeDisplay';
import { FavoriteRecipes } from './components/FavoriteRecipes';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ApiKeySetup } from './components/ApiKeySetup';
import { openaiService } from './services/openaiService';

function App() {
  // State management
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [filters, setFilters] = useState<RecipeFilters>({
    dietaryPreferences: [],
    cookingTime: '15-30 minutes',
    difficulty: 'Easy',
    servings: 4
  });
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'generator' | 'favorites'>('generator');
  const [hasApiKey, setHasApiKey] = useState(openaiService.hasApiKey());

  // Generate recipe function
  const generateRecipe = useCallback(async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    setLoadingState('loading');
    setError('');
    setCurrentRecipe(null);

    try {
      const recipe = await openaiService.generateRecipe(ingredients, filters);
      setCurrentRecipe(recipe);
      setLoadingState('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recipe';
      setError(errorMessage);
      setLoadingState('error');
    }
  }, [ingredients, filters]);

  // Handle API key setup
  const handleApiKeySet = () => {
    setHasApiKey(true);
  };

  // Handle retry
  const handleRetry = () => {
    generateRecipe();
  };

  // Handle favorite recipe selection
  const handleSelectFavoriteRecipe = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setActiveTab('generator');
  };

  // Show API key setup if not configured
  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <ChefHat className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">AI Recipe Generator</h1>
            </div>
            <p className="text-gray-600">Create amazing recipes with the power of AI</p>
          </div>
          <ApiKeySetup onApiKeySet={handleApiKeySet} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">AI Recipe Generator</h1>
            </div>
            
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'generator'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                Generator
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'favorites'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Favorites
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'generator' ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Inputs */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <IngredientInput
                  ingredients={ingredients}
                  onIngredientsChange={setIngredients}
                />
              </div>

              <RecipeFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
              />

              <button
                onClick={generateRecipe}
                disabled={loadingState === 'loading' || ingredients.length === 0}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loadingState === 'loading' ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Generating Recipe...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Recipe</span>
                  </span>
                )}
              </button>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2">
              {loadingState === 'loading' && (
                <div className="bg-white rounded-lg shadow-md">
                  <LoadingSpinner message="Creating your perfect recipe..." />
                </div>
              )}

              {loadingState === 'error' && (
                <ErrorMessage message={error} onRetry={handleRetry} />
              )}

              {currentRecipe && loadingState === 'success' && (
                <RecipeDisplay recipe={currentRecipe} />
              )}

              {loadingState === 'idle' && !currentRecipe && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Ready to Create Something Delicious?
                  </h3>
                  <p className="text-gray-500">
                    Add some ingredients and let AI create the perfect recipe for you!
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <FavoriteRecipes onSelectRecipe={handleSelectFavoriteRecipe} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            Built with ❤️ using React, TypeScript, and OpenAI GPT
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Create amazing recipes with the power of artificial intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;