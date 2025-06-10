import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/lib/prisma'; // Actual Prisma client

// Mock data store for projects
let mockProjectsDB: any[] = [
  { id: 'project1', name: 'Default Project', userId: 'mockUserId1', createdAt: new Date(), updatedAt: new Date() },
  { id: 'project2', name: 'Another Cool Project', userId: 'mockUserId1', createdAt: new Date(), updatedAt: new Date() },
];

// Mock implementation for Prisma operations for Projects
const mockPrismaProject = {
  create: async (data: any) => {
    console.log("[MOCK PRISMA] Creating project:", data.data);
    const newProject = {
      id: String(Math.random().toString(36).substr(2, 9)),
      ...data.data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockProjectsDB.push(newProject);
    return newProject;
  },
  findMany: async (query: any) => {
    console.log("[MOCK PRISMA] Finding many projects with query:", query);
    return mockProjectsDB.filter(p => p.userId === query.where.userId);
  },
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
      return NextResponse.json({ message: 'Project name is required and must be a string up to 100 characters.' }, { status: 400 });
    }

    // TODO: Replace mockPrismaProject with actual prisma.project client once DB is live
    const newProject = await mockPrismaProject.create({
    // const newProject = await prisma.project.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ message: 'Error creating project' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    // TODO: Replace mockPrismaProject with actual prisma.project client once DB is live
    const projects = await mockPrismaProject.findMany({
    // const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Error fetching projects' }, { status: 500 });
  }
}
