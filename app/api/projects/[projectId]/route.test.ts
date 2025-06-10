import { GET, PUT, DELETE } from './route'; // Adjust path
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';

const mockGetServerSession = getServerSession as jest.Mock;
const mockPrismaProject = prisma.project as {
  findUnique: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

const mockUser = { user: { id: 'testUserId' } };

describe('/api/projects/[projectId] API Endpoint', () => {
  const projectId = 'testProjectId';

  describe('GET /api/projects/[projectId]', () => {
    it('should fetch a specific project if user is owner', async () => {
      mockGetServerSession.mockResolvedValue(mockUser);
      const mockProject = { id: projectId, name: 'Test Project', userId: 'testUserId' };
      mockPrismaProject.findUnique.mockResolvedValue(mockProject);

      const { req } = createMocks({ method: 'GET' });
      const response = await GET(req as unknown as NextRequest, { params: { projectId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockProject);
      expect(mockPrismaProject.findUnique).toHaveBeenCalledWith({
        where: { id: projectId, userId: 'testUserId' },
      });
    });

    it('should return 404 if project not found or not owned by user', async () => {
      mockGetServerSession.mockResolvedValue(mockUser);
      mockPrismaProject.findUnique.mockResolvedValue(null);

      const { req } = createMocks({ method: 'GET' });
      const response = await GET(req as unknown as NextRequest, { params: { projectId: 'nonExistentId' } });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ message: 'Project not found or access denied' });
    });

    it('should return 401 if unauthenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      const { req } = createMocks({ method: 'GET' });
      const response = await GET(req as unknown as NextRequest, { params: { projectId } });
      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/projects/[projectId]', () => {
    const updateData = { name: 'Updated Project Name' };

    it('should update a project successfully if user is owner', async () => {
      mockGetServerSession.mockResolvedValue(mockUser);
      const mockUpdatedProject = { id: projectId, ...updateData, userId: 'testUserId' };
      mockPrismaProject.update.mockResolvedValue(mockUpdatedProject);

      const { req } = createMocks({ method: 'PUT', json: () => updateData });
      const response = await PUT(req as unknown as NextRequest, { params: { projectId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockUpdatedProject);
      expect(mockPrismaProject.update).toHaveBeenCalledWith({
        where: { id: projectId, userId: 'testUserId' },
        data: { name: updateData.name.trim() },
      });
    });

    it('should return 404 if project to update is not found or not owned', async () => {
      mockGetServerSession.mockResolvedValue(mockUser);
      mockPrismaProject.update.mockResolvedValue(null);

      const { req } = createMocks({ method: 'PUT', json: () => updateData });
      const response = await PUT(req as unknown as NextRequest, { params: { projectId: 'nonExistentOrNotOwnedId' } });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ message: 'Project not found or update failed' });
    });

    it('should return 400 for invalid update data (e.g. empty name)', async () => {
        mockGetServerSession.mockResolvedValue(mockUser);
        const { req } = createMocks({ method: 'PUT', json: () => ({ name: " " }) }); // Empty name after trim
        const response = await PUT(req as unknown as NextRequest, { params: { projectId } });
        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ message: 'Project name must be a non-empty string up to 100 characters.' });
    });

    it('should return 401 if unauthenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      const { req } = createMocks({ method: 'PUT', json: () => updateData });
      const response = await PUT(req as unknown as NextRequest, { params: { projectId } });
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/projects/[projectId]', () => {
    it('should delete a project successfully if user is owner', async () => {
      mockGetServerSession.mockResolvedValue(mockUser);
      mockPrismaProject.delete.mockResolvedValue({ id: projectId, userId: 'testUserId' });

      const { req } = createMocks({ method: 'DELETE' });
      const response = await DELETE(req as unknown as NextRequest, { params: { projectId } });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ message: 'Project deleted successfully' });
      expect(mockPrismaProject.delete).toHaveBeenCalledWith({
        where: { id: projectId, userId: 'testUserId' },
      });
    });

    it('should return 404 if project to delete is not found or not owned', async () => {
      mockGetServerSession.mockResolvedValue(mockUser);
      mockPrismaProject.delete.mockResolvedValue(null);

      const { req } = createMocks({ method: 'DELETE' });
      const response = await DELETE(req as unknown as NextRequest, { params: { projectId: 'nonExistentOrNotOwnedId' } });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ message: 'Project not found or delete failed' });
    });

    it('should return 401 if unauthenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      const { req } = createMocks({ method: 'DELETE' });
      const response = await DELETE(req as unknown as NextRequest, { params: { projectId } });
      expect(response.status).toBe(401);
    });
  });
});
