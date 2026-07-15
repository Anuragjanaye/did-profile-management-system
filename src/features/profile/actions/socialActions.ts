"use server";

import { auth } from "@/lib/auth/authConfig";
import { UserRepository } from "@/features/auth/repositories/userRepository";
import { ProfileRepository } from "@/features/profile/repositories/profileRepository";
import { prisma } from "@/lib/db/prisma";
import { socialLinkSchema } from "@/features/profile/schemas/profileSchemas";

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

/** Server Action: Adds a social link record to the caller's profile. */
export async function addSocialLinkAction(input: unknown) {
  try {
    const user = await requireAuth();
    const validated = socialLinkSchema.parse(input);

    const profile = await ProfileRepository.findByUserId(user.id);
    if (!profile) throw new Error("PROFILE_NOT_FOUND");

    const socialLink = await prisma.socialLink.create({
      data: {
        profileId: profile.id,
        platform: validated.platform,
        url: validated.url,
      },
    });

    return { success: true, data: socialLink };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: err.message || "Failed to add social link",
      },
    };
  }
}

/** Server Action: Removes a social link record from the caller's profile. */
export async function deleteSocialLinkAction(socialLinkId: string) {
  try {
    const user = await requireAuth();
    const profile = await ProfileRepository.findByUserId(user.id);
    if (!profile) throw new Error("PROFILE_NOT_FOUND");

    await prisma.socialLink.delete({
      where: {
        id: socialLinkId,
        profileId: profile.id, // Enforce ownership
      },
    });

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: err.message || "Failed to delete social link",
      },
    };
  }
}
