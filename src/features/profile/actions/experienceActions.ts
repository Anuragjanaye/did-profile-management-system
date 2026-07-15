"use server";

import { auth } from "@/lib/auth/authConfig";
import { UserRepository } from "@/features/auth/repositories/userRepository";
import { ProfileRepository } from "@/features/profile/repositories/profileRepository";
import { prisma } from "@/lib/db/prisma";
import { experienceSchema } from "@/features/profile/schemas/profileSchemas";

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

/** Server Action: Adds a work experience record to the caller's profile. */
export async function addExperienceAction(input: unknown) {
  try {
    const user = await requireAuth();
    const validated = experienceSchema.parse(input);

    const profile = await ProfileRepository.findByUserId(user.id);
    if (!profile) throw new Error("PROFILE_NOT_FOUND");

    const experience = await prisma.experience.create({
      data: {
        profileId: profile.id,
        company: validated.company,
        role: validated.role,
        description: validated.description,
        startDate: validated.startDate,
        endDate: validated.endDate,
      },
    });

    return { success: true, data: experience };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: err.message || "Failed to add experience",
      },
    };
  }
}

/** Server Action: Removes (soft deletes) a work experience record from the caller's profile. */
export async function deleteExperienceAction(expId: string) {
  try {
    const user = await requireAuth();
    const profile = await ProfileRepository.findByUserId(user.id);
    if (!profile) throw new Error("PROFILE_NOT_FOUND");

    await prisma.experience.update({
      where: {
        id: expId,
        profileId: profile.id,
      },
      data: {
        deletedAt: new Date(), // Soft delete
      },
    });

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: err.message || "Failed to delete experience",
      },
    };
  }
}
