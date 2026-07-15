"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AiLoadingSkeleton } from "@/features/ai/components/AiLoadingSkeleton";
import { useRecommendSkills } from "@/features/ai/hooks/useAiSuggestions";
import { cn } from "@/lib/utils";
import type { SkillRecommendation } from "@/features/ai/types/Ai";

interface SkillRecommendationListProps {
  /** Callback when the user adds a recommended skill to their profile. */
  onAddSkill?: (skillName: string) => void;
  className?: string;
}

/** Maps priority levels to badge variants and color classes. */
function getPriorityStyles(priority: SkillRecommendation["priority"]): {
  variant: "default" | "secondary" | "outline";
  className: string;
} {
  switch (priority) {
    case "high":
      return { variant: "default", className: "bg-emerald-500/10 text-emerald-600" };
    case "medium":
      return { variant: "secondary", className: "bg-amber-500/10 text-amber-600" };
    case "low":
      return { variant: "outline", className: "bg-muted text-muted-foreground" };
  }
}

/**
 * Displays AI-recommended skills with priority badges and rationale.
 * Each skill can be added to the profile or dismissed.
 */
export function SkillRecommendationList({
  onAddSkill,
  className,
}: SkillRecommendationListProps) {
  const { mutate, data, isPending } = useRecommendSkills();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleDismiss = useCallback((name: string) => {
    setDismissed((prev) => new Set(prev).add(name));
  }, []);

  const handleAdd = useCallback(
    (name: string) => {
      onAddSkill?.(name);
      setDismissed((prev) => new Set(prev).add(name));
    },
    [onAddSkill]
  );

  if (isPending) {
    return <AiLoadingSkeleton variant="recommendation-list" className={className} />;
  }

  const visibleSkills = data?.filter((skill) => !dismissed.has(skill.name)) ?? [];

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5 text-primary" aria-hidden="true" />
          Skill Recommendations
        </CardTitle>
        <CardDescription>
          AI-suggested skills based on your profile
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {!data ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <p className="text-sm text-muted-foreground">
              Discover skills that complement your experience
            </p>
            <Button onClick={() => mutate()} disabled={isPending}>
              <Zap className="size-4" aria-hidden="true" />
              Get Recommendations
            </Button>
          </div>
        ) : visibleSkills.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <p className="text-sm text-muted-foreground">All recommendations have been handled</p>
            <Button variant="outline" size="sm" onClick={() => mutate()}>
              Refresh Recommendations
            </Button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <ul className="flex flex-col gap-2" role="list">
              {visibleSkills.map((skill) => {
                const priority = getPriorityStyles(skill.priority);

                return (
                  <motion.li
                    key={skill.name}
                    className="group flex items-start gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-muted-foreground/10 hover:bg-muted/30"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    layout
                  >
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        <Badge variant={priority.variant} className={priority.className}>
                          {skill.priority}
                        </Badge>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {skill.rationale}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {onAddSkill && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleAdd(skill.name)}
                          aria-label={`Add ${skill.name} to profile`}
                        >
                          <Plus className="size-3 text-emerald-500" aria-hidden="true" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleDismiss(skill.name)}
                        aria-label={`Dismiss ${skill.name}`}
                      >
                        <X className="size-3 text-muted-foreground" aria-hidden="true" />
                      </Button>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}
