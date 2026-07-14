import { Info, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth/authConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";

/**
 * Authenticated Dashboard Page.
 * Renders once the user successfully completes the SIWE signature challenge.
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const { walletAddress, role } = session.user;
  const expiresAt = session.expires;

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-foreground text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your decentralized identity and verify your on-chain credentials.
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Verification Status */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className="border-[#22C55E]/20 bg-[#22C55E]/10 px-2.5 py-1 text-[#22C55E] hover:bg-[#22C55E]/10">
                SIWE Verified
              </Badge>
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              Session is actively signed and cookie-persisted.
            </p>
          </CardContent>
        </Card>

        {/* Connected Wallet */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
              Wallet Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground truncate font-mono text-sm font-medium select-all">
              {walletAddress}
            </p>
            <p className="text-muted-foreground mt-3 text-xs">Click to select and copy address.</p>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
              Security Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-foreground text-lg font-semibold">{role}</span>
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              Session expires on: {formatDate(expiresAt)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info notice for Phase 2 completion */}
      <Card className="border-[#2563EB]/20 bg-[#2563EB]/5">
        <CardContent className="flex items-start gap-4 p-6">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#2563EB]"
            aria-hidden="true"
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-foreground font-semibold">Phase 2 Authentication Completed</h3>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              You have successfully completed Phase 2! Authentication has been fully integrated.
              Connect your wallet using the navbar button to sign signatures, authenticate sessions,
              access edge-protected routes, and manage wallet sessions reactively.
            </p>
            <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
              <Info className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
              <span>No databases or profiles are loaded yet as per specification parameters.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
