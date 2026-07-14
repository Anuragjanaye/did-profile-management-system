import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/db/dbUtils";
import type { ApiSuccess } from "@/types/api";

interface HealthData {
  status: "ok" | "degraded";
  database: "connected" | "disconnected";
  version: string;
  timestamp: string;
  environment: string;
}

/**
 * GET /api/health
 * Returns application health status and database connectivity.
 */
export async function GET(): Promise<NextResponse<ApiSuccess<HealthData>>> {
  const isDbConnected = await pingDatabase();

  const data: HealthData = {
    status: isDbConnected ? "ok" : "degraded",
    database: isDbConnected ? "connected" : "disconnected",
    version: process.env.npm_package_version ?? "0.1.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  };

  return NextResponse.json({ success: true, data });
}
