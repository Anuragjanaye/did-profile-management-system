import { retryPromise } from "../utils/uploadUtils";

export interface PinataUploadResult {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

/**
 * Uploads a standard File object to Pinata IPFS.
 * Implements linear backoff retry automatically.
 */
export async function uploadToPinata(file: File, fileName?: string): Promise<PinataUploadResult> {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    throw new Error("Pinata authorization key (PINATA_JWT) is missing in environment");
  }

  const formData = new FormData();
  formData.append("file", file);

  // Optional metadata to identify uploads inside Pinata dashboard
  const metadata = {
    name: fileName || file.name,
    keyvalues: {
      source: "did-profile-system",
      uploadedAt: new Date().toISOString(),
    },
  };
  formData.append("pinataMetadata", JSON.stringify(metadata));

  // Options configuration
  const options = {
    cidVersion: 1,
  };
  formData.append("pinataOptions", JSON.stringify(options));

  // Define upload action
  const uploadAction = async (): Promise<PinataUploadResult> => {
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata upload failed with status ${response.status}: ${errorText}`);
    }

    return response.json();
  };

  // Run with retry logic
  return retryPromise(uploadAction, 3, 1000);
}
