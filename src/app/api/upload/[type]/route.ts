import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/authConfig";
import { UserRepository } from "@/features/auth/repositories/userRepository";
import { ProfileRepository } from "@/features/profile/repositories/profileRepository";
import { prisma } from "@/lib/db/prisma";
import { validateFile } from "@/features/upload/utils/uploadUtils";
import { uploadToPinata } from "@/features/upload/services/pinataService";
import { UploadType } from "@prisma/client";

const TYPE_CONFIGS: Record<string, { mimeTypes: string[]; maxMB: number; dbType: UploadType }> = {
  avatar: {
    mimeTypes: ["image/png", "image/jpeg", "image/webp"],
    maxMB: 2,
    dbType: UploadType.AVATAR,
  },
  banner: {
    mimeTypes: ["image/png", "image/jpeg", "image/webp"],
    maxMB: 5,
    dbType: UploadType.BANNER,
  },
  resume: {
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxMB: 10,
    dbType: UploadType.RESUME,
  },
  certificate: {
    mimeTypes: ["application/pdf", "image/png", "image/jpeg"],
    maxMB: 10,
    dbType: UploadType.CERTIFICATE,
  },
};

/**
 * POST /api/upload/[type]
 * Dynamic route to handle uploading avatars, banners, resumes, and certificates.
 */
export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "You must be authenticated to upload files" },
        },
        { status: 401 }
      );
    }

    const { type } = await params;
    const config = TYPE_CONFIGS[type];
    if (!config) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: `Invalid upload type: ${type}` } },
        { status: 404 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "No file was uploaded in the request" },
        },
        { status: 400 }
      );
    }

    // Validate size and format
    const validation = validateFile(file, config.mimeTypes, config.maxMB);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: validation.error } },
        { status: 400 }
      );
    }

    // Lookup user profile
    const user = await UserRepository.findByWalletAddress(session.user.walletAddress);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "User account not found" } },
        { status: 404 }
      );
    }

    const profile = await ProfileRepository.findByUserId(user.id);
    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Profile not found. Please create a profile first.",
          },
        },
        { status: 400 }
      );
    }

    // Upload to Pinata IPFS
    const pinataRes = await uploadToPinata(file, `${type}_${user.id}_${Date.now()}`);
    const cid = pinataRes.IpfsHash;
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

    // Store in database
    const [uploadRecord] = await prisma.$transaction([
      // 1. Create upload record
      prisma.upload.create({
        data: {
          profileId: profile.id,
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
          cid: cid,
          url: gatewayUrl,
        },
      }),
      // 2. Conditionally update profile avatar/banner CIDs directly
      ...(config.dbType === UploadType.AVATAR
        ? [prisma.profile.update({ where: { id: profile.id }, data: { avatarCID: cid } })]
        : []),
      ...(config.dbType === UploadType.BANNER
        ? [prisma.profile.update({ where: { id: profile.id }, data: { bannerCID: cid } })]
        : []),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        cid,
        url: gatewayUrl,
        upload: uploadRecord,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("API Upload handler failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: { code: "UPLOAD_ERROR", message: err.message || "Failed to process file upload" },
      },
      { status: 500 }
    );
  }
}
