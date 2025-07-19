import React from 'react';
import { RecipeFilters as Filters } from '../types';

interface RecipeFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export const RecipeFilters: React.FC<RecipeFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 
    'Keto', 'Paleo', 'Low-carb', 'High-protein'
  ];

  const cookingTimeOptions = [
    'Under 15 minutes',
    '15-30 minutes', 
    '30-60 minutes',
    '1-2 hours',
    'Over 2 hours'
  ];

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  const handleDietaryChange = (option: string) => {
    const updated = filters.dietaryPreferences.includes(option)
      ? filters.dietaryPreferences.filter(pref => pref !== option)
      : [...filters.dietaryPreferences, option];
    
    onFiltersChange({ ...filters, dietaryPreferences: updated });
  };

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800">Recipe Preferences</h3>
      
      {/* Dietary Preferences */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Dietary Preferences
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {dietaryOptions.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.dietaryPreferences.includes(option)}
                onChange={() => handleDietaryChange(option)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cooking Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cooking Time
          </label>
          <select
            value={filters.cookingTime}
            onChange={(e) => onFiltersChange({ ...filters, cookingTime: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {cookingTimeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) => onFiltersChange({ ...filters, difficulty: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {difficultyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Servings */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Servings
          </label>
          <input
            type="number"
            min="1"
            max="12"
            value={filters.servings}
            onChange={(e) => onFiltersChange({ ...filters, servings: parseInt(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};