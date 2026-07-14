import { type ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Wallet, LayoutDashboard, UserCircle, Settings } from "lucide-react";
import { auth } from "@/lib/auth/authConfig";
import { formatAddress } from "@/utils/formatAddress";
import { ConnectWalletButton } from "@/features/auth/components/ConnectWalletButton";
import { SITE_CONFIG } from "@/config/site";

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Shared layout for authenticated pages.
 * Displays a left sidebar (navigation) and top bar (wallet state / settings).
 */
export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Edge protection: enforce server-rendered session validation
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const walletAddress = session.user.walletAddress;

  return (
    <div className="bg-background flex min-h-dvh">
      {/* ──────────────── Sidebar Navigation ──────────────── */}
      <aside className="border-border/50 bg-card/40 hidden w-64 flex-col border-r backdrop-blur-sm md:flex">
        {/* Brand */}
        <div className="border-border/30 flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="text-foreground flex items-center gap-2 font-bold">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]"
              aria-hidden="true"
            >
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <span>{SITE_CONFIG.name}</span>
          </Link>
        </div>

        {/* Navigation links */}
        <nav aria-label="Dashboard navigation" className="flex-1 space-y-1 px-4 py-6">
          <Link
            href="/dashboard"
            className="bg-surface-elevated text-foreground hover:bg-surface-elevated/80 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <LayoutDashboard className="text-primary h-4 w-4" aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/profile/edit"
            className="text-muted-foreground hover:bg-surface-elevated/40 hover:text-foreground flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <UserCircle className="h-4 w-4" aria-hidden="true" />
            <span>My Profile</span>
          </Link>
          <Link
            href="/settings"
            className="text-muted-foreground hover:bg-surface-elevated/40 hover:text-foreground flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            <span>Settings</span>
          </Link>
        </nav>

        {/* User Card info footer */}
        <div className="border-border/30 bg-surface/30 border-t p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col">
              <span className="text-foreground truncate text-xs font-semibold">
                Wallet Connected
              </span>
              <span className="text-muted-foreground truncate text-[10px]">
                {formatAddress(walletAddress)}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ──────────────── Main Panel ──────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top navbar */}
        <header className="border-border/30 bg-background/50 flex h-16 items-center justify-between border-b px-6 backdrop-blur-md">
          {/* Mobile brand placeholder */}
          <div className="flex items-center gap-2 md:hidden">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]"
              aria-hidden="true"
            >
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <span className="text-foreground font-bold">{SITE_CONFIG.name}</span>
          </div>

          <div className="hidden md:block">
            <p className="text-muted-foreground text-sm font-medium">
              Welcome back to your decentralized space.
            </p>
          </div>

          {/* Connect wallet dropdown and trigger hooks */}
          <div className="flex items-center gap-4">
            <ConnectWalletButton />
          </div>
        </header>

        {/* Dashboard workspace slot */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
