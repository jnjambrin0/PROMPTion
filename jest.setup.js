// jest.setup.js

// Mock NextAuth.js getServerSession
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

// Mock Prisma Client
jest.mock('@/lib/prisma', () => {
  // Initial default mocks for each model and method used in API routes
  // You can override these in individual tests using mockImplementation
  const mockPrismaClient = {
    prompt: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    project: { // Added project mocks as well for completeness, though not strictly part of this subtask
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    // Add other models here if your application uses them
  };
  return {
    __esModule: true, // This is important for ES modules
    default: mockPrismaClient,
  };
});

// Optional: Clear mocks before each test
beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  const { getServerSession } = require('next-auth/next');
  getServerSession.mockClear();

  const prisma = require('@/lib/prisma').default;
  Object.values(prisma).forEach((model) => {
    if (typeof model === 'object' && model !== null) {
      Object.values(model).forEach((method) => {
        if (typeof method === 'function' && method.mockClear) {
          method.mockClear();
        }
      });
    }
  });
});
