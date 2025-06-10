import { POST, GET } from './route'; // Adjust the path as necessary
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { createMocks, RequestMethod } from 'node-mocks-http'; // For mocking Request/Response
import { NextRequest } from 'next/server';

// Type assertion for mocked functions
const mockGetServerSession = getServerSession as jest.Mock;
const mockPrismaPrompt = prisma.prompt as {
  create: jest.Mock;
  findMany: jest.Mock;
};

describe('/api/prompts API Endpoint', () => {
  describe('POST /api/prompts', () => {
    it('should create a prompt successfully with valid data and authentication', async () => {
      const mockSession = { user: { id: 'testUserId' } };
      mockGetServerSession.mockResolvedValue(mockSession);
      const mockCreatedPrompt = { id: 'newPromptId', title: 'Test Prompt', content: 'Test content', userId: 'testUserId' };
      mockPrismaPrompt.create.mockResolvedValue(mockCreatedPrompt);

      const { req } = createMocks({
        method: 'POST',
        json: () => ({ title: 'Test Prompt', content: 'Test content', tags: ['test'], aiOptIn: false }),
      });
      // Cast to NextRequest
      const nextRequest = req as unknown as NextRequest;

      const response = await POST(nextRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockCreatedPrompt);
      expect(mockPrismaPrompt.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Prompt',
          content: 'Test content',
          tags: ['test'],
          aiOptIn: false,
          userId: 'testUserId',
        },
      });
    });

    it('should return 400 for missing title', async () => {
      const mockSession = { user: { id: 'testUserId' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      const { req } = createMocks({
        method: 'POST',
        json: () => ({ content: 'Test content' }), // Missing title
      });
      const nextRequest = req as unknown as NextRequest;

      const response = await POST(nextRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toContain('Title is required');
    });

    it('should return 400 for invalid tags format', async () => {
        mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
        const { req } = createMocks({
            method: 'POST',
            json: () => ({ title: 'Valid Title', content: 'Valid Content', tags: "not-an-array" }),
        });
        const response = await POST(req as unknown as NextRequest);
        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ message: 'Tags must be an array of strings.' });
    });


    it('should return 401 for unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const { req } = createMocks({
        method: 'POST',
        json: () => ({ title: 'Test Prompt', content: 'Test content' }),
      });
      const nextRequest = req as unknown as NextRequest;

      const response = await POST(nextRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Unauthorized');
    });
  });

  describe('GET /api/prompts', () => {
    it('should fetch prompts for an authenticated user', async () => {
      const mockSession = { user: { id: 'testUserId' } };
      mockGetServerSession.mockResolvedValue(mockSession);
      const mockPrompts = [{ id: 'p1', title: 'Prompt 1' }, { id: 'p2', title: 'Prompt 2' }];
      mockPrismaPrompt.findMany.mockResolvedValue(mockPrompts);

      const { req } = createMocks({
        method: 'GET',
        url: '/api/prompts', // url is needed for searchParams
      });
      const nextRequest = req as unknown as NextRequest;

      const response = await GET(nextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPrompts);
      expect(mockPrismaPrompt.findMany).toHaveBeenCalledWith({
        where: { userId: 'testUserId' },
        orderBy: { updatedAt: 'desc' },
      });
    });

    it('should filter prompts by projectId', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
      mockPrismaPrompt.findMany.mockResolvedValue([{ id: 'p1', title: 'Project Prompt' }]);

      const { req } = createMocks({
        method: 'GET',
        url: '/api/prompts?projectId=proj123',
      });
       const nextRequest = req as unknown as NextRequest;

      await GET(nextRequest);
      expect(mockPrismaPrompt.findMany).toHaveBeenCalledWith({
        where: { userId: 'testUserId', projectId: 'proj123' },
        orderBy: { updatedAt: 'desc' },
      });
    });

    it('should filter prompts by searchQuery', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
      mockPrismaPrompt.findMany.mockResolvedValue([{ id: 'p1', title: 'Search Result' }]);

      const { req } = createMocks({
        method: 'GET',
        url: '/api/prompts?searchQuery=test',
      });
      const nextRequest = req as unknown as NextRequest;

      await GET(nextRequest);
      expect(mockPrismaPrompt.findMany).toHaveBeenCalledWith({
        where: { userId: 'testUserId', searchQuery: 'test' }, // Mock API passes searchQuery this way
        orderBy: { updatedAt: 'desc' },
      });
    });

    it('should return 401 if unauthenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      const { req } = createMocks({ method: 'GET', url: '/api/prompts' });
      const nextRequest = req as unknown as NextRequest;
      const response = await GET(nextRequest);
      expect(response.status).toBe(401);
    });
  });
});
