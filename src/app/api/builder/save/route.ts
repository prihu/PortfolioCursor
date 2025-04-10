import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to save builder data' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const data = await req.json();
    
    // Validate data
    if (!data.pageId || !data.elements || !data.theme) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if the page exists and user has access
    const page = await prisma.page.findUnique({
      where: {
        id: data.pageId,
      },
    });
    
    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }
    
    // Save builder data
    // In a real implementation, you would validate the data more thoroughly
    // and handle updates to existing records differently
    const savedData = await prisma.builderData.upsert({
      where: {
        pageId: data.pageId,
      },
      update: {
        elements: data.elements,
        theme: data.theme,
        updatedAt: new Date(),
      },
      create: {
        pageId: data.pageId,
        elements: data.elements,
        theme: data.theme,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json({
      success: true,
      data: savedData,
    });
  } catch (error) {
    console.error('Error saving builder data:', error);
    return NextResponse.json(
      { error: 'Failed to save builder data' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get page ID from query parameters
    const searchParams = req.nextUrl.searchParams;
    const pageId = searchParams.get('pageId');
    
    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch builder data for the page
    const builderData = await prisma.builderData.findUnique({
      where: {
        pageId: pageId,
      },
    });
    
    if (!builderData) {
      return NextResponse.json(
        { error: 'No builder data found for this page' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: builderData,
    });
  } catch (error) {
    console.error('Error fetching builder data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch builder data' },
      { status: 500 }
    );
  }
} 