import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { getOpenAiClient } from "@/lib/openai/client";
import { ProfileRepository } from "@/features/profile/repositories/profileRepository";
import { AiRepository } from "@/features/ai/repositories/aiRepository";
import {
  bioImprovementResponseSchema,
  professionalSummaryResponseSchema,
  profileAnalysisResponseSchema,
  resumeReviewResponseSchema,
  skillRecommendationsResponseSchema,
} from "@/features/ai/schemas/aiSchemas";
import {
  buildBioImprovementInstructions,
  buildProfileAnalysisInstructions,
  buildResumeReviewInstructions,
  buildSkillRecommendationInstructions,
  buildSummaryInstructions,
} from "@/features/ai/constants/prompts";
import {
  cacheAiResponse,
  createAiCacheKey,
  getCachedAiResponse,
} from "@/features/ai/services/aiCacheService";
import type {
  AiRequestType,
  BioImprovement,
  ProfileAnalysis,
  ProfessionalSummary,
  ResumeReview,
  SkillRecommendation,
} from "@/features/ai/types/Ai";
import type { ProfileWithRelations } from "@/features/profile/repositories/profileRepository";
import type { z } from "zod";

const AI_MODEL = "gpt-5-mini";
const MAX_RETRIES = 3;

/** Base error for AI operations that is safe to surface through API responses. */
export class AiServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiServiceError";
  }
}

/** Converts a profile into bounded, model-ready context. */
function serializeProfile(profile: ProfileWithRelations): string {
  return JSON.stringify({
    displayName: profile.displayName,
    headline: profile.headline,
    bio: profile.bio,
    location: profile.location,
    website: profile.website,
    verificationStatus: profile.verificationStatus,
    skills: profile.skills.map((skill) => ({ name: skill.name, level: skill.level })),
    education: profile.education.map((item) => ({
      institution: item.institution,
      degree: item.degree,
      fieldOfStudy: item.fieldOfStudy,
      startYear: item.startYear,
      endYear: item.endYear,
    })),
    experience: profile.experience.map((item) => ({
      company: item.company,
      role: item.role,
      description: item.description,
      startDate: item.startDate.toISOString(),
      endDate: item.endDate?.toISOString() ?? null,
    })),
    certificates: profile.certificates.map((item) => ({ title: item.title, issuer: item.issuer })),
  });
}

/** Determines whether retrying an OpenAI failure can reasonably succeed. */
function isRetryableOpenAiError(error: unknown): boolean {
  if (error instanceof OpenAI.APIConnectionError) return true;
  if (error instanceof OpenAI.APIError) {
    return (
      error.status === 408 || error.status === 409 || error.status === 429 || error.status >= 500
    );
  }
  return false;
}

/** Waits with bounded exponential backoff before a transient retry. */
async function waitForRetry(attempt: number): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 250 * 2 ** attempt);
  });
}

/** Sends one structured prompt to OpenAI, retrying transient service failures. */
async function generateStructuredResponse<T>(
  operation: string,
  instructions: string,
  schema: z.ZodType<T>
): Promise<{ result: T; tokens: number }> {
  const client = getOpenAiClient();

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    try {
      const response = await client.responses.parse({
        model: AI_MODEL,
        instructions,
        input: "Generate the requested professional guidance.",
        max_output_tokens: 1_500,
        text: { format: zodTextFormat(schema, `${operation}_response`) },
      });

      if (!response.output_parsed) {
        throw new AiServiceError("AI service returned an incomplete response");
      }

      return { result: response.output_parsed, tokens: response.usage?.total_tokens ?? 0 };
    } catch (error: unknown) {
      const canRetry = attempt < MAX_RETRIES - 1 && isRetryableOpenAiError(error);
      if (canRetry) {
        await waitForRetry(attempt);
        continue;
      }

      if (error instanceof AiServiceError) throw error;
      throw new AiServiceError("AI service could not complete the request");
    }
  }

  throw new AiServiceError("AI service could not complete the request");
}

/** Executes an AI operation with validated Redis caching. */
async function getOrGenerate<T>(
  operation: string,
  source: string,
  instructions: string,
  schema: z.ZodType<T>
): Promise<{ result: T; tokens: number }> {
  const cacheKey = createAiCacheKey(operation, source);
  const cached = await getCachedAiResponse(cacheKey, schema);
  if (cached) return { result: cached, tokens: 0 };

  const generated = await generateStructuredResponse(operation, instructions, schema);
  await cacheAiResponse(cacheKey, generated.result);
  return generated;
}

