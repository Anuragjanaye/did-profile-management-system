import { type ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/authConfig";
import { DashboardFrame } from "@/features/dashboard/components/DashboardFrame";

interface DashboardLayoutProps {
  children: ReactNode;
}

/** Provides authenticated dashboard navigation, theming controls, and responsive layout. */
export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth();
  if (!session?.user?.walletAddress) {
    redirect("/login");
  }

  return <DashboardFrame walletAddress={session.user.walletAddress}>{children}</DashboardFrame>;
}
