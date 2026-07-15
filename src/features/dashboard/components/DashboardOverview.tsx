"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  BrainCircuit,
  Cloud,
  GraduationCap,
  Sparkles,
  PencilLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/features/dashboard/components/MetricCard";
import { ProfileCompletionCard } from "@/features/dashboard/components/ProfileCompletionCard";
import { ActivityCard } from "@/features/dashboard/components/ActivityCard";
import { VerificationCard } from "@/features/dashboard/components/VerificationCard";
import { QuickActionsCard } from "@/features/dashboard/components/QuickActionsCard";
import { NotificationsCard } from "@/features/dashboard/components/NotificationsCard";
import type { DashboardData } from "@/features/dashboard/types/Dashboard";

interface DashboardOverviewProps {
  data: DashboardData;
}

// Stagger animation container
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// Slide up items
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

/** Displays the dashboard's profile metrics, activity, and notifications. */
export function DashboardOverview({ data }: DashboardOverviewProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 lg:space-y-8"
    >
      {/* ──────────────── HEADER SEGMENT ──────────────── */}
      <motion.section
        variants={itemVariants}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end bg-card/40 border border-border/50 rounded-2xl p-6 backdrop-blur-md shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 size-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 size-32 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary animate-pulse" aria-hidden="true" />
            <p className="text-primary text-xs font-semibold tracking-wider uppercase">
              Identity Workspace
            </p>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent sm:text-4xl">
            Welcome back, {data.displayName}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
            Keep your decentralized professional identity complete, verified, and enhanced with AI insights.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Button
            render={<Link href="/profile/edit" />}
            className="w-full sm:w-auto bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 hover:bg-primary/95 transition-all active:scale-[0.98] duration-200"
          >
            <PencilLine className="size-4" aria-hidden="true" />
            Edit Profile
          </Button>
        </div>
      </motion.section>

      {/* ──────────────── ANALYTICS ROW ──────────────── */}
      <motion.section
        variants={itemVariants}
        aria-label="Profile metrics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <MetricCard
          label="Profile Completion"
          value={`${data.profileCompletion}%`}
          description="Complete every core section"
          icon={BadgeCheck}
          accentClass="text-blue-500"
          accentBg="bg-blue-500/10 border-blue-500/25"
          progress={data.profileCompletion}
        />
        <MetricCard
          label="AI Profile Score"
          value={`${data.profileScore}/100`}
          description="Based on latest analysis"
          icon={BrainCircuit}
          accentClass="text-purple-500"
          accentBg="bg-purple-500/10 border-purple-500/25"
          score={data.profileScore}
        />
        <MetricCard
          label="Skills Recorded"
          value={String(data.skillCount)}
          description="Showcase your expertise"
          icon={GraduationCap}
          accentClass="text-cyan-500"
          accentBg="bg-cyan-500/10 border-cyan-500/25"
        />
        <MetricCard
          label="Decentralized Storage"
          value={formatStorage(data.storageBytes)}
          description="Assets stored in IPFS"
          icon={Cloud}
          accentClass="text-emerald-500"
          accentBg="bg-emerald-500/10 border-emerald-500/25"
        />
      </motion.section>

      {/* ──────────────── DETAILED GRIDS ──────────────── */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
        {/* Left Side: Completion, Timelines */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <ProfileCompletionCard completion={data.profileCompletion} />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <ActivityCard activity={data.activity} />
          </motion.div>
        </div>

        {/* Right Side: Verification, Notifications, Quick Actions */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <VerificationCard verificationStatus={data.verificationStatus} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <QuickActionsCard />
          </motion.div>

          <motion.div variants={itemVariants}>
            <NotificationsCard notifications={data.notifications} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ──────────────── HELPER: FORMAT STORAGE BYTES ────────────────
function formatStorage(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** exponent).toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}
