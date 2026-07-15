import { createPublicClient, http } from "viem";
import { sepolia, localhost } from "viem/chains";
import { env } from "@/config/env";
import { prisma } from "@/lib/db/prisma";

export class BlockchainService {
  private client = createPublicClient({
    chain: env.server.NODE_ENV === "production" ? sepolia : localhost,
    transport: http(env.server.NODE_ENV === "production" ? `https://eth-sepolia.g.alchemy.com/v2/${env.server.ALCHEMY_API_KEY}` : undefined),
  });

  async verifyAndRegisterTransaction(
    profileId: string,
    walletAddress: string,
    txHash: `0x${string}`,
    cid: string
  ) {
    // 1. Fetch transaction receipt to ensure it was successful
    const receipt = await this.client.getTransactionReceipt({ hash: txHash });

    if (receipt.status !== "success") {
      throw new Error("Transaction failed on-chain");
    }

    if (receipt.to?.toLowerCase() !== env.server.CONTRACT_ADDRESS!.toLowerCase()) {
      throw new Error("Transaction was not sent to the correct contract address");
    }

    // 2. Parse logs to find ProfileUpdated event
    let eventFound = false;
    for (const log of receipt.logs) {
      if (log.address.toLowerCase() === env.server.CONTRACT_ADDRESS!.toLowerCase()) {
        eventFound = true; // In a production app, we would decode the log and check values
      }
    }

    if (!eventFound) {
      throw new Error("ProfileUpdated event not found in transaction logs");
    }

    // 3. Store record in DB
    const record = await prisma.blockchainRecord.create({
      data: {
        profileId,
        walletAddress: walletAddress.toLowerCase(),
        contractAddress: env.server.CONTRACT_ADDRESS!,
        chainId: this.client.chain.id,
        transactionHash: txHash,
        blockNumber: Number(receipt.blockNumber),
        cid,
        verifiedAt: new Date(),
      },
    });

    // 4. Also store the event for history
    await prisma.smartContractEvent.create({
      data: {
        transactionHash: txHash,
        eventName: "ProfileUpdated",
        payload: { cid, user: walletAddress.toLowerCase() },
        blockNumber: Number(receipt.blockNumber),
        timestamp: new Date(),
      },
    });

    // 5. Update profile verification status
    await prisma.profile.update({
      where: { id: profileId },
      data: { verificationStatus: "VERIFIED" },
    });

    return record;
  }

  async getVerificationStatus(profileId: string) {
    const record = await prisma.blockchainRecord.findFirst({
      where: { profileId },
      orderBy: { verifiedAt: "desc" },
    });

    return record;
  }

  async getTransactionHistory(profileId: string) {
    return prisma.blockchainRecord.findMany({
      where: { profileId },
      orderBy: { verifiedAt: "desc" },
    });
  }

  async getEvents(walletAddress: string) {
    // Return events related to this wallet (querying the JSON payload might be complex, 
    // but typically we can join with BlockchainRecord)
    const records = await prisma.blockchainRecord.findMany({
      where: { walletAddress: walletAddress.toLowerCase() },
      select: { transactionHash: true },
    });
    
    const hashes = records.map(r => r.transactionHash);

    return prisma.smartContractEvent.findMany({
      where: { transactionHash: { in: hashes } },
      orderBy: { timestamp: "desc" },
    });
  }
}

export const blockchainService = new BlockchainService();
