import { POST, GET } from './route'; // Adjust path as necessary
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';

// Type assertion for mocked functions
const mockGetServerSession = getServerSession as jest.Mock;
const mockPrismaProject = prisma.project as {
  create: jest.Mock;
  findMany: jest.Mock;
};

describe('/api/projects API Endpoint', () => {
  describe('POST /api/projects', () => {
    it('should create a project successfully with valid data and authentication', async () => {
      const mockSession = { user: { id: 'testUserId' } };
      mockGetServerSession.mockResolvedValue(mockSession);
      const mockCreatedProject = { id: 'newProjectId', name: 'Test Project', userId: 'testUserId' };
      mockPrismaProject.create.mockResolvedValue(mockCreatedProject);

      const { req } = createMocks({
        method: 'POST',
        json: () => ({ name: 'Test Project' }),
      });
      const nextRequest = req as unknown as NextRequest;

      const response = await POST(nextRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockCreatedProject);
      expect(mockPrismaProject.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Project',
          userId: 'testUserId',
        },
      });
    });

    it('should return 400 for missing project name', async () => {
      const mockSession = { user: { id: 'testUserId' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      const { req } = createMocks({
        method: 'POST',
        json: () => ({}), // Missing name
      });
      const nextRequest = req as unknown as NextRequest;

      const response = await POST(nextRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toContain('Project name is required');
    });

    it('should return 400 for project name too long', async () => {
        mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
        const longName = 'a'.repeat(101);
        const { req } = createMocks({
            method: 'POST',
            json: () => ({ name: longName }),
        });
        const response = await POST(req as unknown as NextRequest);
        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ message: 'Project name is required and must be a string up to 100 characters.' });
    });

    it('should return 401 for unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const { req } = createMocks({
        method: 'POST',
        json: () => ({ name: 'Test Project' }),
      });
      const nextRequest = req as unknown as NextRequest;

      const response = await POST(nextRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Unauthorized');
    });
  });

  describe('GET /api/projects', () => {
    it('should fetch projects for an authenticated user', async () => {
      const mockSession = { user: { id: 'testUserId' } };
      mockGetServerSession.mockResolvedValue(mockSession);
      const mockProjects = [{ id: 'p1', name: 'Project 1' }, { id: 'p2', name: 'Project 2' }];
      mockPrismaProject.findMany.mockResolvedValue(mockProjects);

      const { req } = createMocks({
        method: 'GET',
        url: '/api/projects',
      });
      const nextRequest = req as unknown as NextRequest;

      const response = await GET(nextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockProjects);
      expect(mockPrismaProject.findMany).toHaveBeenCalledWith({
        where: { userId: 'testUserId' },
        orderBy: { updatedAt: 'desc' },
      });
    });

    it('should return 401 if unauthenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      const { req } = createMocks({ method: 'GET', url: '/api/projects' });
      const nextRequest = req as unknown as NextRequest;
      const response = await GET(nextRequest);
      expect(response.status).toBe(401);
    });
  });
});
