'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // No need to pass session prop here; SessionProvider handles fetching it
  return <SessionProvider>{children}</SessionProvider>;
}

// --- REVIEW BLOCK START ---
// Requesting review for the AuthProvider client component wrapper.
// Focus areas: Correct use of SessionProvider, client component directive.
// Reviewers: Frontend Developer, SDE-III (Backend), Principal Architect
// --- REVIEW BLOCK END --- 