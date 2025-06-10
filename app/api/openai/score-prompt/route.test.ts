import { POST } from './route'; // Adjust path
import { getServerSession } from 'next-auth/next';
import OpenAI from 'openai';
import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';
import { OPENAI_API_KEY } from '@/lib/config'; // To check if it's mocked/handled

// Mock NextAuth
const mockGetServerSession = getServerSession as jest.Mock;

// Mock OpenAI
jest.mock('openai');
const mockOpenAIInstance = OpenAI as jest.MockedClass<typeof OpenAI>;
const mockChatCompletionsCreate = jest.fn();

// Hold the original OPENAI_API_KEY value
const originalApiKey = OPENAI_API_KEY;

describe('/api/openai/score-prompt API Endpoint', () => {
  beforeEach(() => {
    // Reset mocks for each test
    mockGetServerSession.mockClear();
    mockChatCompletionsCreate.mockClear();

    // Setup the mock implementation for OpenAI client
    mockOpenAIInstance.mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: mockChatCompletionsCreate,
          },
        },
      } as any; // Cast to any to satisfy constructor mock
    });

    // Ensure OPENAI_API_KEY is treated as set for these tests,
    // unless a specific test wants to test the "key not set" scenario.
    // This requires a bit of a workaround if the module was already loaded.
    // For robust test, better to mock '@/lib/config'
    jest.mock('@/lib/config', () => ({
        OPENAI_API_KEY: 'test-api-key-is-set', // Ensure it's treated as set
    }));
  });

  afterAll(() => {
    // Restore original modules if necessary, or ensure mocks are cleared
    jest.unmock('@/lib/config'); // Restore original config
  });


  it('should score a prompt successfully with valid data and authentication', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
    const mockResponseJson = { score: 8, feedback: "Good prompt." };
    mockChatCompletionsCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockResponseJson) } }],
    });

    const { req } = createMocks({
      method: 'POST',
      json: () => ({ promptContent: 'This is a test prompt.' }),
    });
    const response = await POST(req as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.score).toBe(8);
    expect(data.feedback).toBe("Good prompt.");
    expect(mockChatCompletionsCreate).toHaveBeenCalledTimes(1);
  });

  it('should return 400 for missing promptContent', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
    const { req } = createMocks({ method: 'POST', json: () => ({}) });
    const response = await POST(req as unknown as NextRequest);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.message).toContain('promptContent is required');
  });

  it('should return 400 for overly long promptContent', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
    const longContent = 'a'.repeat(10001);
    const { req } = createMocks({ method: 'POST', json: () => ({ promptContent: longContent}) });
    const response = await POST(req as unknown as NextRequest);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ message: 'promptContent exceeds maximum length of 10000 characters.' });
  });

  it('should return 401 if unauthenticated', async () => {
    mockGetServerSession.mockResolvedValue(null);
    const { req } = createMocks({ method: 'POST', json: () => ({ promptContent: 'Test' }) });
    const response = await POST(req as unknown as NextRequest);
    expect(response.status).toBe(401);
  });

  it('should handle OpenAI API error gracefully', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
    mockChatCompletionsCreate.mockRejectedValue(new Error('OpenAI API failed'));

    const { req } = createMocks({
      method: 'POST',
      json: () => ({ promptContent: 'Test prompt for API error' }),
    });
    const response = await POST(req as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain('OpenAI API error: OpenAI API failed');
  });

  it('should handle non-JSON response from OpenAI', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
    mockChatCompletionsCreate.mockResolvedValue({
      choices: [{ message: { content: "This is not JSON" } }],
    });

    const { req } = createMocks({ method: 'POST', json: () => ({ promptContent: 'Test' }) });
    const response = await POST(req as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to parse AI response.");
    expect(data.feedback).toContain("Could not parse AI feedback");
  });

  // Test for when OPENAI_API_KEY is not set (mock response)
  it('should use mock scoring if OPENAI_API_KEY is not set', async () => {
    jest.resetModules(); // Reset modules to re-evaluate imports
    jest.mock('@/lib/config', () => ({
        OPENAI_API_KEY: undefined, // Simulate API key not being set
    }));
    const { POST: POST_NO_KEY } = await import('./route'); // Re-import with new mock

    mockGetServerSession.mockResolvedValue({ user: { id: 'testUserId' } });
    const { req } = createMocks({ method: 'POST', json: () => ({ promptContent: 'Test' }) });
    const response = await POST_NO_KEY(req as unknown as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(200); // Mock returns 200
    expect(data.score).toBeGreaterThanOrEqual(7);
    expect(data.score).toBeLessThanOrEqual(9);
    expect(data.feedback).toContain("mock feedback");

    // Restore mock for other tests
     jest.mock('@/lib/config', () => ({
        OPENAI_API_KEY: 'test-api-key-is-set',
    }));
    await import('./route'); // Re-import to reset with key for subsequent tests
  });
});
