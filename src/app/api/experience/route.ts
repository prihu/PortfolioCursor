import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Admin Check (replace with actual ID or role check)
const ADMIN_USER_ID = "admin-user-seed-id";

// Zod Schema for creating an Experience Component
const ExperienceCreateSchema = z.object({
  pageId: z.string().cuid(),
  order: z.number().int().min(0),
  jobTitle: z.string().min(1, { message: "Job title is required." }),
  company: z.string().min(1, { message: "Company name is required." }),
  location: z.string().optional(),
  // Use z.coerce for dates to handle potential string inputs from forms
  startDate: z.coerce.date({ errorMap: () => ({ message: "Invalid start date." }) }),
  endDate: z.coerce.date().optional(), // Optional for current jobs
  description: z.string().optional(),
});

// GET /api/experience - Fetch all Experience components (for a specific page later?)
export async function GET(request: Request) {
  // TODO: Add filtering by pageId?
  try {
    const experiences = await prisma.experienceComponent.findMany({
      orderBy: {
        // Order by end date desc (most recent first), then start date desc
        endDate: 'desc',
        // startDate: 'desc', // Prisma doesn't easily support multi-sort with nulls last
        // Consider sorting by start date in client or separate query
        order: 'asc' // Fallback to manual order
      },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experience components:", error);
    return NextResponse.json(
      { error: "Failed to fetch experience components" },
      { status: 500 }
    );
  }
}

// POST /api/experience - Create a new Experience component
export async function POST(request: Request) {
  // 1. Authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Authorization check using role
  // @ts-ignore
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 3. Body Parsing
  let requestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 4. Validation
  const validationResult = ExperienceCreateSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Invalid input data", details: validationResult.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const validatedData = validationResult.data;

  // 5. Check Page Existence
  try {
    const pageExists = await prisma.page.findUnique({ where: { id: validatedData.pageId }, select: { id: true } });
    if (!pageExists) {
      return NextResponse.json({ error: `Page with ID ${validatedData.pageId} not found.` }, { status: 404 });
    }
  } catch (error) {
    console.error("Error checking page existence:", error);
    return NextResponse.json({ error: "Failed to verify page existence" }, { status: 500 });
  }

  // 6. Create Component
  try {
    const newExperience = await prisma.experienceComponent.create({
      data: { ...validatedData },
    });
    return NextResponse.json(newExperience, { status: 201 });
  } catch (error: any) {
    console.error("Error creating experience component:", error);
    return NextResponse.json(
      { error: "Failed to create experience component" },
      { status: 500 }
    );
  }
}

// --- REVIEW BLOCK START ---
// Requesting review for the /api/experience route (GET, POST).
// Focus areas: Zod schema (esp. date coercion), GET sorting logic, POST handler steps (auth, validation, page check, create), consistency with /api/hero.
// Reviewers: SDE-III (Backend), Principal Architect, Database SME, Security SME, QA Engineer
// --- REVIEW BLOCK END --- 