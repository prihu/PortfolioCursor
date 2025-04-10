// src/lib/runMiddleware.ts
import { NextApiRequest, NextApiResponse } from 'next';

// Helper function to run middleware in Next.js API routes
// Adjust types if using App Router Request object
export function runMiddleware(req: NextApiRequest | Request, res: NextApiResponse | {}, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
