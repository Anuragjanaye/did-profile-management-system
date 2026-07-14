/**
 * Auth.js v5 session type extension.
 * Adds wallet address and role to the default session/user types.
 */
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      walletAddress: string;
      role: "USER" | "ADMIN" | "SUPER_ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    walletAddress: string;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
  }
}
