"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, Loader2, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatAddress } from "@/utils/formatAddress";
import { cn } from "@/lib/utils";

/**
 * Premium Connect Wallet button that integrates RainbowKit connection status
 * with SIWE session authentication state. Shows rich animations and micro-interactions.
 */
export function ConnectWalletButton() {
  const { isAuthenticated, isAuthenticating, logout } = useAuth();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    disabled={isAuthenticating}
                    className={cn(
                      "focus-visible:ring-ring inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white transition-all duration-200 select-none hover:bg-[#2563EB]/90 focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    )}
                  >
                    {isAuthenticating ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Wallet className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>{isAuthenticating ? "Verifying..." : "Connect Wallet"}</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-[#EF4444] px-4 text-sm font-medium text-white transition-all hover:bg-[#EF4444]/90 active:scale-95"
                  >
                    Wrong network
                  </button>
                );
              }

              // Connected to wallet and session is SIWE authenticated
              if (isAuthenticated) {
                return (
                  <div className="flex items-center gap-2">
                    {/* Chain selector button */}
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="border-border bg-surface/50 text-foreground hover:bg-surface-elevated hidden h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-all sm:inline-flex"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: "hidden",
                          }}
                          aria-hidden="true"
                        >
                          {chain.iconUrl && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      <span>{chain.name}</span>
                      <ChevronDown className="text-muted h-3 w-3" aria-hidden="true" />
                    </button>

                    {/* Account card & dropdown toggle */}
                    <div className="border-border bg-card/60 flex items-center rounded-lg border backdrop-blur-sm">
                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="text-foreground hover:text-primary flex h-9 items-center gap-2 px-3 text-sm font-medium transition-colors"
                      >
                        {account.ensAvatar ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            alt="ENS Avatar"
                            src={account.ensAvatar}
                            className="h-4 w-4 rounded-full"
                          />
                        ) : (
                          <div className="from-primary to-secondary h-4 w-4 rounded-full bg-gradient-to-r" />
                        )}
                        <span>{account.ensName || formatAddress(account.address)}</span>
                      </button>

                      <div className="bg-border h-4 w-px" aria-hidden="true" />

                      {/* Log out/Disconnect button */}
                      <button
                        onClick={logout}
                        type="button"
                        aria-label="Disconnect wallet and sign out"
                        className="text-muted flex h-9 w-9 items-center justify-center transition-colors hover:text-[#EF4444]"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              }

              // Connected but SIWE signature verification is pending
              return (
                <button
                  type="button"
                  disabled={true}
                  className="bg-surface-elevated text-foreground inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium opacity-85"
                >
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Verifying Session...</span>
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
