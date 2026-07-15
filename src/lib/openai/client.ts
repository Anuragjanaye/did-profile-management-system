import OpenAI from "openai";

/** Module-level singleton to avoid recreating the client per invocation. */
let openAiClient: OpenAI | undefined;

/**
 * Returns the shared, server-only OpenAI client.
 * Validates the API key on first access and throws an actionable error
 * when the environment is not configured.
 */
export function getOpenAiClient(): OpenAI {
  if (openAiClient) return openAiClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("AI service is not configured: OPENAI_API_KEY is missing");
  }

  openAiClient = new OpenAI({ apiKey });
  return openAiClient;
}
