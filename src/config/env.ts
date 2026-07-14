/**
 * Environment variable validation.
 * The application will fail immediately at startup if any required variable is missing.
 * This ensures secrets are never silently undefined in production.
 */
import { z } from "zod";

const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),

  // Auth.js v5
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  AUTH_URL: z.string().url("AUTH_URL must be a valid URL"),

  // OpenAI
  OPENAI_API_KEY: z.string().startsWith("sk-", "OPENAI_API_KEY must start with 'sk-'"),

  // Pinata IPFS
  PINATA_JWT: z.string().min(1, "PINATA_JWT is required"),

  // Upstash Redis
  UPSTASH_REDIS_URL: z.string().url("UPSTASH_REDIS_URL must be a valid URL"),
  UPSTASH_REDIS_TOKEN: z.string().min(1, "UPSTASH_REDIS_TOKEN is required"),

  // Ethereum
  ALCHEMY_API_KEY: z.string().min(1, "ALCHEMY_API_KEY is required"),
  CONTRACT_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "CONTRACT_ADDRESS must be a valid Ethereum address"),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const clientEnvSchema = z.object({
  // WalletConnect
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z
    .string()
    .min(1, "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required"),

  // Ethereum RPC
  NEXT_PUBLIC_RPC_URL: z.string().url("NEXT_PUBLIC_RPC_URL must be a valid URL"),

  // Sentry
  NEXT_PUBLIC_SENTRY_DSN: z.string().url("NEXT_PUBLIC_SENTRY_DSN must be a valid URL").optional(),
});

/**
 * Validates server-side environment variables.
 * Only call from server-side code (Route Handlers, Server Actions, server components).
 */
function validateServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const messages = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(", ")}`)
      .join("\n");

    throw new Error(`❌ Invalid server environment variables:\n${messages}`);
  }

  return result.data;
}

/**
 * Validates client-side environment variables (NEXT_PUBLIC_*).
 * Safe to call from both client and server.
 */
function validateClientEnv() {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const messages = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(", ")}`)
      .join("\n");

    throw new Error(`❌ Invalid client environment variables:\n${messages}`);
  }

  return result.data;
}

// In development, skip validation for variables not yet set
// In production, always validate all variables
export const env =
  process.env.NODE_ENV === "production"
    ? { server: validateServerEnv(), client: validateClientEnv() }
    : {
        server: serverEnvSchema.partial().parse(process.env),
        client: clientEnvSchema.partial().parse({
          NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
          NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
          NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
        }),
      };
