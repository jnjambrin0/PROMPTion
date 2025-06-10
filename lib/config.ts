export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY && process.env.NODE_ENV !== 'test') { // Allow tests to run without API key
  console.warn(
    "OpenAI API key not found. Please set OPENAI_API_KEY environment variable. Prompt scoring will not work."
  );
}
