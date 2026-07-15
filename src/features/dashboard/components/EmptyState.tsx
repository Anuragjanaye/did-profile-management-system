"use client";

import type { ComponentType } from "react";

interface EmptyStateProps {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  message: string;
}

/** Renders a consistent, accessible empty state for dashboard lists. */
export function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <span className="bg-muted/30 border border-border/40 text-muted-foreground/85 grid size-12 place-items-center rounded-2xl">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="text-muted-foreground mt-4 text-xs font-semibold">{message}</p>
    </div>
  );
}
