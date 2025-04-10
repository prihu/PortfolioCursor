import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Ensure this path is correct

// Zod schema for updating a Skill (PATCH might be better)
// Note: Updating skillCategoryId might require careful handling or disallowing
const skillUpdateSchema = z.object({
    name: z.string().min(1, "Skill name is required"),
    order: z.number().int("Order must be an integer"),
    // skillCategoryId: z.string().cuid("Valid Category ID is required").optional() // Allow changing category?
});

// PUT /api/skills/[id] - Update a specific skill (Admin only)
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

    const skillId = params.id;
    if (!skillId) {
        return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    try {
        const body = await request.json();
        const validation = skillUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { name, order } = validation.data;

        // Need to check if the new name conflicts within its *current* category
        // Get the current category ID first
        const currentSkill = await prisma.skill.findUnique({ where: { id: skillId } });
        if (!currentSkill) {
             return NextResponse.json({ error: "Skill not found" }, { status: 404 });
        }
        const currentCategoryId = currentSkill.skillCategoryId;

        // Check if the new name exists in the same category but for a different skill ID
        const existingSkillWithSameName = await prisma.skill.findUnique({
            where: {
                skillCategoryId_name_unique: {
                    skillCategoryId: currentCategoryId,
                    name: name,
                }
            },
        });

        if (existingSkillWithSameName && existingSkillWithSameName.id !== skillId) {
            return NextResponse.json({ error: `Another skill named '${name}' already exists in this category.` }, { status: 409 });
        }

        const updatedSkill = await prisma.skill.update({
            where: { id: skillId },
            data: {
                name,
                order,
                // Not allowing category change via this endpoint for simplicity
            },
        });

        return NextResponse.json(updatedSkill);
    } catch (error) {
        console.error(`--- Skill PUT Error (ID: ${skillId}) ---`, error);
        if (error instanceof Error && 'code' in error) {
            if (error.code === 'P2025') { // Record not found
                return NextResponse.json({ error: "Skill not found" }, { status: 404 });
            }
            if (error.code === 'P2002') { // Unique constraint violation
                return NextResponse.json({ error: "This skill name already exists in this category." }, { status: 409 });
            }
        }
        return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
    }
}

// DELETE /api/skills/[id] - Delete a specific skill (Admin only)
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

    const skillId = params.id;
    if (!skillId) {
        return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    try {
        await prisma.skill.delete({
            where: { id: skillId },
        });

        return NextResponse.json({ message: "Skill deleted successfully" }, { status: 200 });
        // Or: return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error(`--- Skill DELETE Error (ID: ${skillId}) ---`, error);
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ error: "Skill not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
    }
} 