/**
 * Auth feature — types scaffold.
 * Full implementation in Phase 2.
 */

export interface AuthUser {
  id: string;
  walletAddress: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
}
