"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiSuccess, ApiError as ApiErrorType } from "@/types/api";
import type {
  BioImprovement,
  ProfessionalSummary,
  ResumeReview,
  SkillRecommendation,
} from "@/features/ai/types/Ai";

/** Typed fetch helper that rejects on API-level failures. */
async function postAiEndpoint<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as ApiSuccess<T> | ApiErrorType;

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}

/**
 * Mutation hook for POST /api/ai/improve.
 * Sends a biography for AI improvement and returns the enhanced version.
 */
export function useImproveBio() {
  return useMutation<BioImprovement, Error, { bio: string }>({
    mutationFn: (variables) =>
      postAiEndpoint<BioImprovement>("/api/ai/improve", { bio: variables.bio }),
    onSuccess: () => {
      toast.success("Biography improved");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Mutation hook for POST /api/ai/summary.
 * Generates a professional summary from the current profile.
 */
export function useGenerateSummary() {
  return useMutation<ProfessionalSummary, Error>({
    mutationFn: () => postAiEndpoint<ProfessionalSummary>("/api/ai/summary", {}),
    onSuccess: () => {
      toast.success("Professional summary generated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Mutation hook for POST /api/ai/resume.
 * Reviews user-supplied resume text for actionable improvements.
 */
export function useReviewResume() {
  return useMutation<ResumeReview, Error, { resumeText: string }>({
    mutationFn: (variables) =>
      postAiEndpoint<ResumeReview>("/api/ai/resume", { resumeText: variables.resumeText }),
    onSuccess: () => {
      toast.success("Resume review complete");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Mutation hook for POST /api/ai/skills.
 * Recommends skills that complement the current profile.
 */
export function useRecommendSkills() {
  return useMutation<SkillRecommendation[], Error>({
    mutationFn: () => postAiEndpoint<SkillRecommendation[]>("/api/ai/skills", {}),
    onSuccess: () => {
      toast.success("Skill recommendations ready");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
