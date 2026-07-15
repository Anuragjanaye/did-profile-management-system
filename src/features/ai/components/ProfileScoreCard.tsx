"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { Brain, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AiLoadingSkeleton } from "@/features/ai/components/AiLoadingSkeleton";
import { useAnalyzeProfile } from "@/features/ai/hooks/useAiAnalysis";
import { cn } from "@/lib/utils";

import type { ProfileAnalysis } from "@/features/ai/types/Ai";

interface ProfileScoreCardProps {
  /** Current profile score from the database (0–100 or null if never analyzed). */
  initialScore: number | null;
  className?: string;
  onAnalysisComplete?: (analysis: ProfileAnalysis) => void;
}

/** Maps score ranges to semantic color tokens. */
function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

/** Maps score ranges to track stroke colors for the SVG ring. */
function getTrackColor(score: number): string {
  if (score >= 80) return "stroke-emerald-500/20";
  if (score >= 50) return "stroke-amber-500/20";
  return "stroke-red-500/20";
}

/** Maps score ranges to active stroke colors for the SVG ring. */
function getStrokeColor(score: number): string {
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 50) return "stroke-amber-500";
  return "stroke-red-500";
}

/** SVG circle circumference for the progress ring (radius 42). */
const CIRCUMFERENCE = 2 * Math.PI * 42;

/**
 * Displays the AI-generated profile score in a radial progress ring.
 * Provides an "Analyze" button that triggers a full profile analysis via mutation.
 */
export function ProfileScoreCard({
  initialScore,
  className,
  onAnalysisComplete,
}: ProfileScoreCardProps) {
  const { mutate, data, isPending } = useAnalyzeProfile();
  const displayScore = data?.score ?? initialScore;

  const handleAnalyze = useCallback(() => {
    mutate(undefined, {
      onSuccess: (result) => {
        onAnalysisComplete?.(result);
      },
    });
  }, [mutate, onAnalysisComplete]);

  if (isPending) {
    return <AiLoadingSkeleton variant="score-card" className={className} />;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="size-5 text-primary" aria-hidden="true" />
          Profile Score
        </CardTitle>
        <CardDescription>AI-generated assessment of your profile quality</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4">
        {displayScore !== null && displayScore !== undefined ? (
          <motion.div
            className="relative flex size-28 items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              className="-rotate-90"
              width="112"
              height="112"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="8"
                className={getTrackColor(displayScore)}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className={getStrokeColor(displayScore)}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{
                  strokeDashoffset: CIRCUMFERENCE - (displayScore / 100) * CIRCUMFERENCE,
                }}
                style={{ strokeDasharray: CIRCUMFERENCE }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
            <span
              className={cn("absolute text-3xl font-bold tabular-nums", getScoreColor(displayScore))}
              aria-label={`Profile score: ${displayScore} out of 100`}
            >
              {displayScore}
            </span>
          </motion.div>
        ) : (
          <div className="flex size-28 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/25">
            <span className="text-sm text-muted-foreground">No score</span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyze}
          disabled={isPending}
          aria-label="Analyze profile with AI"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          {displayScore !== null && displayScore !== undefined ? "Re-analyze" : "Analyze Profile"}
        </Button>
      </CardContent>
    </Card>
  );
}
