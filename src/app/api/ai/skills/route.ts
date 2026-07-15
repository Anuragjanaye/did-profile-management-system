import { z } from "zod";
import { recommendSkills } from "@/features/ai/services/aiService";
import { executeAiPost } from "@/features/ai/services/aiRouteService";

const skillsRequestSchema = z.object({}).strict();

/** POST /api/ai/skills - recommends skills from the current profile. */
export async function POST(request: Request) {
  return executeAiPost(request, skillsRequestSchema, (userId) => recommendSkills(userId));
}
