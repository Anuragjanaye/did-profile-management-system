import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

export type DashboardUser = Prisma.UserGetPayload<{
  include: {
    profile: {
      include: {
        skills: true;
        education: true;
        experience: true;
        certificates: true;
        socialLinks: true;
        uploads: true;
      };
    };
    activityLogs: true;
    notifications: true;
  };
}>;

/** Profile relations required to calculate dashboard analytics. */
export type DashboardProfile = NonNullable<DashboardUser["profile"]>;

/** Repository layer for the authenticated user's dashboard data. */
export class DashboardRepository {
  /** Loads the bounded relations required to render a dashboard. */
  static async findByUserId(userId: string): Promise<DashboardUser | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            skills: true,
            education: { where: { deletedAt: null } },
            experience: { where: { deletedAt: null } },
            certificates: { where: { deletedAt: null } },
            socialLinks: true,
            uploads: { where: { deletedAt: null } },
          },
        },
        activityLogs: { orderBy: { createdAt: "desc" }, take: 5 },
        notifications: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });
  }
}
