import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Ensure this path is correct

// Zod schema for creating/updating an Education Component
const educationSchema = z.object({
    institution: z.string().min(1, "Institution name is required"),
    degree: z.string().min(1, "Degree name is required"),
    startDate: z.coerce.date({ errorMap: () => ({ message: "Invalid start date." }) }),
    endDate: z.coerce.date().optional().nullable(), // Optional and nullable
    description: z.string().optional().nullable(),
    order: z.number().int("Order must be an integer"),
    pageId: z.string().cuid("Valid Page ID is required") // Required for POST
});

// GET /api/education - Fetch education entries (filtered by pageId)
export async function GET(request: Request) {
    // Should be protected if admin-only, or public if used on public pages
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    // For admin use, pageId might be optional (fetch all) or required.
    // For public use, pageId is likely required.
    // Let's assume it's required for now.
    if (!pageId) {
        return NextResponse.json({ error: "pageId query parameter is required" }, { status: 400 });
    }

    try {
        const educationEntries = await prisma.educationComponent.findMany({
            where: { pageId: pageId },
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(educationEntries);
    } catch (error) {
        console.error("--- Education GET Error ---", error);
        return NextResponse.json({ error: "Failed to fetch education entries" }, { status: 500 });
    }
}

// POST /api/education - Create a new education entry (Admin only)
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Check for ADMIN role
    // @ts-ignore
    if (session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();
        // We include pageId in the schema for validation
        const validation = educationSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const validatedData = validation.data;

        // Check if page exists
        const pageExists = await prisma.page.findUnique({ where: { id: validatedData.pageId } });
        if (!pageExists) {
            return NextResponse.json({ error: `Page with ID ${validatedData.pageId} not found.` }, { status: 404 });
        }

        // Check for duplicate based on unique constraint (optional)
        const existingEducation = await prisma.educationComponent.findUnique({
             where: {
                 pageId_institution_degree_unique: {
                     pageId: validatedData.pageId,
                     institution: validatedData.institution,
                     degree: validatedData.degree,
                 }
             }
        });
        if (existingEducation) {
            return NextResponse.json({ error: `This education entry already exists for this page.` }, { status: 409 });
        }

        const newEducation = await prisma.educationComponent.create({
            data: {
                institution: validatedData.institution,
                degree: validatedData.degree,
                startDate: validatedData.startDate,
                endDate: validatedData.endDate,
                description: validatedData.description,
                order: validatedData.order,
                pageId: validatedData.pageId,
            },
        });

        return NextResponse.json(newEducation, { status: 201 });
    } catch (error) {
        console.error("--- Education POST Error ---", error);
        if (error instanceof Error && 'code' in error) {
            if (error.code === 'P2002') { // Unique constraint violation
                return NextResponse.json({ error: "This education entry already exists for this page." }, { status: 409 });
            }
            if (error.code === 'P2003') { // Foreign key constraint failed
                 return NextResponse.json({ error: "Invalid Page ID specified." }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Failed to create education entry" }, { status: 500 });
    }
} 