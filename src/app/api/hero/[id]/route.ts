import prisma from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Zod Schema for UPDATE (PATCH) - All fields optional
const HeroUpdateSchema = z.object({
  order: z.number().int().min(0).optional(),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  summary: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaLink: z.string().url().optional().or(z.literal('')),
  resumeLinkLabel: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  // pageId should generally not be updated this way, handle moves separately
}).partial(); // Make all fields optional for PATCH

// Replace with actual Admin User ID (from DB/config)
const ADMIN_USER_ID = "admin-user-seed-id";

// Define the Zod schema for validation, matching HeroComponent model fields
const heroSchema = z.object({
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  summary: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaLink: z.string().optional(), // Consider URL validation if appropriate
  resumeLinkLabel: z.string().optional(),
  imageUrl: z.string().url("Invalid URL").optional(), // Keep URL validation
}).partial(); // Keep .partial() as PATCH allows partial updates

// Helper function to extract ID from URL pathname
function getIdFromRequest(request: NextRequest): string | null {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean); // Split and remove empty segments
    // Assuming the path is /api/hero/[id]
    if (pathSegments.length === 3 && pathSegments[0] === 'api' && pathSegments[1] === 'hero') {
      return pathSegments[2];
    }
    return null;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
}

// GET - Fetch a specific hero component by ID
export async function GET(request: NextRequest) {
  const id = getIdFromRequest(request);
  if (!id) {
    return NextResponse.json({ message: "Could not determine ID from URL" }, { status: 400 });
  }
  console.log("Received GET request for hero ID:", id);

  // Restore original logic
  try {
    // Add validation to ensure ID is a number before parsing
    if (isNaN(parseInt(id, 10))) {
      return NextResponse.json({ message: "Invalid ID format. ID must be a number." }, { status: 400 });
    }
    const numericId = parseInt(id, 10);

    const heroComponent = await prisma.heroComponent.findUnique({
      where: { id: id },
    });

    if (!heroComponent) {
      return NextResponse.json({ message: "Hero component not found" }, { status: 404 });
    }

    return NextResponse.json(heroComponent);
  } catch (error) {
    console.error("Error fetching hero section:", error);
    // Generic error for unexpected issues
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH - Update a specific hero component by ID
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = getIdFromRequest(request);
  if (!id) {
    return NextResponse.json({ message: "Could not determine ID from URL" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
  }

  const validation = heroSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ message: "Invalid data", errors: validation.error.errors }, { status: 400 });
  }

  // Add validation to ensure ID is a number before parsing
  if (isNaN(parseInt(id, 10))) {
    return NextResponse.json({ message: "Invalid ID format. ID must be a number." }, { status: 400 });
  }
  const numericId = parseInt(id, 10);

  try {
    const updatedHero = await prisma.heroComponent.update({
      where: { id: id },
      data: validation.data,
    });
    return NextResponse.json(updatedHero);
  } catch (error: any) {
    console.error("Error updating hero section:", error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: "Hero component not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE - Delete a specific hero component by ID
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = getIdFromRequest(request);
  if (!id) {
    return NextResponse.json({ message: "Could not determine ID from URL" }, { status: 400 });
  }

  // Add validation to ensure ID is a number before parsing
  if (isNaN(parseInt(id, 10))) {
    return NextResponse.json({ message: "Invalid ID format. ID must be a number." }, { status: 400 });
  }
  const numericId = parseInt(id, 10);

  try {
    await prisma.heroComponent.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: "Hero component deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting hero section:", error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: "Hero component not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// --- REVIEW BLOCK START ---
// Requesting review for the dynamic API route /api/hero/[id] (GET, PATCH, DELETE).
// Focus areas: Route parameter handling, GET logic, PATCH logic (partial update schema, validation), DELETE logic, authentication checks, error handling (incl. P2025), TODOs for specific authorization.
// Reviewers: SDE-III (Backend), Principal Architect, Security SME, QA Engineer
// --- REVIEW BLOCK END --- 