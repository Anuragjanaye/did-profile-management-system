"use client";

import { type ComponentType } from "react";
import {
  Activity,
  PencilLine,
  Wrench,
  Briefcase,
  GraduationCap,
  BrainCircuit,
  Cloud,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/features/dashboard/components/EmptyState";
import { formatRelativeTime } from "@/utils/formatDate";
import type { DashboardActivity } from "@/features/dashboard/types/Dashboard";

interface ActivityCardProps {
  activity: DashboardActivity[];
}

/** Lists recent workspace activity logs inside a timeline component. */
export function ActivityCard({ activity }: ActivityCardProps) {
  // Map database action names to semantic details & icons
  const getActionConfig = (actionName: string): { icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>; color: string } => {
    const action = actionName.toLowerCase();
    if (action.includes("profile")) return { icon: PencilLine, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
    if (action.includes("skill")) return { icon: Wrench, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" };
    if (action.includes("experience")) return { icon: Briefcase, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" };
    if (action.includes("education")) return { icon: GraduationCap, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    if (action.includes("ai")) return { icon: BrainCircuit, color: "text-violet-500 bg-violet-500/10 border-violet-500/20" };
    if (action.includes("upload")) return { icon: Cloud, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
    return { icon: Activity, color: "text-primary bg-primary/10 border-primary/20" };
  };

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="size-5 text-primary animate-pulse" />
          Recent Activity Timeline
        </CardTitle>
        <CardDescription>Auditable record of changes in your identity workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        {activity.length ? (
          <div className="relative pl-6 space-y-6 before:absolute before:inset-y-1 before:left-[11px] before:w-0.5 before:bg-border/60">
            {activity.slice(0, 5).map((entry) => {
              const config = getActionConfig(entry.action);
              const Icon = config.icon;
              return (
                <div key={entry.id} className="relative group">
                  {/* Timeline point */}
                  <span className={`absolute -left-[24px] top-1.5 size-[18px] rounded-full border flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${config.color}`}>
                    <Icon className="size-2.5" aria-hidden="true" />
                  </span>
                  
                  <div className="min-w-0">
                    <p className="text-sm font-semibold capitalize tracking-wide text-foreground/90">
                      {entry.action.replaceAll("_", " ")}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {formatRelativeTime(entry.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={Activity} message="Your account activity will appear here." />
        )}
      </CardContent>
    </Card>
  );
}
