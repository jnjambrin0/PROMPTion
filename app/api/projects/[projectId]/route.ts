import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/lib/prisma'; // Actual Prisma client

// Using the same mock DB from the other project route for consistency in this mock setup
// In a real app, this would all go through the actual Prisma client.
let mockProjectsDB: any[] = [
  { id: 'project1', name: 'Default Project', userId: 'mockUserId1', createdAt: new Date(), updatedAt: new Date() },
  { id: 'project2', name: 'Another Cool Project', userId: 'mockUserId1', createdAt: new Date(), updatedAt: new Date() },
];

// Mock for associated prompts (to simulate disassociation)
let mockPromptsDB: any[] = [
    { id: 'prompt1', title: 'Prompt for Project 1', projectId: 'project1', userId: 'mockUserId1' },
    { id: 'prompt2', title: 'Prompt for Project 2', projectId: 'project2', userId: 'mockUserId1' },
    { id: 'prompt3', title: 'General Prompt', projectId: null, userId: 'mockUserId1' },
];


const mockPrismaProject = {
  findUnique: async (query: any) => {
    console.log("[MOCK PRISMA] Finding unique project:", query.where);
    return mockProjectsDB.find(p => p.id === query.where.id && p.userId === query.where.userId) || null;
  },
  update: async (query: any) => {
    console.log("[MOCK PRISMA] Updating project:", query.where, "with data:", query.data);
    const projectIndex = mockProjectsDB.findIndex(p => p.id === query.where.id && p.userId === query.where.userId);
    if (projectIndex > -1) {
      mockProjectsDB[projectIndex] = { ...mockProjectsDB[projectIndex], ...query.data, updatedAt: new Date() };
      return mockProjectsDB[projectIndex];
    }
    return null;
  },
  delete: async (query: any) => {
    console.log("[MOCK PRISMA] Deleting project:", query.where);
    const projectIndex = mockProjectsDB.findIndex(p => p.id === query.where.id && p.userId === query.where.userId);
    if (projectIndex > -1) {
      const deletedProject = mockProjectsDB.splice(projectIndex, 1)[0];
      // Mock disassociation of prompts
      mockPromptsDB.forEach(prompt => {
        if (prompt.projectId === deletedProject.id) {
          prompt.projectId = null; // Disassociate
          console.log(`[MOCK PRISMA] Disassociated prompt ${prompt.id} from deleted project ${deletedProject.id}`);
        }
      });
      return deletedProject;
    }
    return null;
  },
};

interface RouteParams {
  params: {
    projectId: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const { projectId } = params;

  try {
    const project = await mockPrismaProject.findUnique({
    // const project = await prisma.project.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found or access denied' }, { status: 404 });
    }
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    return NextResponse.json({ message: `Error fetching project ${projectId}` }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const { projectId } = params;

  try {
    const body = await request.json();
    const { name } = body;

    if (name === undefined || typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
      return NextResponse.json({ message: 'Project name must be a non-empty string up to 100 characters.' }, { status: 400 });
    }

    const updatedProject = await mockPrismaProject.update({
    // const updatedProject = await prisma.project.update({
      where: { id: projectId, userId },
      data: { name: name.trim() }, // Save trimmed name
    });

    if (!updatedProject) {
      return NextResponse.json({ message: 'Project not found or update failed' }, { status: 404 });
    }
    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error(`Error updating project ${projectId}:`, error);
    return NextResponse.json({ message: `Error updating project ${projectId}` }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const { projectId } = params;

  try {
    const deletedProject = await mockPrismaProject.delete({
    // const deletedProject = await prisma.project.delete({
      // where: { id: projectId, userId }, // In real Prisma, ensure user owns it or handle separately
      // For mock, the mockPrismaProject.delete function handles the userId check
      where: { id: projectId, userId },
    });

    if (!deletedProject) {
      return NextResponse.json({ message: 'Project not found or delete failed' }, { status: 404 });
    }
    // Note: Real Prisma would require handling related prompts (e.g., cascade delete or disassociate).
    // Our mockPrismaProject.delete simulates disassociation.
    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting project ${projectId}:`, error);
    return NextResponse.json({ message: `Error deleting project ${projectId}` }, { status: 500 });
  }
}
