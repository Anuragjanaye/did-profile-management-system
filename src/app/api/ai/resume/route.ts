import { resumeReviewRequestSchema } from "@/features/ai/schemas/aiSchemas";
import { reviewResume } from "@/features/ai/services/aiService";
import { executeAiPost } from "@/features/ai/services/aiRouteService";

/** POST /api/ai/resume - reviews authenticated user-supplied resume text. */
export async function POST(request: Request) {
  return executeAiPost(request, resumeReviewRequestSchema, (userId, input) =>
    reviewResume(userId, input.resumeText)
  );
}
