"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Renders a navigation panel containing shortcuts to core workspace views. */
export function QuickActionsCard() {
  const actions = [
    { label: "Edit Profile Details", href: "/profile/edit", tab: "info" },
    { label: "Analyze with AI", href: "/profile/edit", tab: "ai" },
    { label: "Recommend Skills", href: "/profile/edit", tab: "ai" },
    { label: "Review Resume Text", href: "/profile/edit", tab: "ai" },
  ];

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Shortcut shortcuts for identity building</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((act) => (
          <Link
            key={act.label}
            href={`${act.href}?tab=${act.tab}`}
            className="flex items-center justify-between border border-border/40 bg-muted/10 hover:bg-muted/40 text-xs font-semibold px-3 py-2 rounded-lg transition-colors group"
          >
            <span>{act.label}</span>
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
