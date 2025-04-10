import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Define the expected shape of the params
interface RouteContext {
  params: { slug: string };
}

// GET /api/pages/[slug] - Fetch a single Page with its components
export async function GET(request: Request, context: RouteContext) {
  // Authentication check
  const session = await getServerSession(authOptions);
  if (!session) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  console.log("--- API Route /api/pages/[slug] HIT ---");
  const { slug } = context.params;
  console.log(`--- Received slug: ${slug} ---`);

  if (!slug) {
    console.log("--- Slug parameter missing, returning 400 ---");
    return NextResponse.json({ message: 'Slug parameter is required' }, { status: 400 });
  }

  try {
    console.log(`--- Querying Prisma for page with slug: ${slug} ---`);
    const pageData = await prisma.page.findUnique({
      where: { slug: slug },
      include: {
        // Include the related components you want to display on the page
        heroComponents: {
          orderBy: { order: 'asc' }, // Ensure components are ordered correctly
        },
        experienceComponents: {
          orderBy: { order: 'asc' },
        },
        // Add other component relations here if needed (e.g., skills, education)
      },
    });
    console.log(`--- Prisma query completed. pageData found: ${!!pageData} ---`);

    if (!pageData) {
      console.log(`--- Page not found for slug: ${slug}, returning 404 ---`);
      return NextResponse.json({ message: `Page with slug '${slug}' not found` }, { status: 404 });
    }

    // Optionally, check if the page is published before returning
    // if (!pageData.isPublished) {
    //   return NextResponse.json({ message: `Page with slug '${slug}' not found` }, { status: 404 });
    // }

    console.log(`--- Returning page data for slug: ${slug} ---`);
    return NextResponse.json(pageData);

  } catch (error) {
    console.error(`--- Error fetching page data for slug ${slug}: ---`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 