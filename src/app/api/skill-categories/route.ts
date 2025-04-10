import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Ensure this path is correct

// Zod schema for creating/updating a Skill Category
const skillCategorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    order: z.number().int("Order must be an integer")
});

// GET /api/skill-categories - Fetch all categories
export async function GET(request: Request) {
    // This could be public or protected depending on needs
    // const session = await getServerSession(authOptions);
    // if (!session) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

    try {
        const categories = await prisma.skillCategory.findMany({
            orderBy: { order: 'asc' },
            // Optionally include skills if needed directly here, but maybe separate endpoint is better
            // include: { skills: { orderBy: { order: 'asc' } } }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("--- Skill Categories GET Error ---", error);
        return NextResponse.json({ error: "Failed to fetch skill categories" }, { status: 500 });
    }
}

// POST /api/skill-categories - Create a new category (Admin only)
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for ADMIN role
    // @ts-ignore // Ignore TypeScript error if role is not yet strongly typed on session
    if (session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const validation = skillCategorySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { name, order } = validation.data;

        // Check for existing category name
        const existingCategory = await prisma.skillCategory.findUnique({
            where: { name: name },
        });
        if (existingCategory) {
            return NextResponse.json({ error: `Category with name '${name}' already exists.` }, { status: 409 }); // 409 Conflict
        }

        const newCategory = await prisma.skillCategory.create({
            data: {
                name,
                order,
            },
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error("--- Skill Category POST Error ---", error);
        // Handle potential unique constraint errors if not caught above
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
             return NextResponse.json({ error: "A category with this name already exists." }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create skill category" }, { status: 500 });
    }
} 