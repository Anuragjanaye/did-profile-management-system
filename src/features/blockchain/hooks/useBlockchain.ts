import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { PROFILE_REGISTRY_ABI } from "../constants/abi";
import { getContractAddress } from "../actions/blockchainActions";

interface BlockchainRecord {
  id: string;
  transactionHash: string;
  blockNumber: number;
  cid: string;
  verifiedAt: string;
}

export function useBlockchain() {
  const { address } = useAccount();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    writeContractAsync,
    data: hash,
    isPending: isWritePending,
    error: writeError
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    data: receipt 
  } = useWaitForTransactionReceipt({ 
    hash,
  });

  const registerProfile = async (cid: string) => {
    try {
      setIsVerifying(true);
      setError(null);

      if (!address) {
        throw new Error("Wallet not connected");
      }

      // Fetch contract address dynamically since it's a server environment variable
      const contractAddress = await getContractAddress();

      // 1. Send transaction using Wagmi
      // @ts-ignore
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi: PROFILE_REGISTRY_ABI,
        functionName: "registerProfile",
        args: [cid],
      });

      // 2. Wait for transaction to be confirmed - this is handled by useWaitForTransactionReceipt automatically 
      // but we wait to send to backend until it's done.
      // Wait, useWaitForTransactionReceipt doesn't block this thread, so we should either await a custom provider 
      // or return the txHash and let an effect handle it.
      // Better yet, just return the txHash here and let the caller or an effect handle the API call once `isConfirmed` is true.
      
      return txHash;
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
      setIsVerifying(false);
      throw err;
    }
  };

  const registerWithBackend = async (txHash: string, cid: string) => {
    try {
      const response = await fetch("/api/blockchain/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash, cid }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || "Failed to register on backend");
      }

      return data.data as BlockchainRecord;
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
      throw err;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    registerProfile,
    registerWithBackend,
    hash,
    isWritePending,
    isConfirming,
    isConfirmed,
    receipt,
    isVerifying,
    error: error || writeError?.message,
  };
}
