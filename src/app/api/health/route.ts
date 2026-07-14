import { NextResponse } from "next/server";
import type { ApiSuccess } from "@/types/api";

interface HealthData {
  status: "ok";
  version: string;
  timestamp: string;
  environment: string;
}

/**
 * GET /api/health
 * Returns application health status.
 * Used by Vercel deployment checks and monitoring services.
 */
export async function GET(): Promise<NextResponse<ApiSuccess<HealthData>>> {
  const data: HealthData = {
    status: "ok",
    version: process.env.npm_package_version ?? "0.1.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  };

  return NextResponse.json({ success: true, data });
}
