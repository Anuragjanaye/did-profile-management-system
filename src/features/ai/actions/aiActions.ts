"use server";

import { auth } from "@/lib/auth/authConfig";
import { UserRepository } from "@/features/auth/repositories/userRepository";
import { limitAiRequest, AiRateLimitError } from "@/features/ai/services/aiRateLimitService";
import { AiServiceError } from "@/features/ai/services/aiService";
import {
  analyzeProfile,
  improveBio,
  generateProfessionalSummary,
  reviewResume,
  recommendSkills,
  getAnalysisHistory,
} from "@/features/ai/services/aiService";
import { improveBioRequestSchema, resumeReviewRequestSchema } from "@/features/ai/schemas/aiSchemas";
import type {
  ProfileAnalysis,
  BioImprovement,
  ProfessionalSummary,
  ResumeReview,
  SkillRecommendation,
} from "@/features/ai/types/Ai";
import type { AIAnalysis } from "@prisma/client";

/** Structured result for Server Action callers that cannot catch thrown errors cleanly. */
interface ActionSuccess<T> {
  success: true;
  data: T;
}

interface ActionFailure {
  success: false;
  error: string;
}

type ActionResult<T> = ActionSuccess<T> | ActionFailure;

/** Resolves the authenticated user ID or returns a failure result. */
async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.walletAddress) {
    throw new AiActionError("Authentication is required");
  }

  const user = await UserRepository.findByWalletAddress(session.user.walletAddress);
  if (!user) {
    throw new AiActionError("User account not found");
  }

  return user.id;
}

/** Server Action error class that carries a user-safe message. */
class AiActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiActionError";
  }
}

/** Converts caught exceptions into a safe failure result. */
function toFailure(error: unknown): ActionFailure {
  if (error instanceof AiActionError) {
    return { success: false, error: error.message };
  }
  if (error instanceof AiRateLimitError) {
    return { success: false, error: error.message };
  }
  if (error instanceof AiServiceError) {
    return { success: false, error: error.message };
  }
  return { success: false, error: "An unexpected error occurred" };
}

/** Server Action: Analyze the authenticated user's profile. */
export async function analyzeProfileAction(): Promise<ActionResult<ProfileAnalysis>> {
  try {
    const userId = await requireUserId();
    await limitAiRequest(userId);
    const data = await analyzeProfile(userId);
    return { success: true, data };
  } catch (error: unknown) {
    return toFailure(error);
  }
}

/** Server Action: Improve a biography text. */
export async function improveBioAction(bio: string): Promise<ActionResult<BioImprovement>> {
  try {
    const userId = await requireUserId();
    await limitAiRequest(userId);
    const validated = improveBioRequestSchema.parse({ bio });
    const data = await improveBio(userId, validated.bio);
    return { success: true, data };
  } catch (error: unknown) {
    return toFailure(error);
  }
}

/** Server Action: Generate a professional summary from the current profile. */
export async function generateSummaryAction(): Promise<ActionResult<ProfessionalSummary>> {
  try {
    const userId = await requireUserId();
    await limitAiRequest(userId);
    const data = await generateProfessionalSummary(userId);
    return { success: true, data };
  } catch (error: unknown) {
    return toFailure(error);
  }
}

/** Server Action: Review user-supplied resume text. */
export async function reviewResumeAction(resumeText: string): Promise<ActionResult<ResumeReview>> {
  try {
    const userId = await requireUserId();
    await limitAiRequest(userId);
    const validated = resumeReviewRequestSchema.parse({ resumeText });
    const data = await reviewResume(userId, validated.resumeText);
    return { success: true, data };
  } catch (error: unknown) {
    return toFailure(error);
  }
}

/** Server Action: Recommend skills based on the current profile. */
export async function recommendSkillsAction(): Promise<ActionResult<SkillRecommendation[]>> {
  try {
    const userId = await requireUserId();
    await limitAiRequest(userId);
    const data = await recommendSkills(userId);
    return { success: true, data };
  } catch (error: unknown) {
    return toFailure(error);
  }
}

/** Server Action: Retrieve saved analysis history. */
export async function getAnalysisHistoryAction(
  limit: number = 10
): Promise<ActionResult<AIAnalysis[]>> {
  try {
    const userId = await requireUserId();
    const clampedLimit = Math.max(1, Math.min(limit, 50));
    const data = await getAnalysisHistory(userId, clampedLimit);
    return { success: true, data };
  } catch (error: unknown) {
    return toFailure(error);
  }
}
