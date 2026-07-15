import { historyQuerySchema } from "@/features/ai/schemas/aiSchemas";
import { getAnalysisHistory } from "@/features/ai/services/aiService";
import { executeAiGet } from "@/features/ai/services/aiRouteService";

/** GET /api/ai/history - returns authenticated user's saved AI analyses. */
export async function GET(request: Request) {
  return executeAiGet(request, historyQuerySchema, (userId, input) =>
    getAnalysisHistory(userId, input.limit ?? 10)
  );
}
