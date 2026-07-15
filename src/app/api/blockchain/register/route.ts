import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/authConfig";
import { blockchainService } from "@/features/blockchain/services/blockchainService";
import { prisma } from "@/lib/db/prisma";

const registerSchema = z.object({
  txHash: z.string().regex(/^0x([A-Fa-f0-9]{64})$/, "Invalid transaction hash format"),
  cid: z.string().min(1, "CID is required"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid input data" } },
        { status: 400 }
      );
    }

    const { txHash, cid } = result.data;
    const walletAddress = session.user.walletAddress as string;

    // We need the user's profile ID to link the blockchain record
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

    // Call service to verify transaction and store data
    const record = await blockchainService.verifyAndRegisterTransaction(
      userWithProfile.profile.id,
      walletAddress,
      txHash as `0x${string}`,
      cid
    );

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    const err = error as Error;
    console.error("Blockchain register error:", err);
    return NextResponse.json(
      { success: false, error: { code: "BLOCKCHAIN_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
