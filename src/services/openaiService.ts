import OpenAI from 'openai';
import { Recipe, Ingredient, RecipeFilters } from '../types';

class OpenAIService {
  private openai: OpenAI | null = null;
  private apiKey: string | null = null;

  constructor() {
    // Check for API key in environment variables or localStorage
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai_api_key');
    if (this.apiKey) {
      this.initializeClient();
    }
  }

  private initializeClient() {
    if (!this.apiKey) return;
    
    this.openai = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
    });
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
    this.initializeClient();
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async generateRecipe(ingredients: Ingredient[], filters: RecipeFilters): Promise<Recipe> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const ingredientNames = ingredients.map(ing => ing.name).join(', ');
    const dietaryRestrictions = filters.dietaryPreferences.length > 0 
      ? ` following ${filters.dietaryPreferences.join(', ')} dietary restrictions` 
      : '';
    
    const prompt = `Create a detailed recipe using these ingredients: ${ingredientNames}.
    
Requirements:
- Cooking time: ${filters.cookingTime}
- Difficulty: ${filters.difficulty}
- Servings: ${filters.servings}${dietaryRestrictions}

Please provide a JSON response with the following structure:
{
  "title": "Recipe Name",
  "description": "Brief description of the dish",
  "ingredients": ["ingredient 1 with measurements", "ingredient 2 with measurements"],
  "instructions": ["step 1", "step 2", "step 3"],
  "prepTime": "X minutes",
  "cookTime": "X minutes", 
  "totalTime": "X minutes",
  "difficulty": "${filters.difficulty}",
  "servings": ${filters.servings},
  "nutritionalInfo": {
    "calories": 500,
    "protein": "25g",
    "carbs": "60g", 
    "fat": "15g",
    "fiber": "8g"
  },
  "tags": ["tag1", "tag2", "tag3"]
}

Make the recipe creative, practical, and delicious. Include realistic nutritional estimates.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system", 
            content: "You are a professional chef and nutritionist. Always respond with valid JSON only, no additional text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response received from OpenAI');
      }

      // Parse the JSON response
      const recipeData = JSON.parse(content);
      
      // Create a complete Recipe object
      const recipe: Recipe = {
        id: crypto.randomUUID(),
        title: recipeData.title,
        description: recipeData.description,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        prepTime: recipeData.prepTime,
        cookTime: recipeData.cookTime,
        totalTime: recipeData.totalTime,
        difficulty: recipeData.difficulty,
        servings: recipeData.servings,
        nutritionalInfo: recipeData.nutritionalInfo,
        tags: recipeData.tags || [],
        createdAt: new Date()
      };

      return recipe;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      if (error instanceof Error) {
        // Handle specific OpenAI API errors with more helpful messages
        if (error.message.includes('429') || error.message.includes('quota')) {
          throw new Error('OpenAI API quota exceeded. Please check your billing details at https://platform.openai.com/account/usage or try again later.');
        } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
          throw new Error('Invalid OpenAI API key. Please check your API key configuration.');
        } else if (error.message.includes('rate limit')) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else {
          throw new Error(`Failed to generate recipe: ${error.message}`);
        }
      }
      throw new Error('Failed to generate recipe');
    }
  }

  async generateSubstitutions(ingredient: string): Promise<string[]> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Suggest 5 good substitutions for "${ingredient}" in cooking. 
    Return only a JSON array of strings, no additional text.
    Example: ["substitute 1", "substitute 2", "substitute 3", "substitute 4", "substitute 5"]`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a culinary expert. Always respond with valid JSON only."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response received');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Substitution generation error:', error);
      return [];
    }
  }
}

export const openaiService = new OpenAIService();