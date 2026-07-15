import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/authConfig";
import { UserRepository } from "@/features/auth/repositories/userRepository";
import { AiRateLimitError, limitAiRequest } from "@/features/ai/services/aiRateLimitService";
import { AiServiceError } from "@/features/ai/services/aiService";
import { ApiErrorCode } from "@/types/api";
import type { ApiError, ApiSuccess } from "@/types/api";
import type { User } from "@prisma/client";

/** Error with a safe, client-facing API status and code. */
class AiRouteError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details?: Record<string, string[]>;

  constructor(
    code: ApiErrorCode,
    status: number,
    message: string,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AiRouteError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/** Returns a consistent failed API response without exposing internal details. */
function errorResponse(error: unknown): NextResponse<ApiError> {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: "The request contains invalid data",
          details: Object.fromEntries(
            Object.entries(error.flatten().fieldErrors).filter(
              (entry): entry is [string, string[]] => entry[1] !== undefined
            )
          ),
        },
      },
      { status: 400 }
    );
  }

  if (error instanceof AiRouteError) {
    return NextResponse.json(
      {
        success: false,
        error: { code: error.code, message: error.message, details: error.details },
      },
      { status: error.status }
    );
  }

  if (error instanceof AiRateLimitError) {
    return NextResponse.json(
      { success: false, error: { code: ApiErrorCode.RATE_LIMIT, message: error.message } },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(1, Math.ceil((error.reset - Date.now()) / 1000))),
        },
      }
    );
  }

  if (error instanceof AiServiceError) {
    return NextResponse.json(
      { success: false, error: { code: ApiErrorCode.AI_ERROR, message: error.message } },
      { status: 422 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: { code: ApiErrorCode.AI_ERROR, message: "Unable to process the AI request" },
    },
    { status: 500 }
  );
}

/** Verifies session identity and loads the current database user. */
async function requireAiUser(): Promise<User> {
  const session = await auth();
  if (!session?.user?.walletAddress) {
    throw new AiRouteError(ApiErrorCode.UNAUTHORIZED, 401, "Authentication is required");
  }

  const user = await UserRepository.findByWalletAddress(session.user.walletAddress);
  if (!user) {
    throw new AiRouteError(ApiErrorCode.NOT_FOUND, 404, "User account not found");
  }

  return user;
}

/** Parses a JSON request body and reports malformed JSON as a validation failure. */
async function parseJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new AiRouteError(
      ApiErrorCode.VALIDATION_ERROR,
      400,
      "The request body must be valid JSON"
    );
  }
}

/** Executes a protected, rate-limited AI POST route with Zod validation. */
export async function executeAiPost<TInput, TResult>(
  request: Request,
  schema: z.ZodType<TInput>,
  handler: (userId: string, input: TInput) => Promise<TResult>
): Promise<NextResponse<ApiSuccess<TResult> | ApiError>> {
  try {
    const user = await requireAiUser();
    await limitAiRequest(user.id);
    const input = schema.parse(await parseJsonBody(request));
    const data = await handler(user.id, input);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}

/** Executes the protected, rate-limited AI-history route with query validation. */
export async function executeAiGet<TInput, TResult>(
  request: Request,
  schema: z.ZodType<TInput>,
  handler: (userId: string, input: TInput) => Promise<TResult>
): Promise<NextResponse<ApiSuccess<TResult> | ApiError>> {
  try {
    const user = await requireAiUser();
    await limitAiRequest(user.id);
    const query = Object.fromEntries(new URL(request.url).searchParams.entries());
    const input = schema.parse(query);
    const data = await handler(user.id, input);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
