import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Ensure this path is correct

// Zod schema for updating an Education Component (PATCH better?)
// pageId should not be updatable here
const educationUpdateSchema = z.object({
    institution: z.string().min(1, "Institution name is required"),
    degree: z.string().min(1, "Degree name is required"),
    startDate: z.coerce.date({ errorMap: () => ({ message: "Invalid start date." }) }),
    endDate: z.coerce.date().optional().nullable(),
    description: z.string().optional().nullable(),
    order: z.number().int("Order must be an integer"),
});

// PUT /api/education/[id] - Update a specific education entry (Admin only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Check for ADMIN role
    // @ts-ignore
    if (session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const educationId = params.id;
    if (!educationId) {
        return NextResponse.json({ error: "Education ID is required" }, { status: 400 });
    }

    try {
        const body = await request.json();
        const validation = educationUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const validatedData = validation.data;

        // Check if the updated entry conflicts with another existing entry on the SAME page
        const currentEducation = await prisma.educationComponent.findUnique({ where: { id: educationId } });
        if (!currentEducation) {
             return NextResponse.json({ error: "Education entry not found" }, { status: 404 });
        }
        const currentPageId = currentEducation.pageId;

        const existingConflict = await prisma.educationComponent.findUnique({
            where: {
                pageId_institution_degree_unique: {
                    pageId: currentPageId, // Ensure check is within the same page
                    institution: validatedData.institution,
                    degree: validatedData.degree,
                }
            },
        });

        if (existingConflict && existingConflict.id !== educationId) {
             return NextResponse.json({ error: `Another identical education entry already exists on this page.` }, { status: 409 });
        }

        const updatedEducation = await prisma.educationComponent.update({
            where: { id: educationId },
            data: {
                institution: validatedData.institution,
                degree: validatedData.degree,
                startDate: validatedData.startDate,
                endDate: validatedData.endDate,
                description: validatedData.description,
                order: validatedData.order,
                // pageId is NOT updated here
            },
        });

        return NextResponse.json(updatedEducation);
    } catch (error) {
        console.error(`--- Education PUT Error (ID: ${educationId}) ---`, error);
        if (error instanceof Error && 'code' in error) {
            if (error.code === 'P2025') { // Record not found
                return NextResponse.json({ error: "Education entry not found" }, { status: 404 });
            }
            if (error.code === 'P2002') { // Unique constraint violation
                 return NextResponse.json({ error: "This education entry already exists for this page." }, { status: 409 });
            }
        }
        return NextResponse.json({ error: "Failed to update education entry" }, { status: 500 });
    }
}

// DELETE /api/education/[id] - Delete a specific education entry (Admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Check for ADMIN role
    // @ts-ignore
    if (session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const educationId = params.id;
    if (!educationId) {
        return NextResponse.json({ error: "Education ID is required" }, { status: 400 });
    }

    try {
        await prisma.educationComponent.delete({
            where: { id: educationId },
        });

        return NextResponse.json({ message: "Education entry deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(`--- Education DELETE Error (ID: ${educationId}) ---`, error);
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ error: "Education entry not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Failed to delete education entry" }, { status: 500 });
    }
} 