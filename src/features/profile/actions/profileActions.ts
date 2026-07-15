"use server";

import { auth } from "@/lib/auth/authConfig";
import { UserRepository } from "@/features/auth/repositories/userRepository";
import { ProfileRepository } from "@/features/profile/repositories/profileRepository";
import { profileUpdateSchema } from "@/features/profile/schemas/profileSchemas";

/**
 * Ensures user is authenticated and returns user details.
 */
async function requireAuth() {
  const session = await auth();
  if (!session?.user?.walletAddress) {
    throw new Error("UNAUTHORIZED");
  }

  const user = await UserRepository.findByWalletAddress(session.user.walletAddress);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
}

/**
 * Creates or updates the active user's profile.
 */
export async function upsertProfileAction(input: unknown) {
  try {
    const user = await requireAuth();
    const validated = profileUpdateSchema.parse(input);

    let profile = await ProfileRepository.findByUserId(user.id);

    if (profile) {
      profile = await ProfileRepository.update(profile.id, validated);
    } else {
      profile = await ProfileRepository.create({
        userId: user.id,
        displayName: validated.displayName,
        headline: validated.headline,
        bio: validated.bio,
        location: validated.location,
        website: validated.website,
        visibility: validated.visibility,
        isComplete: true,
      });
    }

    return { success: true, data: profile };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: {
        code: err.message === "UNAUTHORIZED" ? "UNAUTHORIZED" : "VALIDATION_ERROR",
        message: err.message || "Failed to update profile",
      },
    };
  }
}

/**
 * Fetches user profile query directly (for server components / routes).
 */
export async function getProfileByAddressAction(walletAddress: string) {
  try {
    const user = await UserRepository.findByWalletAddress(walletAddress);
    if (!user) throw new Error("USER_NOT_FOUND");

    const profile = await ProfileRepository.findByUserId(user.id);
    return { success: true, data: profile };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: err.message || "Profile not found",
      },
    };
  }
}
