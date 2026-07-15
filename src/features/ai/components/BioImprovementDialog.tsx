"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Check, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AiLoadingSkeleton } from "@/features/ai/components/AiLoadingSkeleton";
import { useImproveBio } from "@/features/ai/hooks/useAiSuggestions";
import { cn } from "@/lib/utils";

interface BioImprovementDialogProps {
  /** The current biography text to improve. */
  currentBio: string;
  /** Callback when the user accepts the improved biography. */
  onAccept: (improvedBio: string) => void;
  /** Callback to close the dialog. */
  onClose: () => void;
  className?: string;
}

/**
 * Inline panel for bio improvement flow.
 * Shows original vs improved side-by-side, lists changes made,
 * and provides Accept/Reject/Regenerate actions.
 */
export function BioImprovementDialog({
  currentBio,
  onAccept,
  onClose,
  className,
}: BioImprovementDialogProps) {
  const { mutate, data, isPending, reset } = useImproveBio();
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    mutate({ bio: currentBio });
  }, [mutate, currentBio]);

  const handleRegenerate = useCallback(() => {
    reset();
    mutate({ bio: currentBio });
  }, [mutate, reset, currentBio]);

  const handleCopy = useCallback(async () => {
    if (!data?.improvedBio) return;
    await navigator.clipboard.writeText(data.improvedBio);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [data]);

  const handleAccept = useCallback(() => {
    if (data?.improvedBio) {
      onAccept(data.improvedBio);
    }
  }, [data, onAccept]);

  if (isPending) {
    return <AiLoadingSkeleton variant="analysis-panel" className={className} />;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-5 text-primary" aria-hidden="true" />
            Bio Improvement
          </CardTitle>
          <Button variant="ghost" size="icon-xs" onClick={onClose} aria-label="Close">
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {!data ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <p className="text-sm text-muted-foreground">
              Let AI enhance your biography while preserving your voice
            </p>
            <Button onClick={handleGenerate} disabled={isPending}>
              <Sparkles className="size-4" aria-hidden="true" />
              Improve Biography
            </Button>
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Badge variant="outline" className="w-fit">
                  Original
                </Badge>
                <div className="rounded-lg border border-muted-foreground/15 bg-muted/20 p-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">{currentBio}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant="default" className="w-fit">
                  Improved
                </Badge>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <p className="text-sm leading-relaxed text-foreground">{data.improvedBio}</p>
                </div>
              </div>
            </div>

            {data.changes.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">Changes Made</span>
                <ul className="flex flex-col gap-1" role="list">
                  {data.changes.map((change) => (
                    <li
                      key={change}
                      className="flex items-start gap-2 text-xs text-foreground/70"
                    >
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleAccept} aria-label="Accept improved biography">
                <Check className="size-4" aria-hidden="true" />
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={isPending}
                aria-label="Regenerate biography improvement"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Regenerate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                aria-label="Copy improved biography"
              >
                {copied ? (
                  <Check className="size-4 text-emerald-500" aria-hidden="true" />
                ) : (
                  <Copy className="size-4" aria-hidden="true" />
                )}
                Copy
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
