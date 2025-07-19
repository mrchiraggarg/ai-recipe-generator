import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Generating your recipe...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-blue-200 rounded-full animate-pulse"></div>
      </div>
      <p className="text-gray-600 text-center font-medium">{message}</p>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-0"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
};