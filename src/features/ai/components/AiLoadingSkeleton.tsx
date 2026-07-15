"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AiLoadingSkeletonProps {
  /** Visual variant matching the component being loaded. */
  variant: "score-card" | "analysis-panel" | "recommendation-list" | "resume-panel";
  className?: string;
}

/** Score card skeleton: circular indicator + text lines. */
function ScoreCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <Skeleton className="size-24 rounded-full" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />
    </div>
  );
}

/** Analysis panel skeleton: section headers + bullet lines. */
function AnalysisPanelSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="mt-2 flex flex-col gap-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

/** Recommendation list skeleton: rows of badge + text. */
function RecommendationListSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Skeleton className="h-5 w-48" />
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="h-5 w-16 rounded-full" />
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Resume panel skeleton: assessment block + lists. */
function ResumePanelSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-20 w-full rounded-lg" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

const SKELETON_MAP: Record<AiLoadingSkeletonProps["variant"], React.FC> = {
  "score-card": ScoreCardSkeleton,
  "analysis-panel": AnalysisPanelSkeleton,
  "recommendation-list": RecommendationListSkeleton,
  "resume-panel": ResumePanelSkeleton,
};

/**
 * Reusable loading skeleton for AI components.
 * Matches the approximate layout of the target component to reduce layout shift.
 */
export function AiLoadingSkeleton({ variant, className }: AiLoadingSkeletonProps) {
  const SkeletonComponent = SKELETON_MAP[variant];

  return (
    <div
      className={cn("animate-in fade-in-0 duration-300", className)}
      role="status"
      aria-label="Loading AI content"
    >
      <SkeletonComponent />
      <span className="sr-only">Loading AI content…</span>
    </div>
  );
}
