import { PrismaClient } from '@prisma/client'

// Declare a global variable to hold the Prisma instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Initialize Prisma Client
// Check if we are in production or if the global prisma instance doesn't exist
const prisma = global.prisma || new PrismaClient({
  // Optional: Add logging configuration if needed
  // log: ['query', 'info', 'warn', 'error'],
})

// In development, assign the instance to the global variable
// This prevents creating multiple instances during hot reloads
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma

// --- REVIEW BLOCK START ---
// Requesting review for the shared Prisma Client instantiation pattern.
// Focus areas: Singleton pattern implementation, handling global scope in Node.js/Next.js dev environment.
// Reviewers: SDE-III (Backend), Principal Architect
// --- REVIEW BLOCK END --- 