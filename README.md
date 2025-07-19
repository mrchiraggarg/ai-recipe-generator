# AI-Powered Recipe Generator

A modern, responsive web application that generates personalized recipes using AI (OpenAI GPT API) based on ingredients you have available.

## Features

- **Dynamic Ingredient Management**: Add and remove ingredients with an intuitive interface
- **AI Recipe Generation**: Powered by OpenAI GPT API for creative and practical recipes
- **Smart Filters**: Customize recipes by dietary preferences, cooking time, difficulty, and servings
- **Ingredient Substitutions**: Get AI-powered suggestions for ingredient alternatives
- **Nutritional Information**: Detailed nutritional breakdown for each recipe
- **Favorites System**: Save and manage your favorite recipes locally
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **TypeScript**: Full type safety and excellent developer experience

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone this repository or use it as a template
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### OpenAI API Setup

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to the API Keys section
4. Create a new secret key
5. Copy the key and paste it into the app when prompted

The app will guide you through this process on first launch.

### Environment Variables (Optional)

You can set your OpenAI API key as an environment variable:

```bash
# .env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

1. **Add Ingredients**: Use the ingredient input to add items you have available
2. **Set Preferences**: Configure dietary restrictions, cooking time, difficulty, and servings
3. **Generate Recipe**: Click "Generate Recipe" to create an AI-powered recipe
4. **Save Favorites**: Save recipes you love for quick access later
5. **Get Substitutions**: Click the lightbulb icon next to ingredients for alternatives

## Architecture

The application follows React best practices with a clean, modular architecture:

```
src/
├── components/          # Reusable UI components
│   ├── IngredientInput.tsx
│   ├── RecipeFilters.tsx
│   ├── RecipeDisplay.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   ├── FavoriteRecipes.tsx
│   └── ApiKeySetup.tsx
├── services/           # API integration
│   └── openaiService.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions
│   └── localStorage.ts
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

## Key Technologies

- **React 18**: Latest React with hooks and functional components
- **TypeScript**: Full type safety and excellent developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **OpenAI API**: GPT-3.5-turbo for recipe generation and ingredient substitutions
- **Lucide React**: Beautiful, customizable icons
- **Vite**: Fast build tool and development server

## Features Explained

### Recipe Generation
The app uses OpenAI's GPT-3.5-turbo model to create recipes based on:
- Available ingredients
- Dietary preferences (vegetarian, vegan, gluten-free, etc.)
- Cooking time constraints
- Difficulty level
- Number of servings

### Ingredient Substitutions
Get AI-powered suggestions for ingredient alternatives, perfect for when you're missing something or have dietary restrictions.

### Nutritional Information
Each generated recipe includes estimated nutritional information:
- Calories per serving
- Protein, carbohydrates, fat, and fiber content
- Based on the ingredients and portions in the recipe

### Local Storage
Favorite recipes are stored locally in your browser, so they persist between sessions without requiring an account.

## Customization

The app is designed to be easily customizable:

- **Styling**: Modify the Tailwind classes or add custom CSS
- **API Integration**: Extend the OpenAI service or add other AI providers
- **Features**: Add new filters, recipe categories, or meal planning features
- **Storage**: Replace localStorage with a database for user accounts

## Security Note

The app currently uses client-side API calls to OpenAI for simplicity. In a production environment, consider:
- Using a backend proxy to hide API keys
- Implementing user authentication
- Adding rate limiting and usage monitoring

## Contributing

This is a complete, production-ready application that demonstrates modern React development practices. Feel free to:
- Add new features
- Improve the UI/UX
- Optimize performance
- Add tests

## License

MIT License - feel free to use this code for your own projects!