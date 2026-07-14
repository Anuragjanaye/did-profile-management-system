import { neonConfig } from "@neondatabase/serverless";

/**
 * Neon Serverless Database Driver Configuration.
 * Configures connection behaviors for serverless edge and lambda execution.
 */
export function configureNeon() {
  if (process.env.NODE_ENV === "production") {
    // Force secure web sockets for database transactions on the edge
    neonConfig.useSecureWebSocket = true;
  }
}
