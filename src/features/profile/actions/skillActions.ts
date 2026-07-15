"use server";

import { auth } from "@/lib/auth/authConfig";
import { UserRepository } from "@/features/auth/repositories/userRepository";
import { ProfileRepository } from "@/features/profile/repositories/profileRepository";
import { prisma } from "@/lib/db/prisma";
import { skillSchema } from "@/features/profile/schemas/profileSchemas";

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

/** Server Action: Adds a professional skill to the caller's profile. */
export async function addSkillAction(input: unknown) {
  try {
    const user = await requireAuth();
    const validated = skillSchema.parse(input);

    const profile = await ProfileRepository.findByUserId(user.id);
    if (!profile) throw new Error("PROFILE_NOT_FOUND");

    const skill = await prisma.skill.create({
      data: {
        profileId: profile.id,
        name: validated.name,
        level: validated.level,
      },
    });

    return { success: true, data: skill };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: err.message || "Failed to add skill",
      },
    };
  }
}

/** Server Action: Removes a professional skill from the caller's profile. */
export async function deleteSkillAction(skillId: string) {
  try {
    const user = await requireAuth();
    const profile = await ProfileRepository.findByUserId(user.id);
    if (!profile) throw new Error("PROFILE_NOT_FOUND");

    await prisma.skill.delete({
      where: {
        id: skillId,
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
        message: err.message || "Failed to delete skill",
      },
    };
  }
}
