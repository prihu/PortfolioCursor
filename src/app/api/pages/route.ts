import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// GET /api/pages - Fetch all pages (id, title, slug) for admin selection
export async function GET(request: Request) {
  // Optional: Protect this route if only admins should see the page list
  const session = await getServerSession(authOptions);
  if (!session) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  try {
    const pages = await prisma.page.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

// TODO: Add POST/PATCH/DELETE for pages later if needed

// --- REVIEW BLOCK START ---
// Requesting review for the GET /api/pages route.
// Focus areas: Data fetching logic (findMany, select), optional authentication.
// Reviewers: SDE-III (Backend), Principal Architect, Security SME, QA Engineer
// --- REVIEW BLOCK END --- 