'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-600
            rounded-md text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 