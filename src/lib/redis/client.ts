import { Redis } from "@upstash/redis";
import { env } from "@/config/env";

/** Module-level singleton to avoid recreating Redis connections per invocation. */
let redisClient: Redis | undefined;

/**
 * Returns the shared Upstash Redis client.
 * Validates credentials on first access and throws an actionable error
 * when the environment is not configured.
 */
export function getRedisClient(): Redis {
  if (redisClient) return redisClient;

  const url = env.server.UPSTASH_REDIS_URL;
  const token = env.server.UPSTASH_REDIS_TOKEN;

  if (!url || !token) {
    throw new Error("Redis is not configured: UPSTASH_REDIS_URL or UPSTASH_REDIS_TOKEN is missing");
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}
