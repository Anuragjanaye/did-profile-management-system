"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiSuccess, ApiError as ApiErrorType } from "@/types/api";
import type { ProfileAnalysis } from "@/features/ai/types/Ai";
import type { AIAnalysis } from "@prisma/client";

const AI_ANALYSIS_KEY = ["ai", "analysis"] as const;
const AI_HISTORY_KEY = ["ai", "history"] as const;

/** Typed fetch helper that rejects on API-level failures. */
async function fetchAiEndpoint<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  const body = (await response.json()) as ApiSuccess<T> | ApiErrorType;

  if (!body.success) {
    throw new Error(body.error.message);
  }

  return body.data;
}

/**
 * Mutation hook for POST /api/ai/analyze.
 * Triggers a full profile analysis, invalidates history cache on success,
 * and surfaces status through toast notifications.
 */
export function useAnalyzeProfile() {
  const queryClient = useQueryClient();

  return useMutation<ProfileAnalysis, Error>({
    mutationFn: () =>
      fetchAiEndpoint<ProfileAnalysis>("/api/ai/analyze", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_HISTORY_KEY });
      toast.success("Profile analysis complete");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Query hook for GET /api/ai/history.
 * Fetches the authenticated user's saved AI analyses with a configurable limit.
 */
export function useAnalysisHistory(limit: number = 10) {
  return useQuery<AIAnalysis[], Error>({
    queryKey: [...AI_HISTORY_KEY, limit],
    queryFn: () => fetchAiEndpoint<AIAnalysis[]>(`/api/ai/history?limit=${limit}`),
    staleTime: 60_000,
  });
}

export { AI_ANALYSIS_KEY, AI_HISTORY_KEY };
