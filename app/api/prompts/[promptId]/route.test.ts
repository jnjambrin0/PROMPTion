import { GET, PUT, DELETE } from './route'; // Adjust path as necessary
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';

const mockGetServerSession = getServerSession as jest.Mock;
const mockPrismaPrompt = prisma.prompt as {
  findUnique: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

const mockUser = { user: { id: 'testUserId' } };
const otherUser = { user: { id: 'otherUserId' } };

describe('/api/prompts/[promptId] API Endpoint', () => {
  const promptId = 'testPromptId';

  describe('GET /api/prompts/[promptId]', () => {
    it('should fetch a specific prompt if user is owner', async () => {
      mockGetServerSession.mockResolvedValue(mockUser);
      const mockPrompt = { id: promptId, title: 'Test Prompt', userId: 'testUserId' };
      mockPrismaPrompt.findUnique.mockResolvedValue(mockPrompt);

      const { req } = createMocks({ method: 'GET' });
      const response = await GET(req as unknown as NextRequest, { params: { promptId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPrompt);
      expect(mockPrismaPrompt.findUnique).toHaveBeenCalledWith({
        where: { id: promptId, userId: 'testUserId' },
      });
    });

    it('should return 404 if prompt not found or not owned by user', async () => {
      mockGetServerSession.mockResolvedValue(mockUser);
      mockPrismaPrompt.findUnique.mockResolvedValue(null); // Simulate not found or not owned

      const { req } = createMocks({ method: 'GET' });
      const response = await GET(req as unknown as NextRequest, { params: { promptId: 'nonExistentId' } });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ message: 'Prompt not found or access denied' });
    });

    it('should return 401 if unauthenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      const { req } = createMocks({ method: 'GET' });
      const response = await GET(req as unknown as NextRequest, { params: { promptId } });
      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/prompts/[promptId]', () => {
    const updateData = { title: 'Updated Title', content: 'Updated Content' };

    it('should update a prompt successfully if user is owner', async () => {
      mockGetServerSession.mockResolvedValue(mockUser);
      const mockUpdatedPrompt = { id: promptId, ...updateData, userId: 'testUserId' };
      // Simulate that the update operation (which includes a where clause for ownership) is successful
      mockPrismaPrompt.update.mockResolvedValue(mockUpdatedPrompt);

      const { req } = createMocks({ method: 'PUT', json: () => updateData });
      const response = await PUT(req as unknown as NextRequest, { params: { promptId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockUpdatedPrompt);
      expect(mockPrismaPrompt.update).toHaveBeenCalledWith({
        where: { id: promptId, userId: 'testUserId' },
        data: updateData,
      });
    });

    it('should return 404 if prompt to update is not found or not owned', async () => {
      mockGetServerSession.mockResolvedValue(mockUser);
      mockPrismaPrompt.update.mockResolvedValue(null); // Simulate update on non-owned/non-existent returns null

      const { req } = createMocks({ method: 'PUT', json: () => updateData });
      const response = await PUT(req as unknown as NextRequest, { params: { promptId: 'nonExistentOrNotOwnedId' } });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ message: 'Prompt not found or update failed' });
    });

    it('should return 400 for invalid update data (e.g. empty title)', async () => {
        mockGetServerSession.mockResolvedValue(mockUser);
        const { req } = createMocks({ method: 'PUT', json: () => ({ title: "" }) }); // Empty title
        const response = await PUT(req as unknown as NextRequest, { params: { promptId } });
        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ message: 'If provided, title must be a non-empty string up to 255 characters.' });
    });


    it('should return 401 if unauthenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      const { req } = createMocks({ method: 'PUT', json: () => updateData });
      const response = await PUT(req as unknown as NextRequest, { params: { promptId } });
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/prompts/[promptId]', () => {
    it('should delete a prompt successfully if user is owner', async () => {
      mockGetServerSession.mockResolvedValue(mockUser);
      // Simulate successful delete (mockPrisma.delete would return the deleted object or true)
      mockPrismaPrompt.delete.mockResolvedValue({ id: promptId, userId: 'testUserId' });

      const { req } = createMocks({ method: 'DELETE' });
      const response = await DELETE(req as unknown as NextRequest, { params: { promptId } });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ message: 'Prompt deleted successfully' });
      expect(mockPrismaPrompt.delete).toHaveBeenCalledWith({
        where: { id: promptId, userId: 'testUserId' },
      });
    });

    it('should return 404 if prompt to delete is not found or not owned', async () => {
      mockGetServerSession.mockResolvedValue(mockUser);
      mockPrismaPrompt.delete.mockResolvedValue(null); // Simulate delete on non-owned/non-existent

      const { req } = createMocks({ method: 'DELETE' });
      const response = await DELETE(req as unknown as NextRequest, { params: { promptId: 'nonExistentOrNotOwnedId' } });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ message: 'Prompt not found or delete failed' });
    });

    it('should return 401 if unauthenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      const { req } = createMocks({ method: 'DELETE' });
      const response = await DELETE(req as unknown as NextRequest, { params: { promptId } });
      expect(response.status).toBe(401);
    });
  });
});
