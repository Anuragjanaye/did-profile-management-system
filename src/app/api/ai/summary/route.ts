import { z } from "zod";
import { generateProfessionalSummary } from "@/features/ai/services/aiService";
import { executeAiPost } from "@/features/ai/services/aiRouteService";

const summaryRequestSchema = z.object({}).strict();

/** POST /api/ai/summary - generates a professional summary from the current profile. */
export async function POST(request: Request) {
  return executeAiPost(request, summaryRequestSchema, (userId) =>
    generateProfessionalSummary(userId)
  );
}
