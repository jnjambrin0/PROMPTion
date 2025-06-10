import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/lib/prisma';

// Mock data store for prompts - this would not exist with a real DB
let mockPromptsStore: any[] = [
    { id: 'prompt1', title: 'Alpha query test', content: 'Detailed content about alpha particles and queries.', userId: 'mockUserId1', projectId: null, tags: ["physics", "alpha"], createdAt: new Date(2023, 10, 1), updatedAt: new Date(2023, 10, 5), aiOptIn: false },
    { id: 'prompt2', title: 'Beta test guidelines', content: 'Comprehensive guidelines for beta testing, includes query examples.', userId: 'mockUserId1', projectId: 'mockProjectId1', tags: ['software', 'test'], createdAt: new Date(2023, 11, 1), updatedAt: new Date(2023, 11, 10), aiOptIn: true },
    { id: 'prompt3', title: 'Gamma ray research', content: 'Research paper on gamma ray bursts and specific query parameters.', userId: 'mockUserId1', projectId: 'mockProjectId1', tags: ['science', 'gamma'], createdAt: new Date(2024, 0, 15), updatedAt: new Date(2024, 0, 20), aiOptIn: false },
    { id: 'prompt4', title: 'Delta project planning', content: 'Planning document for the Delta project, no specific query.', userId: 'mockUserId1', projectId: 'mockProjectId2', tags: ["planning", "delta"], createdAt: new Date(2024, 1, 1), updatedAt: new Date(2024, 1, 5), aiOptIn: false },
    { id: 'prompt5', title: 'General Inquiry', content: 'A general inquiry about services and different query types.', userId: 'mockUserId1', projectId: null, tags: ["general"], createdAt: new Date(2024, 1, 10), updatedAt: new Date(2024, 1, 12), aiOptIn: true },
];


const mockPrisma = {
  prompt: {
    create: async (data: any) => {
      console.log("[MOCK PRISMA] Creating prompt:", data.data);
      const newPrompt = {
        id: String(Math.random().toString(36).substr(2, 9)),
        ...data.data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockPromptsStore.push(newPrompt);
      return newPrompt;
    },
    findMany: async (query: any) => {
      console.log("[MOCK PRISMA] Finding many prompts with query:", query.where);
      const { userId, projectId, searchQuery } = query.where;

      let results = mockPromptsStore.filter(p => p.userId === userId);

      if (projectId !== undefined) { // projectId can be null, so check for undefined
        results = results.filter(p => p.projectId === projectId);
      }

      if (searchQuery) {
        const sq = searchQuery.toLowerCase();
        results = results.filter(p =>
          p.title.toLowerCase().includes(sq) ||
          p.content.toLowerCase().includes(sq) // Search needs to check content
        );
      }

      // Simulate `select` for list view: omit `content` and other detailed fields not needed.
      // The list view generally uses: id, title, tags, projectId, updatedAt.
      // It does NOT need full content, createdAt, aiOptIn, or userId (already filtered by it).
      return results.map(p => ({
        id: p.id,
        title: p.title,
        tags: p.tags,
        projectId: p.projectId,
        // If project name is needed, it implies an include or a join in real Prisma.
        // For mock, we'd have to fetch from mockProjectsDB or assume it's passed.
        // The UI currently re-fetches project names if needed or uses ID.
        updatedAt: p.updatedAt,
        // OMITTING: content, createdAt, aiOptIn, userId from the list view payload
      }));
    },
  }
};


export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const body = await request.json();
    const { title, content, tags, projectId, aiOptIn } = body;

    // Input Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0 || title.length > 255) {
      return NextResponse.json({ message: 'Title is required and must be a string up to 255 characters.' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ message: 'Content is required and must be a non-empty string.' }, { status: 400 });
    }
    if (tags && !Array.isArray(tags)) {
      return NextResponse.json({ message: 'Tags must be an array of strings.' }, { status: 400 });
    }
    if (tags && tags.some(tag => typeof tag !== 'string' || tag.trim().length === 0 || tag.length > 50)) {
      return NextResponse.json({ message: 'Each tag must be a non-empty string up to 50 characters.' }, { status: 400 });
    }
    // Basic CUID check (length 25, starts with 'c') - adjust if using UUIDs
    if (projectId && (typeof projectId !== 'string' || !/^[a-zA-Z0-9]{25}$/.test(projectId) || !projectId.startsWith('c'))) {
        // This CUID check is very basic. A library or more robust regex might be better.
        // For UUID: !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(projectId)
      return NextResponse.json({ message: 'Invalid Project ID format.' }, { status: 400 });
    }
    if (aiOptIn !== undefined && typeof aiOptIn !== 'boolean') {
      return NextResponse.json({ message: 'aiOptIn must be a boolean value.' }, { status: 400 });
    }

    // TODO: Replace mockPrisma with actual prisma.prompt.create once DB is live
    const newPrompt = await mockPrisma.prompt.create({
      data: {
        title,
        content,
        tags: tags || [],
        aiOptIn: typeof aiOptIn === 'boolean' ? aiOptIn : false,
        userId,
        ...(projectId && projectId !== "none" && { projectId }), // Handle "none" value from select
      },
    });

    return NextResponse.json(newPrompt, { status: 201 });
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json({ message: 'Error creating prompt' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { searchParams } = new URL(request.url);
  let projectIdQuery = searchParams.get('projectId');
  const searchQuery = searchParams.get('searchQuery');

  const whereClause: any = { userId };

  if (projectIdQuery) {
    if (projectIdQuery === "null" || projectIdQuery === "none") {
      whereClause.projectId = null;
    } else {
      whereClause.projectId = projectIdQuery;
    }
  }

  if (searchQuery) {
    // In real Prisma, OR filter would be part of the main where:
    // whereClause.OR = [
    //   { title: { contains: searchQuery, mode: 'insensitive' } },
    //   { content: { contains: searchQuery, mode: 'insensitive' } },
    // ];
    // For mock, passing it to be handled by mockPrisma.findMany
    whereClause.searchQuery = searchQuery;
  }

  try {
    // TODO: Replace mockPrisma with actual prisma.prompt.findMany once DB is live
    const prompts = await mockPrisma.prompt.findMany({
      where: whereClause,
      orderBy: { // This orderBy is just illustrative for mock; real Prisma handles it.
        updatedAt: 'desc',
      },
      // In real Prisma, you'd use select here:
      // select: { id: true, title: true, tags: true, projectId: true, updatedAt: true }
    });

    return NextResponse.json(prompts, { status: 200 });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json({ message: 'Error fetching prompts' }, { status: 500 });
  }
}
