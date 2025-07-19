import React, { useState } from 'react';
import { Plus, X, Lightbulb } from 'lucide-react';
import { Ingredient } from '../types';
import { openaiService } from '../services/openaiService';

interface IngredientInputProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onIngredientsChange
}) => {
  const [newIngredient, setNewIngredient] = useState('');
  const [substitutions, setSubstitutions] = useState<{ [key: string]: string[] }>({});
  const [loadingSubstitutions, setLoadingSubstitutions] = useState<string>('');

  const addIngredient = () => {
    if (newIngredient.trim()) {
      const ingredient: Ingredient = {
        id: crypto.randomUUID(),
        name: newIngredient.trim()
      };
      onIngredientsChange([...ingredients, ingredient]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (id: string) => {
    onIngredientsChange(ingredients.filter(ing => ing.id !== id));
    // Remove substitutions for removed ingredient
    const ingredientName = ingredients.find(ing => ing.id === id)?.name;
    if (ingredientName) {
      const newSubstitutions = { ...substitutions };
      delete newSubstitutions[ingredientName];
      setSubstitutions(newSubstitutions);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  const getSubstitutions = async (ingredientName: string) => {
    if (!openaiService.hasApiKey()) return;
    
    setLoadingSubstitutions(ingredientName);
    try {
      const subs = await openaiService.generateSubstitutions(ingredientName);
      setSubstitutions(prev => ({ ...prev, [ingredientName]: subs }));
    } catch (error) {
      console.error('Error getting substitutions:', error);
    } finally {
      setLoadingSubstitutions('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Add Ingredients
        </label>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., chicken breast, tomatoes, garlic..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <button
            onClick={addIngredient}
            disabled={!newIngredient.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {ingredients.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Your Ingredients ({ingredients.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 font-medium flex-1">
                    {ingredient.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    {openaiService.hasApiKey() && (
                      <button
                        onClick={() => getSubstitutions(ingredient.name)}
                        disabled={loadingSubstitutions === ingredient.name}
                        className="p-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors duration-200"
                        title="Get substitutions"
                      >
                        <Lightbulb className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => removeIngredient(ingredient.id)}
                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                      title="Remove ingredient"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {substitutions[ingredient.name] && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-amber-700 mb-2">Substitutions:</p>
                    <div className="flex flex-wrap gap-1">
                      {substitutions[ingredient.name].map((sub, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded border border-amber-200"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {loadingSubstitutions === ingredient.name && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Loading substitutions...</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};