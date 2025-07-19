import React, { useState } from 'react';
import { Key, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { openaiService } from '../services/openaiService';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
}

// Default key to use if user does not provide one
const DEFAULT_API_KEY =
  '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';

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setIsValid(value.startsWith('sk-') && value.length > 20);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let keyToUse = apiKey;
    // If user did not enter a key, use the default key
    if (!keyToUse) {
      keyToUse = DEFAULT_API_KEY;
    }
    openaiService.setApiKey(keyToUse);
    onApiKeySet();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <Key className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          OpenAI API Key Required
        </h2>
        <p className="text-gray-600">
          To generate AI-powered recipes, you'll need to provide your OpenAI API key.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">How to get your API key:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">OpenAI Platform</a></li>
                <li>Sign in or create an account</li>
                <li>Navigate to API Keys section</li>
                <li>Create a new secret key</li>
                <li>Copy and paste it below</li>
              </ol>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="sk-..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  apiKey ? (isValid ? 'border-green-500' : 'border-red-500') : 'border-gray-300'
                }`}
              />
              <div className="absolute right-3 top-3 flex items-center space-x-2">
                {apiKey && (
                  <>
                    {isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {apiKey && !isValid && (
              <p className="text-red-600 text-sm mt-1">
                Please enter a valid OpenAI API key (starts with 'sk-')
              </p>
            )}
            {!apiKey && (
              <p className="text-blue-600 text-sm mt-1">
                No key? We'll use a default key for you.
              </p>
            )}
          </div>

          <button
            type="submit"
            // Button is always enabled, since we allow default key if none entered
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            {apiKey ? 'Save API Key & Start Cooking' : 'Use Default Key & Start Cooking'}
          </button>
        </form>

        <div className="text-center">
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <span>Get your API key from OpenAI</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600">
            <strong>Privacy Notice:</strong> Your API key is stored locally in your browser and never sent to our servers. 
            It's only used to communicate directly with OpenAI's API from your browser.
          </p>
        </div>
      </div>
    </div>
  );
};
