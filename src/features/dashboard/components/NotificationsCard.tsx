"use client";

import { type ComponentType } from "react";
import { Bell, CheckCircle2, AlertTriangle, CircleAlert, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/features/dashboard/components/EmptyState";
import { formatRelativeTime } from "@/utils/formatDate";
import type { DashboardNotification } from "@/features/dashboard/types/Dashboard";

interface NotificationsCardProps {
  notifications: DashboardNotification[];
}

/** Lists the user's latest workspace notifications/system logs. */
export function NotificationsCard({ notifications }: NotificationsCardProps) {
  // Mapping notification types to semantic styles
  const getNotificationStyles = (type: string): { icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>; textClass: string; bgClass: string } => {
    switch (type) {
      case "SUCCESS":
        return { icon: CheckCircle2, textClass: "text-emerald-500", bgClass: "bg-emerald-500/10 border-emerald-500/20" };
      case "WARNING":
        return { icon: AlertTriangle, textClass: "text-amber-500", bgClass: "bg-amber-500/10 border-amber-500/20" };
      case "ERROR":
        return { icon: CircleAlert, textClass: "text-red-500", bgClass: "bg-red-500/10 border-red-500/20" };
      default:
        return { icon: Info, textClass: "text-blue-500", bgClass: "bg-blue-500/10 border-blue-500/20" };
    }
  };

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg">Workspace Logs</CardTitle>
          <CardDescription className="mt-1">Latest messages and system events</CardDescription>
        </div>
        <div className="relative p-1.5 rounded-full bg-muted/40 border border-border/30">
          <Bell className="text-muted-foreground size-4" aria-hidden="true" />
          {notifications.some((n) => !n.read) && (
            <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-primary animate-ping" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length ? (
          <ol className="space-y-4">
            {notifications.slice(0, 4).map((notification) => {
              const styles = getNotificationStyles(notification.type);
              const Icon = styles.icon;
              return (
                <li
                  key={notification.id}
                  className="flex gap-3 border-b border-border/20 pb-3 last:border-0 last:pb-0 relative group"
                >
                  <div className={`p-1.5 rounded-lg border shrink-0 h-fit ${styles.bgClass}`}>
                    <Icon className={`size-3.5 ${styles.textClass}`} aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold tracking-wide text-foreground/90">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="size-1.5 rounded-full bg-primary shrink-0" aria-label="Unread" />
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs leading-normal">
                      {notification.message}
                    </p>
                    <p className="text-muted-foreground/80 mt-1 text-[10px] font-mono">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <EmptyState icon={Bell} message="You are all caught up." />
        )}
      </CardContent>
    </Card>
  );
}
