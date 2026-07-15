import type { NotificationType, VerificationStatus } from "@prisma/client";

/** Dashboard data prepared for presentation by the dashboard service. */
export interface DashboardData {
  walletAddress: string;
  displayName: string;
  profileCompletion: number;
  profileScore: number;
  verificationStatus: VerificationStatus;
  skillCount: number;
  storageBytes: number;
  activity: DashboardActivity[];
  notifications: DashboardNotification[];
}

/** A recent user activity item safe to display in the dashboard. */
export interface DashboardActivity {
  id: string;
  action: string;
  createdAt: Date;
}

/** A recent user notification safe to display in the dashboard. */
export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}
