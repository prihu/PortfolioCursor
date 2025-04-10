import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod'; // Assuming zod is installed for validation
import { getAuthSession } from '@/lib/auth'; // Assuming you have a way to get session

const prisma = new PrismaClient();

// Zod schema for validating the request body for PUT
const updateExperienceSchema = z.object({
    jobTitle: z.string().min(1, "Job title is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().optional().nullable(),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid start date" }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid end date" }).optional().nullable(),
    description: z.string().optional().nullable(),
    order: z.number().int().positive("Order must be a positive integer"),
    // pageId should not be updated via this route, it's inferred or unnecessary for update
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const session = await getAuthSession();

    if (!session || !session.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const experienceId = params.id;

    if (!experienceId) {
        return new NextResponse('Experience ID is required', { status: 400 });
    }

    try {
        const body = await request.json();
        const validation = updateExperienceSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const {
            jobTitle,
            company,
            location,
            startDate,
            endDate,
            description,
            order
        } = validation.data;

        // Check if the experience entry exists before updating
        const existingExperience = await prisma.experienceComponent.findUnique({
            where: { id: experienceId },
        });

        if (!existingExperience) {
            return new NextResponse('Experience not found', { status: 404 });
        }

        // Update the experience entry
        const updatedExperience = await prisma.experienceComponent.update({
            where: { id: experienceId },
            data: {
                jobTitle,
                company,
                location: location ?? null,
                startDate: new Date(startDate), // Convert string date to Date object
                endDate: endDate ? new Date(endDate) : null, // Convert string date to Date object or null
                description: description ?? null,
                order,
                // Do not update pageId here
            },
        });

        console.log(`--- Experience updated successfully: ID ${updatedExperience.id} ---`);
        return NextResponse.json(updatedExperience, { status: 200 });

    } catch (error) {
        console.error("--- Experience PUT Error ---", error);
        if (error instanceof z.ZodError) {
             return NextResponse.json({ errors: error.flatten().fieldErrors }, { status: 400 });
        }
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// Placeholder for DELETE - to be implemented in BE-3
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
     const session = await getAuthSession();

    if (!session || !session.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const experienceId = params.id;
    // console.log(`--- DELETE request received for Experience ID: ${experienceId} ---`);
    // TODO: Implement deletion logic here (Task BE-3)
    // return new NextResponse('DELETE method not implemented yet', { status: 501 });

    if (!experienceId) {
        return new NextResponse('Experience ID is required', { status: 400 });
    }

    try {
        // Optional: Check if the experience entry exists before attempting deletion
        const existingExperience = await prisma.experienceComponent.findUnique({
            where: { id: experienceId },
        });

        if (!existingExperience) {
            // Decide if this should be a 404 or just proceed (deletion is idempotent)
            // Returning 404 might be clearer
            return new NextResponse('Experience not found', { status: 404 });
        }

        // Delete the experience entry
        await prisma.experienceComponent.delete({
            where: { id: experienceId },
        });

        console.log(`--- Experience deleted successfully: ID ${experienceId} ---`);
        // Return a success response, typically 200 OK or 204 No Content for DELETE
        return NextResponse.json({ message: 'Experience deleted successfully' }, { status: 200 });
        // Or: return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error("--- Experience DELETE Error ---", error);
        // Handle potential Prisma errors (e.g., record not found if not checked above)
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return new NextResponse('Experience not found', { status: 404 });
        }
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 