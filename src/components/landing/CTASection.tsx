"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Call-to-action section at the bottom of the landing page.
 * Strong visual prompt to connect wallet.
 */
export function CTASection() {
  return (
    <section className="relative overflow-hidden px-4 py-24" aria-labelledby="cta-heading">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 via-[#7C3AED]/5 to-transparent" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card/60 rounded-2xl border border-[#2563EB]/20 p-12 backdrop-blur-md"
        >
          <h2
            id="cta-heading"
            className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Ready to own your identity?
          </h2>
          <p className="text-muted-foreground mb-8">
            Connect your wallet and build a verifiable, decentralized professional profile in
            minutes.
          </p>
          <Link
            href="/login"
            className={cn(
              "focus-visible:ring-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-10 text-base font-medium text-white transition-all hover:bg-[#2563EB]/90 focus-visible:ring-2 focus-visible:outline-none"
            )}
          >
            <Wallet className="h-5 w-5" aria-hidden="true" />
            Get Started Free
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <p className="text-muted-foreground mt-4 text-sm">
            No registration. No email. Just your wallet.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
