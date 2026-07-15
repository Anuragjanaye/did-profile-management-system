import { z } from "zod";

const boundedText = (maximum: number) => z.string().trim().min(1).max(maximum);

export const improveBioRequestSchema = z.object({
  bio: boundedText(500),
});

export const resumeReviewRequestSchema = z.object({
  resumeText: boundedText(20_000),
});

export const historyQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const profileAnalysisResponseSchema = z.object({
  score: z.number().int().min(0).max(100),
  summary: boundedText(1_000),
  strengths: z.array(boundedText(250)).max(8),
  weaknesses: z.array(boundedText(250)).max(8),
  recommendations: z.array(boundedText(250)).max(10),
  missingInformation: z.array(boundedText(250)).max(8),
  grammarSuggestions: z.array(boundedText(250)).max(8),
});

export const bioImprovementResponseSchema = z.object({
  improvedBio: boundedText(600),
  changes: z.array(boundedText(250)).max(6),
});

export const professionalSummaryResponseSchema = z.object({
  summary: boundedText(600),
});

export const resumeReviewResponseSchema = z.object({
  overallAssessment: boundedText(1_000),
  strengths: z.array(boundedText(250)).max(8),
  improvements: z.array(boundedText(250)).max(10),
  keywordSuggestions: z.array(boundedText(100)).max(15),
  rewrittenHighlights: z.array(boundedText(350)).max(6),
});

export const skillRecommendationsResponseSchema = z.object({
  recommendations: z
    .array(
      z.object({
        name: boundedText(100),
        rationale: boundedText(250),
        priority: z.enum(["high", "medium", "low"]),
      })
    )
    .max(10),
});
