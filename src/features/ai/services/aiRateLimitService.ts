import { Ratelimit } from "@upstash/ratelimit";
import { getAiRedisClient } from "@/features/ai/services/aiCacheService";

const AI_REQUEST_LIMIT = 20;
const AI_REQUEST_WINDOW = "1 h";

let aiRateLimiter: Ratelimit | undefined;

/** Applies the project-wide AI request limit for one authenticated user. */
export async function limitAiRequest(userId: string): Promise<{ reset: number }> {
  aiRateLimiter ??= new Ratelimit({
    redis: getAiRedisClient(),
    limiter: Ratelimit.slidingWindow(AI_REQUEST_LIMIT, AI_REQUEST_WINDOW),
    prefix: "did-profile-system:ai-rate-limit",
  });

  const result = await aiRateLimiter.limit(userId);
  if (!result.success) {
    throw new AiRateLimitError(result.reset);
  }

  return { reset: result.reset };
}

/** Signals that an authenticated user exceeded the AI rate limit. */
export class AiRateLimitError extends Error {
  readonly reset: number;

  constructor(reset: number) {
    super("AI request limit reached. Please try again later.");
    this.name = "AiRateLimitError";
    this.reset = reset;
  }
}
