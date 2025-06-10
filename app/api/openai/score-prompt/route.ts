import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import OpenAI from 'openai';
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path as needed
import { OPENAI_API_KEY } from '@/lib/config'; // Adjust path as needed

let openai: OpenAI | null = null;
if (OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
} else {
  console.warn("OpenAI API key not provided. Prompt scoring will be mocked.");
}

// Mock scoring function if OpenAI client is not available
const mockScorePrompt = (content: string) => {
  console.log("[MOCK OpenAI] Scoring prompt:", content);
  // Simulate some delay
  return new Promise(resolve => setTimeout(() => {
    resolve({
      score: Math.floor(Math.random() * 3) + 7, // Score between 7-9
      feedback: "This is a mock feedback. The prompt seems reasonably clear and effective based on general parameters. Consider adding more specific constraints or examples for better results.",
      error: null,
    });
  }, 500));
};


export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { promptContent } = await request.json();

  if (!promptContent || typeof promptContent !== 'string' || promptContent.trim().length === 0) {
    return NextResponse.json({ message: 'promptContent is required and must be a non-empty string.' }, { status: 400 });
  }
  if (promptContent.length > 10000) { // Example max length
    return NextResponse.json({ message: 'promptContent exceeds maximum length of 10000 characters.' }, { status: 400 });
  }


  if (!openai) {
    console.log("OpenAI client not initialized, using mock scoring.");
    const mockResponse = await mockScorePrompt(promptContent);
    return NextResponse.json(mockResponse);
  }

  try {
    const systemMessage = `
You are an AI assistant that evaluates the quality of user-provided prompts.
Your goal is to provide a score from 1 to 10 and brief, constructive feedback.
Score criteria:
1-3: Very unclear, ambiguous, or unlikely to yield useful results.
4-6: Moderately clear, but could be significantly improved for better results.
7-9: Clear and effective, likely to produce good results.
10: Exceptionally clear, specific, and well-structured.

Provide your response in JSON format with two keys: "score" (integer) and "feedback" (string, 1-2 sentences).
Example: {"score": 8, "feedback": "This prompt is clear and specifies the desired output format well. Consider adding a constraint for length if needed."}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or a newer/more capable model if available
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: `Evaluate the following prompt: ${promptContent}` }
      ],
      temperature: 0.3, // Lower temperature for more deterministic scoring
      max_tokens: 100, // Max tokens for the score and feedback
      response_format: { type: "json_object" },
    });

    const result = completion.choices[0]?.message?.content;

    if (result) {
      try {
        const parsedResult = JSON.parse(result);
        return NextResponse.json({
          score: parsedResult.score,
          feedback: parsedResult.feedback,
          error: null,
        });
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        console.error('Raw OpenAI response:', result);
        // Return a structured error if parsing fails but we got a response
        return NextResponse.json({
          score: null,
          feedback: "Could not parse AI feedback. The raw response was logged.",
          error: "Failed to parse AI response."
        }, { status: 500 });
      }
    } else {
      throw new Error("No content received from OpenAI.");
    }

  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    // Use a more specific error message if available from the error object
    const errorMessage = error.response?.data?.error?.message || error.message || "An unexpected error occurred with OpenAI.";
    return NextResponse.json({
      score: null,
      feedback: null,
      error: `OpenAI API error: ${errorMessage}`
    }, { status: 500 });
  }
}
