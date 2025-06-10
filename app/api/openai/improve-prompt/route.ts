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
  console.warn("OpenAI API key not provided. Prompt improvement will be mocked.");
}

// Mock improvement function if OpenAI client is not available
const mockImprovePrompt = (content: string, feedback?: string) => {
  console.log("[MOCK OpenAI] Improving prompt:", content, "with feedback:", feedback);
  // Simulate some delay
  return new Promise(resolve => setTimeout(() => {
    resolve({
      improvedPrompt: `${content} - (mock improved version based on feedback: ${feedback || 'general best practices'})`,
      error: null,
    });
  }, 700));
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { promptContent, promptFeedback } = await request.json();

  if (!promptContent || typeof promptContent !== 'string' || promptContent.trim().length === 0) {
    return NextResponse.json({ message: 'promptContent is required and must be a non-empty string.' }, { status: 400 });
  }
  if (promptContent.length > 10000) { // Example max length for prompt content
    return NextResponse.json({ message: 'promptContent exceeds maximum length of 10000 characters.' }, { status: 400 });
  }
  if (promptFeedback !== undefined && (typeof promptFeedback !== 'string' || promptFeedback.length > 2000)) { // Example max length for feedback
    return NextResponse.json({ message: 'If provided, promptFeedback must be a string up to 2000 characters.' }, { status: 400 });
  }

  if (!openai) {
    console.log("OpenAI client not initialized, using mock improvement.");
    const mockResponse = await mockImprovePrompt(promptContent, promptFeedback);
    return NextResponse.json(mockResponse);
  }

  try {
    let systemMessage = `
You are an AI assistant that helps users improve their prompts.
Your goal is to rewrite the given prompt to make it clearer, more specific, and better structured for achieving optimal results from an AI model.
Consider the original prompt and any feedback provided.
Return only the improved prompt text as a raw string, without any surrounding explanations or markdown.
`;

    if (promptFeedback) {
      systemMessage += `\n\nSpecific feedback to consider while improving the prompt: "${promptFeedback}"`;
    } else {
      systemMessage += `\n\nConsider general best practices for prompt engineering, such as adding context, specifying a role for the AI, defining the desired output format, and ensuring clarity.`;
    }

    const userMessage = `Original prompt:
"""
${promptContent}
"""

Improved prompt:`;


    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Consider gpt-4 for better quality improvements if available
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      temperature: 0.5, // A balance between creativity and determinism
      max_tokens: Math.floor(promptContent.length * 1.5) + 150, // Allow for expansion + instructions
      // stop: ["Improved prompt:"], // Might not be necessary if model follows instructions well
    });

    const improvedPrompt = completion.choices[0]?.message?.content?.trim();

    if (improvedPrompt) {
      return NextResponse.json({
        improvedPrompt,
        error: null,
      });
    } else {
      throw new Error("No improved prompt content received from OpenAI.");
    }

  } catch (error: any) {
    console.error('Error calling OpenAI API for prompt improvement:', error);
    const errorMessage = error.response?.data?.error?.message || error.message || "An unexpected error occurred with OpenAI.";
    return NextResponse.json({
      improvedPrompt: null,
      error: `OpenAI API error: ${errorMessage}`
    }, { status: 500 });
  }
}
