import { improveBioRequestSchema } from "@/features/ai/schemas/aiSchemas";
import { improveBio } from "@/features/ai/services/aiService";
import { executeAiPost } from "@/features/ai/services/aiRouteService";

/** POST /api/ai/improve - improves submitted biography text without changing the profile. */
export async function POST(request: Request) {
  return executeAiPost(request, improveBioRequestSchema, (userId, input) =>
    improveBio(userId, input.bio)
  );
}
