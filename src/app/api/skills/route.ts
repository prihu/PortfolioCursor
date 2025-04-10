import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Ensure this path is correct

// Zod schema for creating/updating a Skill
const skillSchema = z.object({
    name: z.string().min(1, "Skill name is required"),
    order: z.number().int("Order must be an integer"),
    skillCategoryId: z.string().cuid("Valid Category ID is required")
});

// GET /api/skills - Fetch all skills (optionally filtered by category)
export async function GET(request: Request) {
    // This could be public or protected depending on needs
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    try {
        const skills = await prisma.skill.findMany({
            where: categoryId ? { skillCategoryId: categoryId } : {},
            orderBy: [
                { skillCategoryId: 'asc' }, // Keep skills from same category together
                { order: 'asc' },
            ],
            // Optionally include category details
            // include: { skillCategory: { select: { name: true } } }
        });
        return NextResponse.json(skills);
    } catch (error) {
        console.error("--- Skills GET Error ---", error);
        return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
    }
}

// POST /api/skills - Create a new skill (Admin only)
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // @ts-ignore
    if (session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const validation = skillSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { name, order, skillCategoryId } = validation.data;

        // Check if category exists
        const categoryExists = await prisma.skillCategory.findUnique({
            where: { id: skillCategoryId },
        });
        if (!categoryExists) {
            return NextResponse.json({ error: `Skill category with ID ${skillCategoryId} not found.` }, { status: 404 });
        }

        // Check if skill name already exists within this category
        const existingSkill = await prisma.skill.findUnique({
            where: {
                skillCategoryId_name_unique: {
                    skillCategoryId: skillCategoryId,
                    name: name,
                }
            },
        });
        if (existingSkill) {
             return NextResponse.json({ error: `Skill '${name}' already exists in this category.` }, { status: 409 });
        }

        const newSkill = await prisma.skill.create({
            data: {
                name,
                order,
                skillCategoryId,
            },
        });

        return NextResponse.json(newSkill, { status: 201 });
    } catch (error) {
        console.error("--- Skill POST Error ---", error);
         if (error instanceof Error && 'code' in error) {
            if (error.code === 'P2002') { // Unique constraint violation
                return NextResponse.json({ error: "This skill already exists in this category." }, { status: 409 });
            }
             if (error.code === 'P2003') { // Foreign key constraint failed
                 return NextResponse.json({ error: "Invalid Skill Category ID specified." }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
    }
} 