'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">Something went wrong!</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        We encountered an unexpected issue. Please try again.
      </p>
      {/* Attempt to recover by trying to re-render the segment */}
      <button
        onClick={() => reset()}
        className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors"
      >
        Try again
      </button>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 p-4 border border-red-200 rounded bg-red-50 dark:bg-gray-800 w-full max-w-2xl">
          <summary className="cursor-pointer text-red-700 dark:text-red-400">Error Details (Development Only)</summary>
          <pre className="mt-2 text-xs text-left overflow-auto whitespace-pre-wrap break-words text-red-900 dark:text-red-200">
            {error.message}
            {error.stack && `\n\nStack Trace:\n${error.stack}`}
            {error.digest && `\n\nDigest: ${error.digest}`}
          </pre>
        </details>
      )}
    </div>
  )
} 