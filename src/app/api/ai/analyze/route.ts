import { z } from "zod";
import { analyzeProfile } from "@/features/ai/services/aiService";
import { executeAiPost } from "@/features/ai/services/aiRouteService";

const analyzeProfileRequestSchema = z.object({}).strict();

/** POST /api/ai/analyze - generates and stores an authenticated user's profile analysis. */
export async function POST(request: Request) {
  return executeAiPost(request, analyzeProfileRequestSchema, (userId) => analyzeProfile(userId));
}