/** Records the non-sensitive operational outcome of an AI request. */
async function recordAiRequest(
  userId: string,
  requestType: AiRequestType,
  startedAt: number,
  tokens: number,
  success: boolean
): Promise<void> {
  await AiRepository.createRequest({
    userId,
    model: `${AI_MODEL}:${requestType}`,
    tokens,
    responseTime: Date.now() - startedAt,
    success,
  });
}

/** Loads the caller-owned profile or returns a safe feature-level error. */
async function requireProfile(userId: string): Promise<ProfileWithRelations> {
  const profile = await ProfileRepository.findByUserId(userId);
  if (!profile) throw new AiServiceError("Create a profile before requesting AI guidance");
  return profile;
}

/** Generates, stores, and returns a complete profile analysis. */
export async function analyzeProfile(userId: string): Promise<ProfileAnalysis> {
  const startedAt = Date.now();
  try {
    const profile = await requireProfile(userId);
    const source = serializeProfile(profile);
    const { result, tokens } = await getOrGenerate(
      "profile-analysis",
      source,
      buildProfileAnalysisInstructions(source),
      profileAnalysisResponseSchema
    );

    await Promise.all([
      AiRepository.createAnalysis({
        profileId: profile.id,
        score: result.score,
        summary: result.summary,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        recommendations: result.recommendations,
      }),
      AiRepository.updateProfileScore(profile.id, result.score),
      recordAiRequest(userId, "analysis", startedAt, tokens, true),
    ]);
    return result;
  } catch (error: unknown) {
    await recordAiRequest(userId, "analysis", startedAt, 0, false);
    if (error instanceof AiServiceError) throw error;
    throw new AiServiceError("Unable to analyze this profile");
  }
}

/** Improves submitted biography text without changing the profile automatically. */
export async function improveBio(userId: string, bio: string): Promise<BioImprovement> {
  return runTextOperation(
    userId,
    "bio-improvement",
    bio,
    buildBioImprovementInstructions(bio),
    bioImprovementResponseSchema
  );
}

/** Creates a professional profile summary from the caller's current profile. */
export async function generateProfessionalSummary(userId: string): Promise<ProfessionalSummary> {
  const profile = await requireProfile(userId);
  const source = serializeProfile(profile);
  return runTextOperation(
    userId,
    "summary",
    source,
    buildSummaryInstructions(source),
    professionalSummaryResponseSchema
  );
}

/** Reviews user-supplied resume text. */
export async function reviewResume(userId: string, resumeText: string): Promise<ResumeReview> {
  return runTextOperation(
    userId,
    "resume-review",
    resumeText,
    buildResumeReviewInstructions(resumeText),
    resumeReviewResponseSchema
  );
}

/** Recommends skills based on the caller's current profile. */
export async function recommendSkills(userId: string): Promise<SkillRecommendation[]> {
  const profile = await requireProfile(userId);
  const source = serializeProfile(profile);
  const result = await runTextOperation(
    userId,
    "skills",
    source,
    buildSkillRecommendationInstructions(source),
    skillRecommendationsResponseSchema
  );
  return result.recommendations;
}

/** Retrieves previously saved profile analyses for the caller-owned profile. */
export async function getAnalysisHistory(userId: string, limit: number) {
  const profile = await requireProfile(userId);
  return AiRepository.findAnalyses(profile.id, limit);
}

/** Runs a non-persisted text operation and records its request outcome. */
async function runTextOperation<T>(
  userId: string,
  operation: AiRequestType,
  source: string,
  instructions: string,
  schema: z.ZodType<T>
): Promise<T> {
  const startedAt = Date.now();
  try {
    const { result, tokens } = await getOrGenerate(operation, source, instructions, schema);
    await recordAiRequest(userId, operation, startedAt, tokens, true);
    return result;
  } catch (error: unknown) {
    await recordAiRequest(userId, operation, startedAt, 0, false);
    if (error instanceof AiServiceError) throw error;
    throw new AiServiceError("Unable to complete the AI request");
  }
}
