"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  accentClass: string;
  accentBg: string;
  progress?: number;
  score?: number;
}

/** Renders a styled, responsive metric card with visual hover glows and progress indicators. */
export function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  accentClass,
  accentBg,
  progress,
  score,
}: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden relative group">
        {/* Decorative background glow on hover */}
        <div className={`absolute -right-8 -bottom-8 size-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${accentBg}`} />

        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
            {label}
          </CardDescription>
          <div className={`p-2 rounded-lg border ${accentBg} transition-colors duration-300`}>
            <Icon className={`size-4 ${accentClass}`} aria-hidden="true" />
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
          
          {progress !== undefined && (
            <div className="bg-muted/50 mt-4 h-1.5 overflow-hidden rounded-full relative" aria-hidden="true">
              <div
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {score !== undefined && (
            <div className="flex gap-1.5 mt-4 items-center">
              <span className={`size-2 rounded-full ${score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"}`} />
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/85">
                {score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs Review"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
