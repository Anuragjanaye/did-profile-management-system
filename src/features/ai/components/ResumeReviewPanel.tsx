"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Copy, Check, CheckCircle2, AlertTriangle, Hash, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { AiLoadingSkeleton } from "@/features/ai/components/AiLoadingSkeleton";
import { useReviewResume } from "@/features/ai/hooks/useAiSuggestions";
import { cn } from "@/lib/utils";

interface ResumeReviewPanelProps {
  className?: string;
}

/** Keyword badge with copy support. */
function KeywordBadge({ keyword }: { keyword: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(keyword);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [keyword]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group inline-flex items-center gap-1 rounded-full border border-muted-foreground/15 bg-muted/40 px-2.5 py-1 text-xs text-foreground/80 transition-colors hover:border-primary/30 hover:bg-primary/5"
      aria-label={`Copy keyword: ${keyword}`}
    >
      {copied ? (
        <Check className="size-3 text-emerald-500" aria-hidden="true" />
      ) : (
        <Hash className="size-3 text-muted-foreground" aria-hidden="true" />
      )}
      {keyword}
    </button>
  );
}

/**
 * Resume review panel with textarea input and structured results.
 * Displays overall assessment, strengths, improvements, keyword suggestions,
 * and rewritten highlights with copy support.
 */
export function ResumeReviewPanel({ className }: ResumeReviewPanelProps) {
  const { mutate, data, isPending } = useReviewResume();
  const [resumeText, setResumeText] = useState("");

  const handleSubmit = useCallback(() => {
    if (resumeText.trim().length === 0) return;
    mutate({ resumeText: resumeText.trim() });
  }, [mutate, resumeText]);

  if (isPending) {
    return <AiLoadingSkeleton variant="resume-panel" className={className} />;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5 text-primary" aria-hidden="true" />
          Resume Review
        </CardTitle>
        <CardDescription>Paste your resume text for AI-powered feedback</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <textarea
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste your resume content here..."
            rows={6}
            maxLength={20_000}
            className="w-full resize-y rounded-lg border border-muted-foreground/15 bg-muted/10 p-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Resume text input"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {resumeText.length.toLocaleString()} / 20,000 characters
            </span>
            <Button
              onClick={handleSubmit}
              disabled={isPending || resumeText.trim().length === 0}
              size="sm"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Review Resume
            </Button>
          </div>
        </div>

        {data && (
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="rounded-lg bg-muted/30 p-4">
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Overall Assessment
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80">
                {data.overallAssessment}
              </p>
            </div>

            <Accordion>
              {data.strengths.length > 0 && (
                <AccordionItem value="strengths">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-500" aria-hidden="true" />
                      Strengths
                      <Badge variant="default">{data.strengths.length}</Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex flex-col gap-1.5" role="list">
                      {data.strengths.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}

              {data.improvements.length > 0 && (
                <AccordionItem value="improvements">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="size-4 text-amber-500" aria-hidden="true" />
                      Improvements
                      <Badge variant="secondary">{data.improvements.length}</Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex flex-col gap-1.5" role="list">
                      {data.improvements.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}

              {data.rewrittenHighlights.length > 0 && (
                <AccordionItem value="highlights">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <Sparkles className="size-4 text-blue-500" aria-hidden="true" />
                      Rewritten Highlights
                      <Badge variant="outline">{data.rewrittenHighlights.length}</Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex flex-col gap-2" role="list">
                      {data.rewrittenHighlights.map((item) => (
                        <RewrittenHighlightItem key={item} text={item} />
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {data.keywordSuggestions.length > 0 && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Keyword Suggestions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.keywordSuggestions.map((keyword) => (
                    <KeywordBadge key={keyword} keyword={keyword} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

/** A single rewritten highlight item with copy-to-clipboard. */
function RewrittenHighlightItem({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <li className="group flex items-start gap-2 rounded-lg p-2 transition-colors hover:bg-muted/30">
      <p className="flex-1 text-sm leading-relaxed text-foreground/80">{text}</p>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={handleCopy}
        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Copy highlight"
      >
        {copied ? (
          <Check className="size-3 text-emerald-500" aria-hidden="true" />
        ) : (
          <Copy className="size-3" aria-hidden="true" />
        )}
      </Button>
    </li>
  );
}
