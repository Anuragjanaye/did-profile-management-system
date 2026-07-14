"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { ConnectWalletButton } from "@/features/auth/components/ConnectWalletButton";
import { SITE_CONFIG, NAV_LINKS } from "@/config/site";

/**
 * Landing page top navigation bar.
 * Server component — static content, no interactivity.
 */
export function LandingNav() {
  return (
    <header
      className="border-border/50 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md"
      role="banner"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-foreground flex items-center gap-2 font-bold transition-opacity hover:opacity-80"
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

        {/* Navigation links — hidden on mobile */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <ConnectWalletButton />
      </div>
    </header>
  );
}
