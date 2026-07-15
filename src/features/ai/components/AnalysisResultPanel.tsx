"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  AlertCircle,
  SpellCheck,
  Copy,
  Check,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AiLoadingSkeleton } from "@/features/ai/components/AiLoadingSkeleton";
import { cn } from "@/lib/utils";
import type { ProfileAnalysis } from "@/features/ai/types/Ai";

interface AnalysisResultPanelProps {
  /** The analysis result to display. */
  analysis: ProfileAnalysis | null;
  /** Whether the analysis request is in progress. */
  isLoading: boolean;
  className?: string;
}

interface SuggestionItemProps {
  text: string;
  onAccept?: (text: string) => void;
  onDismiss?: (text: string) => void;
}

/** A single actionable suggestion row with copy, accept, and dismiss controls. */
function SuggestionItem({ text, onAccept, onDismiss }: SuggestionItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <motion.li
      className="group flex items-start gap-2 rounded-lg p-2 transition-colors hover:bg-muted/50"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      layout
    >
      <span className="flex-1 text-sm text-foreground/90">{text}</span>
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          aria-label="Copy suggestion"
        >
          {copied ? (
            <Check className="size-3 text-emerald-500" aria-hidden="true" />
          ) : (
            <Copy className="size-3" aria-hidden="true" />
          )}
        </Button>
        {onAccept && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onAccept(text)}
            aria-label="Accept suggestion"
          >
            <CheckCircle2 className="size-3 text-emerald-500" aria-hidden="true" />
          </Button>
        )}
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDismiss(text)}
            aria-label="Dismiss suggestion"
          >
            <AlertCircle className="size-3 text-muted-foreground" aria-hidden="true" />
          </Button>
        )}
      </div>
    </motion.li>
  );
}

interface SectionConfig {
  key: keyof Pick<
    ProfileAnalysis,
    "strengths" | "weaknesses" | "recommendations" | "missingInformation" | "grammarSuggestions"
  >;
  label: string;
  icon: React.ReactNode;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
}

const SECTIONS: SectionConfig[] = [
  {
    key: "strengths",
    label: "Strengths",
    icon: <CheckCircle2 className="size-4 text-emerald-500" aria-hidden="true" />,
    badgeVariant: "default",
  },
  {
    key: "weaknesses",
    label: "Weaknesses",
    icon: <AlertTriangle className="size-4 text-amber-500" aria-hidden="true" />,
    badgeVariant: "destructive",
  },
  {
    key: "recommendations",
    label: "Recommendations",
    icon: <Lightbulb className="size-4 text-blue-500" aria-hidden="true" />,
    badgeVariant: "secondary",
  },
  {
    key: "missingInformation",
    label: "Missing Information",
    icon: <AlertCircle className="size-4 text-red-500" aria-hidden="true" />,
    badgeVariant: "destructive",
  },
  {
    key: "grammarSuggestions",
    label: "Grammar",
    icon: <SpellCheck className="size-4 text-purple-500" aria-hidden="true" />,
    badgeVariant: "outline",
  },
];

/**
 * Displays a complete profile analysis with collapsible sections
 * for strengths, weaknesses, recommendations, missing information,
 * and grammar suggestions. Each item supports copy, accept, and dismiss.
 */
export function AnalysisResultPanel({
  analysis,
  isLoading,
  className,
}: AnalysisResultPanelProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleDismiss = useCallback((text: string) => {
    setDismissed((prev) => new Set(prev).add(text));
  }, []);

  if (isLoading) {
    return <AiLoadingSkeleton variant="analysis-panel" className={className} />;
  }

  if (!analysis) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-muted-foreground/25 p-8",
          className
        )}
      >
        <Lightbulb className="size-8 text-muted-foreground/50" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Run an analysis to see AI-powered suggestions
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="rounded-lg bg-muted/30 p-4">
        <p className="text-sm leading-relaxed text-foreground/80">{analysis.summary}</p>
      </div>

      <Accordion>
        {SECTIONS.map((section) => {
          const items = analysis[section.key].filter((item) => !dismissed.has(item));
          if (items.length === 0) return null;

          return (
            <AccordionItem key={section.key} value={section.key}>
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  {section.icon}
                  <span>{section.label}</span>
                  <Badge variant={section.badgeVariant} className="ml-1">
                    {items.length}
                  </Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <AnimatePresence mode="popLayout">
                  <ul className="flex flex-col gap-1" role="list">
                    {items.map((item) => (
                      <SuggestionItem
                        key={item}
                        text={item}
                        onDismiss={handleDismiss}
                      />
                    ))}
                  </ul>
                </AnimatePresence>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
