"use client";

import { Wallet, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ConnectWalletButton } from "@/features/auth/components/ConnectWalletButton";

/**
 * Authentication / Login Page.
 * Displays a premium card with the wallet connection trigger.
 */
export default function LoginPage() {
  return (
    <div className="relative flex min-h-[85dvh] items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563EB]/10 blur-[100px]" />
        <div className="absolute top-1/3 left-1/3 h-[300px] w-[300px] rounded-full bg-[#7C3AED]/5 blur-[80px]" />
      </div>

      <div className="w-full max-w-md">
        {/* Back button */}
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground group mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          />
          <span>Back to homepage</span>
        </Link>

        {/* Auth Card */}
        <div className="border-border/50 bg-card/60 rounded-2xl border p-8 shadow-xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10"
              aria-hidden="true"
            >
              <Wallet className="h-6 w-6 text-[#2563EB]" />
            </div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              Verify your Identity
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Connect your Ethereum wallet to sign in.
            </p>
          </div>

          <div className="space-y-6">
            {/* Wallet Button Container */}
            <div className="flex justify-center py-2">
              <ConnectWalletButton />
            </div>

            <div className="bg-surface/50 border-border/30 rounded-lg border p-4">
              <h2 className="text-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <ShieldCheck className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
                Secure &amp; Non-Custodial
              </h2>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                We never store your private keys or passwords. Authentication occurs securely
                on-chain via cryptographic message signatures.
              </p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-xs">
          By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
