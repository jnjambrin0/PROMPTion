import { POST } from './route'; // Adjust path
import { getServerSession } from 'next-auth/next';
import OpenAI from 'openai';
import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';

// Mock NextAuth
const mockGetServerSession = getServerSession as jest.Mock;

// Mock OpenAI
jest.mock('openai');
const mockOpenAIInstance = OpenAI as jest.MockedClass<typeof OpenAI>;
const mockChatCompletionsCreate = jest.fn();

describe('/api/openai/improve-prompt API Endpoint', () => {
  beforeEach(() => {
    mockGetServerSession.mockClear();
    mockChatCompletionsCreate.mockClear();
    mockOpenAIInstance.mockImplementation(() => {
      return {
        chat: { completions: { create: mockChatCompletionsCreate } },
      } as any;
    });
    jest.mock('@/lib/config', () => ({ OPENAI_API_KEY: 'test-api-key-is-set' }));
  });

  afterAll(() => {
    jest.unmock('@/lib/config');
  });

  it('should improve a prompt successfully with valid data and authentication', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
    const mockImprovedContent = "This is an improved test prompt.";
    mockChatCompletionsCreate.mockResolvedValue({
      choices: [{ message: { content: mockImprovedContent } }],
    });

    const { req } = createMocks({
      method: 'POST',
      json: () => ({ promptContent: 'This is a test prompt.', promptFeedback: 'Make it better.' }),
    });
    const response = await POST(req as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.improvedPrompt).toBe(mockImprovedContent);
    expect(mockChatCompletionsCreate).toHaveBeenCalledTimes(1);
  });

  it('should return 400 for missing promptContent', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
    const { req } = createMocks({ method: 'POST', json: () => ({ promptFeedback: 'Test feedback' }) });
    const response = await POST(req as unknown as NextRequest);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.message).toContain('promptContent is required');
  });

  it('should return 400 for overly long promptFeedback', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
    const longFeedback = 'a'.repeat(2001);
    const { req } = createMocks({ method: 'POST', json: () => ({ promptContent: 'Valid content', promptFeedback: longFeedback}) });
    const response = await POST(req as unknown as NextRequest);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ message: 'If provided, promptFeedback must be a string up to 2000 characters.' });
  });

  it('should return 401 if unauthenticated', async () => {
    mockGetServerSession.mockResolvedValue(null);
    const { req } = createMocks({ method: 'POST', json: () => ({ promptContent: 'Test' }) });
    const response = await POST(req as unknown as NextRequest);
    expect(response.status).toBe(401);
  });

  it('should handle OpenAI API error gracefully', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
    mockChatCompletionsCreate.mockRejectedValue(new Error('OpenAI API failed for improvement'));

    const { req } = createMocks({
      method: 'POST',
      json: () => ({ promptContent: 'Test prompt for API error' }),
    });
    const response = await POST(req as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain('OpenAI API error: OpenAI API failed for improvement');
  });

  it('should use mock improvement if OPENAI_API_KEY is not set', async () => {
    jest.resetModules();
    jest.mock('@/lib/config', () => ({ OPENAI_API_KEY: undefined }));
    const { POST: POST_NO_KEY_IMPROVE } = await import('./route');

    mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
    const { req } = createMocks({ method: 'POST', json: () => ({ promptContent: 'Test improve' }) });
    const response = await POST_NO_KEY_IMPROVE(req as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.improvedPrompt).toContain("mock improved version");

    jest.mock('@/lib/config', () => ({ OPENAI_API_KEY: 'test-api-key-is-set' }));
    await import('./route');
  });
});
