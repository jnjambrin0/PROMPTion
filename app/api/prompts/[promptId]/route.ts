import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path as needed
import prisma from '@/lib/prisma'; // Adjust path as needed

// Mock implementation for Prisma operations until DB is live
const mockPrisma = {
  prompt: {
    findUnique: async (query: any) => {
      console.log("[MOCK PRISMA] Finding unique prompt with query:", query);
      if (query.where.id === 'prompt1' && query.where.userId === 'mockUserId1') {
        return { id: 'prompt1', title: 'Mock Prompt 1', content: 'Content 1', userId: 'mockUserId1', tags: [], createdAt: new Date(), updatedAt: new Date() };
      }
      return null;
    },
    update: async (query: any) => {
      console.log("[MOCK PRISMA] Updating prompt with query:", query);
      if (query.where.id === 'prompt1' && query.where.userId === 'mockUserId1') {
        return { ...query.data, id: 'prompt1', userId: 'mockUserId1', createdAt: new Date(), updatedAt: new Date() };
      }
      // Simulate not found or not authorized by returning null or throwing an error
      return null;
    },
    delete: async (query: any) => {
      console.log("[MOCK PRISMA] Deleting prompt with query:", query);
       if (query.where.id === 'prompt1' && query.where.userId === 'mockUserId1') {
        return { id: 'prompt1', title: 'Deleted Mock Prompt', content: 'Deleted Content', userId: 'mockUserId1' };
      }
      return null;
    },
  }
};

interface RouteParams {
  params: {
    promptId: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const { promptId } = params;

  try {
    // TODO: Replace mockPrisma with actual prisma client once DB is live
    const prompt = await mockPrisma.prompt.findUnique({
    // const prompt = await prisma.prompt.findUnique({
      where: { id: promptId, userId }, // Ensure user owns the prompt
    });

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt not found or access denied' }, { status: 404 });
    }
    return NextResponse.json(prompt, { status: 200 });
  } catch (error) {
    console.error(`Error fetching prompt ${promptId}:`, error);
    return NextResponse.json({ message: `Error fetching prompt ${promptId}` }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const { promptId } = params;

  try {
    const body = await request.json();
    const { title, content, tags, projectId, aiOptIn } = body;

    // Input Validation for PUT (all fields are optional, but if provided, must be valid)
    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0 || title.length > 255)) {
      return NextResponse.json({ message: 'If provided, title must be a non-empty string up to 255 characters.' }, { status: 400 });
    }
    if (content !== undefined && (typeof content !== 'string' || content.trim().length === 0)) {
      return NextResponse.json({ message: 'If provided, content must be a non-empty string.' }, { status: 400 });
    }
    if (tags !== undefined) {
      if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string' || tag.trim().length === 0 || tag.length > 50)) {
        return NextResponse.json({ message: 'If provided, tags must be an array of non-empty strings, each up to 50 characters.' }, { status: 400 });
      }
    }
    // Allow projectId to be explicitly set to null to disassociate
    if (projectId !== undefined && projectId !== null &&
        (typeof projectId !== 'string' || !/^[a-zA-Z0-9]{25}$/.test(projectId) || !projectId.startsWith('c'))) {
      // This CUID check is very basic. A library or more robust regex might be better.
      return NextResponse.json({ message: 'If provided, Project ID must be a valid format or null.' }, { status: 400 });
    }
    if (aiOptIn !== undefined && typeof aiOptIn !== 'boolean') {
      return NextResponse.json({ message: 'If provided, aiOptIn must be a boolean value.' }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title.trim();
    if (content !== undefined) dataToUpdate.content = content; // Keep content as is, don't trim if it's just spaces intentionally
    if (tags !== undefined) dataToUpdate.tags = tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
    if (projectId !== undefined) dataToUpdate.projectId = projectId; // This allows setting to null
    if (aiOptIn !== undefined) dataToUpdate.aiOptIn = aiOptIn;

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ message: 'No valid fields provided for update.' }, { status: 400 });
    }

    // First, verify the prompt exists and belongs to the user (or do it via Prisma updateMany with compound where)
    // For simplicity with mock, we assume update will handle this or do a findFirst check
    // In real Prisma, update with where: { id: promptId, userId: userId } is better.

    // TODO: Replace mockPrisma with actual prisma client once DB is live
    const updatedPrompt = await mockPrisma.prompt.update({
    // const updatedPrompt = await prisma.prompt.update({
      where: { id: promptId, userId }, // This ensures user owns the prompt
      data: dataToUpdate,
    });

    if (!updatedPrompt) {
         return NextResponse.json({ message: 'Prompt not found or update failed' }, { status: 404 });
    }

    return NextResponse.json(updatedPrompt, { status: 200 });
  } catch (error) {
    console.error(`Error updating prompt ${promptId}:`, error);
    // Check for specific Prisma errors if needed, e.g., P2025 (Record not found)
    return NextResponse.json({ message: `Error updating prompt ${promptId}` }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const { promptId } = params;

  try {
    // TODO: Replace mockPrisma with actual prisma client once DB is live
    // In Prisma, delete operations throw an error (P2025) if the record is not found.
    // We also need to ensure the user owns the prompt before deleting.
    // A common pattern is to check ownership first or use a compound where clause if supported by delete.
    // For this mock, we simulate this check within the mock delete.

    // const existingPrompt = await prisma.prompt.findUnique({ where: { id: promptId } });
    // if (!existingPrompt || existingPrompt.userId !== userId) {
    //   return NextResponse.json({ message: 'Prompt not found or access denied' }, { status: 404 });
    // }
    // await prisma.prompt.delete({ where: { id: promptId } });

    const deletedPrompt = await mockPrisma.prompt.delete({
      where: { id: promptId, userId }, // Ensure user owns the prompt
    });

    if (!deletedPrompt) {
      return NextResponse.json({ message: 'Prompt not found or delete failed' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Prompt deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting prompt ${promptId}:`, error);
    // Check for specific Prisma errors, e.g., P2025 (Record not found)
    return NextResponse.json({ message: `Error deleting prompt ${promptId}` }, { status: 500 });
  }
}
