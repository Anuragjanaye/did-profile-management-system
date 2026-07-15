"use server";

import { auth } from "@/lib/auth/authConfig";
import { UserRepository } from "@/features/auth/repositories/userRepository";
import { ProfileRepository } from "@/features/profile/repositories/profileRepository";
import { prisma } from "@/lib/db/prisma";
import { educationSchema } from "@/features/profile/schemas/profileSchemas";

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

/** Server Action: Adds an education record to the caller's profile. */
export async function addEducationAction(input: unknown) {
  try {
    const user = await requireAuth();
    const validated = educationSchema.parse(input);

    const profile = await ProfileRepository.findByUserId(user.id);
    if (!profile) throw new Error("PROFILE_NOT_FOUND");

    const education = await prisma.education.create({
      data: {
        profileId: profile.id,
        institution: validated.institution,
        degree: validated.degree,
        fieldOfStudy: validated.fieldOfStudy,
        startYear: validated.startYear,
        endYear: validated.endYear,
      },
    });

    return { success: true, data: education };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: err.message || "Failed to add education",
      },
    };
  }
}

/** Server Action: Removes (soft deletes) an education record from the caller's profile. */
export async function deleteEducationAction(eduId: string) {
  try {
    const user = await requireAuth();
    const profile = await ProfileRepository.findByUserId(user.id);
    if (!profile) throw new Error("PROFILE_NOT_FOUND");

    await prisma.education.update({
      where: {
        id: eduId,
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
        message: err.message || "Failed to delete education",
      },
    };
  }
}
