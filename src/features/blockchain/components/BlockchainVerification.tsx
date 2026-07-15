"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useBlockchain } from "../hooks/useBlockchain";
import { ExternalLink, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface BlockchainVerificationProps {
  profileId: string;
  profileCid?: string | null;
}

export function BlockchainVerification({ profileId, profileCid }: BlockchainVerificationProps) {
  const queryClient = useQueryClient();
  const { 
    registerProfile, 
    registerWithBackend, 
    isWritePending, 
    isConfirming, 
    isConfirmed, 
    receipt, 
    isVerifying 
  } = useBlockchain();

  // Fetch current verification status
  const { data: statusData, isLoading: isStatusLoading } = useQuery({
    queryKey: ["blockchain", "status", profileId],
    queryFn: async () => {
      const res = await fetch("/api/blockchain/status");
      const data = await res.json();
      return data.data?.status;
    },
  });

  // Fetch transaction history
  const { data: historyData } = useQuery({
    queryKey: ["blockchain", "history", profileId],
    queryFn: async () => {
      const res = await fetch("/api/blockchain/history");
      const data = await res.json();
      return data.data?.history || [];
    },
  });

  // Handle the automatic backend registration when the transaction is confirmed
  useEffect(() => {
    if (isConfirmed && receipt && profileCid) {
      registerWithBackend(receipt.transactionHash, profileCid)
        .then(() => {
          toast.success("Profile verified on blockchain!");
          queryClient.invalidateQueries({ queryKey: ["blockchain", "status", profileId] });
          queryClient.invalidateQueries({ queryKey: ["blockchain", "history", profileId] });
        })
        .catch((err) => {
          toast.error("Failed to register with backend: " + err.message);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, receipt]);

  const handleVerify = async () => {
    if (!profileCid) {
      toast.error("No IPFS CID available to verify. Please upload your profile first.");
      return;
    }
    
    try {
      await registerProfile(profileCid);
      toast.info("Transaction submitted. Waiting for confirmation...");
    } catch (err) {
      toast.error("Transaction failed: " + (err as Error).message);
    }
  };

  const isVerified = !!statusData;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          {isVerified ? (
            <ShieldCheck className="h-6 w-6 text-green-500" />
          ) : (
            <ShieldAlert className="h-6 w-6 text-yellow-500" />
          )}
          <CardTitle>Blockchain Verification</CardTitle>
        </div>
        <CardDescription>
          Publish your decentralized identity to the Ethereum Sepolia network to prove ownership and make it immutable.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span>Status:</span>
            {isStatusLoading ? (
              <span className="text-muted-foreground animate-pulse">Checking...</span>
            ) : isVerified ? (
              <span className="text-green-500 font-bold">Verified</span>
            ) : (
              <span className="text-yellow-500 font-bold">Unverified</span>
            )}
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Current Profile CID:</span>
            <span className="text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
              {profileCid || "Not available"}
            </span>
          </div>

          {isVerified && statusData?.transactionHash && (
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Latest Transaction:</span>
              <a 
                href={`https://sepolia.etherscan.io/tx/${statusData.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 truncate max-w-[200px] sm:max-w-xs"
              >
                {statusData.transactionHash}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>

        {historyData && historyData.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-3">Transaction History</h4>
            <div className="space-y-3">
              {historyData.map((record: any) => (
                <div key={record.id} className="text-sm bg-muted/50 p-3 rounded-md flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">
                      {new Date(record.verifiedAt).toLocaleDateString()}
                    </span>
                    <span className="truncate max-w-[150px]" title={record.cid}>
                      CID: {record.cid}
                    </span>
                  </div>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${record.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 shrink-0"
                  >
                    View TX <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleVerify} 
          disabled={!profileCid || isWritePending || isConfirming || isVerifying}
          className="w-full"
        >
          {isWritePending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sign Transaction in Wallet...
            </>
          ) : isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming on Network...
            </>
          ) : isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying with Server...
            </>
          ) : isVerified ? (
            "Update Verification"
          ) : (
            "Verify Profile On-Chain"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
