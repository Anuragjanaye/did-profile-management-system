"use server";

import { auth } from "@/lib/auth/authConfig";
import { UserRepository } from "@/features/auth/repositories/userRepository";
import { ProfileRepository } from "@/features/profile/repositories/profileRepository";
import { prisma } from "@/lib/db/prisma";
import {
  profileUpdateSchema,
  skillSchema,
  educationSchema,
  experienceSchema,
  socialLinkSchema,
} from "@/features/profile/schemas/profileSchemas";

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
 * Add a skill to the user's profile.
 */
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

/**
 * Remove a skill from the user's profile.
 */
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

/**
 * Add experience record.
 */
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

/**
 * Delete experience record.
 */
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

/**
 * Add education record.
 */
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

/**
 * Delete education record.
 */
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

/**
 * Add social link.
 */
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

/**
 * Delete social link.
 */
export async function deleteSocialLinkAction(linkId: string) {
  try {
    const user = await requireAuth();
    const profile = await ProfileRepository.findByUserId(user.id);
    if (!profile) throw new Error("PROFILE_NOT_FOUND");

    await prisma.socialLink.delete({
      where: {
        id: linkId,
        profileId: profile.id,
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
