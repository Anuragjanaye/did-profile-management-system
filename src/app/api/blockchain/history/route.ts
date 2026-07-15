import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/authConfig";
import { blockchainService } from "@/features/blockchain/services/blockchainService";
import { prisma } from "@/lib/db/prisma";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const userWithProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    if (!userWithProfile?.profile) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Profile not found" } },
        { status: 404 }
      );
    }

    const history = await blockchainService.getTransactionHistory(userWithProfile.profile.id);

    return NextResponse.json({ success: true, data: { history } });
  } catch (error) {
    const err = error as Error;
    console.error("Blockchain history error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
