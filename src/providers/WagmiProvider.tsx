"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { type ReactNode } from "react";
import { WagmiProvider as WagmiRootProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { SessionProvider } from "next-auth/react";
import { config } from "@/config/chains";

interface WagmiProviderProps {
  children: ReactNode;
}

/**
 * Wagmi, RainbowKit, and Auth.js Session provider composition.
 * Enables DApp wallet connections and session tracking on the client.
 */
export function WagmiProvider({ children }: WagmiProviderProps) {
  return (
    <WagmiRootProvider config={config}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "#2563EB",
          accentColorForeground: "white",
          borderRadius: "medium",
        })}
      >
        <SessionProvider>{children}</SessionProvider>
      </RainbowKitProvider>
    </WagmiRootProvider>
  );
}
