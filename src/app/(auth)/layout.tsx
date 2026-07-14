import { type ReactNode } from "react";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Centered auth layout wrapping login pages.
 * Integrates consistent minimal headers and footer links.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      {/* Auth header */}
      <header className="border-border/30 bg-background/50 flex h-16 items-center justify-between border-b px-6 backdrop-blur-md">
        <Link
          href="/"
          className="text-foreground flex items-center gap-2 font-bold transition-opacity hover:opacity-85"
          aria-label={`${SITE_CONFIG.name} — go to homepage`}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]"
            aria-hidden="true"
          >
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <span>{SITE_CONFIG.name}</span>
        </Link>
      </header>

      {/* Main layout slot */}
      <main className="flex flex-1 flex-col justify-center">{children}</main>

      {/* Auth footer */}
      <footer className="border-border/30 bg-surface/30 border-t py-6">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <nav aria-label="Privacy and Terms navigation" className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
