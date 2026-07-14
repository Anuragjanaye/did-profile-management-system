"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, Shield, Sparkles, ChevronRight, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/config/site";

/** Inline link-as-button helper — avoids asChild pattern not supported by base-ui Button */
function LinkButton({
  href,
  className,
  children,
  external = false,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const base =
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn(base, className)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, className)}>
      {children}
    </Link>
  );
}

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const STAGGER = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/**
 * Landing page hero section.
 * First-paint impression — communicates the core value proposition.
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[90dvh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center"
      aria-labelledby="hero-heading"
    >
      {/* Background gradient mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563EB]/10 blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#7C3AED]/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#06B6D4]/6 blur-[80px]" />
      </div>

      <motion.div
        className="mx-auto max-w-4xl"
        variants={STAGGER}
        initial="hidden"
        animate="visible"
      >
        {/* Announcement badge */}
        <motion.div variants={FADE_UP} className="mb-8 flex justify-center">
          <Badge
            variant="outline"
            className="gap-2 border-[#2563EB]/30 bg-[#2563EB]/10 px-4 py-1.5 text-sm text-[#2563EB] backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Powered by Ethereum &amp; IPFS
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="hero-heading"
          variants={FADE_UP}
          className="text-foreground mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          Own Your{" "}
          <span className="bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
            Identity
          </span>
          . <span className="block">On-Chain.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={FADE_UP}
          className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg leading-relaxed sm:text-xl"
        >
          {SITE_CONFIG.description}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={FADE_UP}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <LinkButton
            href="/login"
            className="h-12 bg-[#2563EB] px-8 text-base text-white hover:bg-[#2563EB]/90"
          >
            <Wallet className="h-5 w-5" aria-hidden="true" />
            Connect Wallet
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </LinkButton>

          <LinkButton
            href={SITE_CONFIG.githubUrl}
            external
            className="border-border text-foreground hover:bg-accent h-12 border bg-transparent px-8 text-base"
            aria-label="View source code on GitHub (opens in new tab)"
          >
            <Github className="h-5 w-5" aria-hidden="true" />
            View on GitHub
          </LinkButton>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={FADE_UP}
          className="text-muted-foreground mt-12 flex items-center justify-center gap-6 text-sm"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
            <span>No passwords</span>
          </div>
          <div className="bg-border h-4 w-px" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
            <span>You own your data</span>
          </div>
          <div className="bg-border h-4 w-px" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
            <span>Open source</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
