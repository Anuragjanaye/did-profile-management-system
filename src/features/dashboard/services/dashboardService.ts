import {
  DashboardRepository,
  type DashboardProfile,
} from "@/features/dashboard/repositories/dashboardRepository";
import type { DashboardData } from "@/features/dashboard/types/Dashboard";

/** Raised when dashboard data cannot be prepared for the authenticated user. */
export class DashboardServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DashboardServiceError";
  }
}

/** Calculates profile completion from the persisted, user-editable profile sections. */
function calculateProfileCompletion(profile: DashboardProfile): number {
  const sections = [
    Boolean(profile.displayName),
    Boolean(profile.headline),
    Boolean(profile.bio),
    Boolean(profile.location),
    Boolean(profile.website),
    profile.skills.length > 0,
    profile.education.length > 0,
    profile.experience.length > 0,
    profile.socialLinks.length > 0,
  ];

  return Math.round((sections.filter(Boolean).length / sections.length) * 100);
}

/** Aggregates stored dashboard data without exposing database records directly to the UI. */
export async function getDashboardData(userId: string): Promise<DashboardData> {
  const user = await DashboardRepository.findByUserId(userId);
  if (!user?.profile || user.profile.deletedAt) {
    throw new DashboardServiceError("Create a profile to view your dashboard");
  }

  const { profile } = user;
  return {
    walletAddress: user.walletAddress,
    displayName: profile.displayName,
    profileCompletion: calculateProfileCompletion(profile),
    profileScore: profile.profileScore,
    verificationStatus: profile.verificationStatus,
    skillCount: profile.skills.length,
    storageBytes: profile.uploads.reduce((total, upload) => total + upload.size, 0),
    activity: user.activityLogs.map((entry) => ({
      id: entry.id,
      action: entry.action,
      createdAt: entry.createdAt,
    })),
    notifications: user.notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      createdAt: notification.createdAt,
    })),
  };
}
