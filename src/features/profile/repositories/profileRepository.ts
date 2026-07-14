import { prisma } from "@/lib/db/prisma";
import type { Profile, Prisma } from "@prisma/client";

export type ProfileWithRelations = Prisma.ProfileGetPayload<{
  include: {
    skills: true;
    education: true;
    experience: true;
    certificates: true;
    socialLinks: true;
  };
}>;

/**
 * Repository layer for Profile operations.
 * Enforces soft delete filters (deletedAt == null) on queries.
 */
export class ProfileRepository {
  /**
   * Find profile by user ID. Excludes soft-deleted records.
   */
  static async findByUserId(userId: string): Promise<ProfileWithRelations | null> {
    return prisma.profile.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        skills: true,
        education: true,
        experience: true,
        certificates: true,
        socialLinks: true,
      },
    });
  }

  /**
   * Find profile by unique profile ID. Excludes soft-deleted records.
   */
  static async findById(id: string): Promise<ProfileWithRelations | null> {
    return prisma.profile.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        skills: true,
        education: true,
        experience: true,
        certificates: true,
        socialLinks: true,
      },
    });
  }

  static async create(data: Prisma.ProfileUncheckedCreateInput): Promise<ProfileWithRelations> {
    return prisma.profile.create({
      data,
      include: {
        skills: true,
        education: true,
        experience: true,
        certificates: true,
        socialLinks: true,
      },
    });
  }

  /**
   * Update profile fields.
   */
  static async update(id: string, data: Prisma.ProfileUpdateInput): Promise<ProfileWithRelations> {
    return prisma.profile.update({
      where: { id },
      data,
      include: {
        skills: true,
        education: true,
        experience: true,
        certificates: true,
        socialLinks: true,
      },
    });
  }

  /**
   * Soft delete a user profile by setting the deletedAt timestamp.
   */
  static async softDelete(id: string): Promise<Profile> {
    return prisma.profile.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restores a soft-deleted profile.
   */
  static async restore(id: string): Promise<Profile> {
    return prisma.profile.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}
