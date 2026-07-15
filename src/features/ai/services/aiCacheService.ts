import { getRedisClient } from "@/lib/redis/client";
import { createHash } from "crypto";
import type { z } from "zod";

const AI_CACHE_TTL_SECONDS = 900;

/** Builds a stable Redis key without placing source profile data in the key. */
export function createAiCacheKey(operation: string, value: string): string {
  const digest = createHash("sha256").update(value).digest("hex");
  return `ai:${operation}:${digest}`;
}

/** Reads and validates a cached AI response. */
export async function getCachedAiResponse<T>(key: string, schema: z.ZodType<T>): Promise<T | null> {
  const cached = await getRedisClient().get<unknown>(key);
  if (cached === null) return null;

  const parsed = schema.safeParse(cached);
  return parsed.success ? parsed.data : null;
}

/** Caches an AI response for a bounded duration. */
export async function cacheAiResponse<T>(key: string, value: T): Promise<void> {
  await getRedisClient().set(key, value, { ex: AI_CACHE_TTL_SECONDS });
}

/** Exposes the Redis client for the AI rate-limiter infrastructure. */
export function getAiRedisClient() {
  return getRedisClient();
}
