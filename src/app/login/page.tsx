'use client'

import React, { useState, FormEvent, useEffect, useCallback, Suspense } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { HeroComponent, Page as PageType } from '@prisma/client';

// Define a loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Loading login state...</p>
    </div>
  );
}

// Component that uses useSearchParams
function LoginComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("[Login Page Effect] Status:", status);
    if (status === 'authenticated') {
      const callbackUrl = searchParams.get('callbackUrl') || '/admin';
      console.log(`[Login Page Effect] Authenticated! Redirecting to: ${callbackUrl}`);
      router.replace(callbackUrl);
    }
  }, [status, router, searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    console.log("[Login Submit] Attempting sign in...");

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });

      console.log("[Login Submit] Sign-in Result:", result);

      if (result?.error) {
        const errorMessage = result.error === 'CredentialsSignin'
          ? 'Invalid email or password.'
          : 'An unexpected error occurred during login.';
        setError(errorMessage);
        console.error("[Login Submit] Sign-in error reported:", result.error);
      } else if (result?.ok && !result.error) {
        console.log("[Login Submit] Sign-in reported OK. Waiting for session status update via useEffect...");
      } else {
        setError('Login attempt failed with unknown result. Please try again.');
        console.error("[Login Submit] Sign-in failed with result:", result);
      }
    } catch (err) {
      console.error("[Login Submit] Exception during sign-in:", err);
      setError('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <LoadingFallback />; // Use fallback during session loading
  }

  if (status === 'authenticated') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Already logged in. Redirecting...</p>
      </div>
    );
  }

  // Render the actual login form UI
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Admin Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 dark:focus:ring-offset-gray-800"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// The main page component now wraps LoginComponent in Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginComponent />
    </Suspense>
  );
} 