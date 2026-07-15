import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/authConfig";
import { UserRepository } from "@/features/auth/repositories/userRepository";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import {
  DashboardServiceError,
  getDashboardData,
} from "@/features/dashboard/services/dashboardService";

/** Renders the authenticated user's data-backed identity dashboard. */
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.walletAddress) {
    redirect("/login");
  }

  const user = await UserRepository.findByWalletAddress(session.user.walletAddress);
  if (!user) {
    redirect("/login");
  }

  const dashboardData = await loadDashboardData(user.id);
  return <DashboardOverview data={dashboardData} />;
}

/** Redirects users without a profile to the profile editor before rendering the dashboard. */
async function loadDashboardData(userId: string) {
  try {
    return await getDashboardData(userId);
  } catch (error: unknown) {
    if (error instanceof DashboardServiceError) {
      redirect("/profile/edit");
    }

    throw error;
  }
}
