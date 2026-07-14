import { prisma } from "./prisma";
import type { Prisma } from "@prisma/client";

/**
 * Checks connectivity with Neon database.
 * Used in health check routes and startup validations.
 */
export async function pingDatabase(): Promise<boolean> {
  try {
    // Run a cheap raw query to verify Neon connection is alive
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection ping failed:", error);
    return false;
  }
}

/**
 * Utility wrapper to execute database queries inside a transaction.
 */
export async function withTransaction<T>(
  callback: (
    tx: Omit<
      typeof prisma,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ) => Promise<T>,
  options?: {
    maxWait?: number;
    timeout?: number;
    isolationLevel?: Prisma.TransactionIsolationLevel;
  }
): Promise<T> {
  return prisma.$transaction(callback, options);
}
