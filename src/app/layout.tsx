import React, { Suspense } from 'react'
import '../styles/globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { NavigationEvents } from '../components/NavigationEvents'
import AuthProvider from '../components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Priyank Garg - Product Manager',
  description: 'Experienced Product Manager with a proven track record at Amazon and other tech companies. Expertise in product strategy, development, and execution.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Suspense fallback={null}>
            <NavigationEvents />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
