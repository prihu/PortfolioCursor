import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Ensure this path is correct

// Zod schema for updating a Skill Category (PATCH might be better if only updating one field)
const skillCategoryUpdateSchema = z.object({
    name: z.string().min(1, "Category name is required"),
    order: z.number().int("Order must be an integer")
});

// PUT /api/skill-categories/[id] - Update a specific category (Admin only)
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

    const categoryId = params.id;
    if (!categoryId) {
        return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    try {
        const body = await request.json();
        const validation = skillCategoryUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { name, order } = validation.data;

        // Optional: Check if the new name conflicts with another existing category
        const existingCategoryWithSameName = await prisma.skillCategory.findUnique({
            where: { name: name },
        });
        if (existingCategoryWithSameName && existingCategoryWithSameName.id !== categoryId) {
            return NextResponse.json({ error: `Another category with name '${name}' already exists.` }, { status: 409 });
        }

        const updatedCategory = await prisma.skillCategory.update({
            where: { id: categoryId },
            data: {
                name,
                order,
            },
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error(`--- Skill Category PUT Error (ID: ${categoryId}) ---`, error);
        if (error instanceof Error && 'code' in error) {
            if (error.code === 'P2025') { // Record not found
                return NextResponse.json({ error: "Skill category not found" }, { status: 404 });
            }
            if (error.code === 'P2002') { // Unique constraint violation
                return NextResponse.json({ error: "A category with this name already exists." }, { status: 409 });
            }
        }
        return NextResponse.json({ error: "Failed to update skill category" }, { status: 500 });
    }
}

// DELETE /api/skill-categories/[id] - Delete a specific category (Admin only)
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

    const categoryId = params.id;
    if (!categoryId) {
        return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    try {
        // Prisma will cascade delete related Skills due to the schema relation
        await prisma.skillCategory.delete({
            where: { id: categoryId },
        });

        return NextResponse.json({ message: "Skill category deleted successfully" }, { status: 200 });
        // Or: return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error(`--- Skill Category DELETE Error (ID: ${categoryId}) ---`, error);
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ error: "Skill category not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Failed to delete skill category" }, { status: 500 });
    }
} 