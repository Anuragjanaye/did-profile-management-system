"use client";

import { ShieldCheck, CircleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { VerificationStatus } from "@prisma/client";

interface VerificationCardProps {
  verificationStatus: VerificationStatus;
}

/** Renders a card displaying on-chain contract signature and profile validation logs. */
export function VerificationCard({ verificationStatus: status }: VerificationCardProps) {
  const verified = status === "VERIFIED";
  const failed = status === "FAILED";

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden relative">
      <div className={`absolute top-0 left-0 w-full h-[3px] ${verified ? "bg-emerald-500" : failed ? "bg-red-500" : "bg-amber-500"}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-lg">On-Chain Verification</CardTitle>
            <CardDescription className="mt-1">Validator ownership record</CardDescription>
          </div>
          <Badge
            className={`font-semibold tracking-wide border ${
              verified
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                : failed
                ? "bg-red-500/10 text-red-500 border-red-500/25"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
            }`}
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <span className={verified ? "text-emerald-500" : failed ? "text-red-500" : "text-amber-500"}>
            {verified ? (
              <ShieldCheck className="size-6" aria-hidden="true" />
            ) : (
              <CircleAlert className="size-6" aria-hidden="true" />
            )}
          </span>
          <p className="text-muted-foreground text-xs leading-normal">
            {verified
              ? "Your profile hash CID registry is fully validated on Sepolia network. Ownership credentials verified."
              : failed
              ? "Verification failed. Make sure your signature is valid or register profile again."
              : "Register your latest IPFS profile details to secure validation logs on-chain."}
          </p>
        </div>

        {/* Network Metadata Specs */}
        <div className="grid grid-cols-2 gap-2 text-[10px] bg-muted/20 border border-border/40 rounded-lg p-2.5 font-mono text-muted-foreground">
          <div>
            <span>Network:</span> <span className="text-foreground">Ethereum Sepolia</span>
          </div>
          <div>
            <span>Smart Contract:</span>{" "}
            <span className="text-foreground">Active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
