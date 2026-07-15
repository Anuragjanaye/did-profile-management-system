"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BrainCircuit,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  UserCircle,
  UsersRound,
  Wallet,
  X,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/features/auth/components/ConnectWalletButton";
import { ThemeToggle } from "@/features/dashboard/components/ThemeToggle";
import { formatAddress } from "@/utils/formatAddress";
import { SITE_CONFIG } from "@/config/site";

interface DashboardFrameProps {
  children: ReactNode;
  walletAddress: string;
}

interface NavigationItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/profile/edit", icon: UserCircle },
  { label: "Organizations", href: "/organizations", icon: UsersRound },
  { label: "AI Guidance", href: "/profile/edit?tab=ai", icon: BrainCircuit },
  { label: "Search", href: "/search", icon: Search },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

/** Renders the responsive dashboard navigation shell and top bar. */
export function DashboardFrame({ children, walletAddress }: DashboardFrameProps) {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="bg-background text-foreground flex min-h-dvh">
      {/* Desktop Sidebar */}
      <Sidebar pathname={pathname} walletAddress={walletAddress} />

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileNavigationOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              aria-label="Close navigation"
              onClick={() => setIsMobileNavigationOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-card border-border/50 absolute inset-y-0 left-0 flex w-72 flex-col border-r shadow-2xl"
            >
              <Sidebar
                mobile
                pathname={pathname}
                walletAddress={walletAddress}
                onNavigate={() => setIsMobileNavigationOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border/40 bg-background/80 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="border-border/50 hover:bg-muted border md:hidden"
              aria-label="Open navigation"
              onClick={() => setIsMobileNavigationOpen(true)}
            >
              <Menu className="size-4" aria-hidden="true" />
            </Button>
            <div className="text-muted-foreground/80 hidden items-center gap-1.5 text-xs font-medium sm:flex">
              <span>Identity Hub</span>
              <span className="bg-muted-foreground/45 size-1 rounded-full" />
              <span>Dashboard workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="bg-border/60 h-4 w-px" aria-hidden="true" />
            <ConnectWalletButton />
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

interface SidebarProps {
  pathname: string;
  walletAddress: string;
  mobile?: boolean;
  onNavigate?: () => void;
}

/** Displays the dashboard navigation at desktop width and within the mobile drawer. */
function Sidebar({ pathname, walletAddress, mobile = false, onNavigate }: SidebarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sidebarClasses = mobile
    ? "flex h-full flex-col bg-card"
    : "bg-card/30 hidden w-64 shrink-0 flex-col border-r border-border/40 md:flex backdrop-blur-md relative";

  return (
    <aside className={sidebarClasses} aria-label="Dashboard navigation">
      {/* Sidebar Header */}
      <div className="border-border/40 flex h-16 items-center justify-between border-b px-5">
        <Link
          href="/dashboard"
          className="text-foreground group flex items-center gap-2.5 font-semibold"
          onClick={onNavigate}
        >
          <span className="bg-primary/15 border-primary/30 text-primary shadow-primary/10 flex size-8 items-center justify-center rounded-lg border shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Wallet className="size-4" aria-hidden="true" />
          </span>
          <span className="from-foreground via-foreground/90 to-foreground/80 bg-gradient-to-r bg-clip-text text-sm font-bold tracking-tight text-transparent uppercase">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {mobile && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="border-border/50 border"
            aria-label="Close navigation"
            onClick={onNavigate}
          >
            <X className="size-3.5" aria-hidden="true" />
          </Button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-3">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isCurrent =
            pathname === item.href ||
            (item.href.includes("tab=ai") && pathname === "/profile/edit");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent ? "page" : undefined}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition-all ${
                isCurrent
                  ? "bg-primary/10 text-primary border-primary/20 border"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent"
              }`}
            >
              <Icon
                className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-105"
                aria-hidden="true"
              />
              <span>{item.label}</span>
              {isCurrent && (
                <span className="bg-primary absolute top-0 right-0 bottom-0 w-1 rounded-l-md" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Connection Indicator Footer */}
      <div className="border-border/40 bg-muted/10 relative border-t p-4">
        <div className="flex items-center gap-1.5">
          <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            On-Chain Network
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="border-border/40 hover:bg-muted/50 text-muted-foreground mt-2 flex w-full items-center justify-between gap-2 rounded-lg border p-2 font-mono text-[10px] font-semibold transition-all duration-200"
          aria-label="Copy connected wallet address"
        >
          <span className="truncate">{formatAddress(walletAddress)}</span>
          {copied ? (
            <Check className="size-3.5 shrink-0 text-emerald-500" />
          ) : (
            <Copy className="hover:text-foreground size-3.5 shrink-0 transition-colors" />
          )}
        </button>
      </div>
    </aside>
  );
}
