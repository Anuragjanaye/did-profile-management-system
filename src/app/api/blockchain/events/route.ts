import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/authConfig";
import { blockchainService } from "@/features/blockchain/services/blockchainService";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.walletAddress) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const events = await blockchainService.getEvents(session.user.walletAddress);

    return NextResponse.json({ success: true, data: { events } });
  } catch (error) {
    const err = error as Error;
    console.error("Blockchain events error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
