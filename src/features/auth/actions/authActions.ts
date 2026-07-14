"use server";

import { cookies } from "next/headers";
import { generateNonce } from "siwe";

const NONCE_COOKIE_NAME = "siwe-nonce";

/**
 * Server Action to generate a SIWE challenge nonce.
 * Stores the generated nonce in a secure, HTTP-only cookie and returns it.
 */
export async function getSiweNonce(): Promise<string> {
  const nonce = generateNonce();

  const cookieStore = await cookies();
  cookieStore.set(NONCE_COOKIE_NAME, nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5, // 5 minutes validity
  });

  return nonce;
}

/**
 * Server Action to retrieve the current stored nonce for verification.
 */
export async function getStoredNonce(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(NONCE_COOKIE_NAME)?.value;
}

/**
 * Server Action to clear the stored nonce after verification.
 */
export async function clearStoredNonce(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(NONCE_COOKIE_NAME);
}
