"use client";

import { type ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { WagmiProvider } from "./WagmiProvider";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Composes all application-level providers in the correct nesting order.
 * Add new providers here — do not scatter them across individual pages.
 *
 * Order matters:
 * 1. ThemeProvider — outermost so theming is available to all children
 * 2. WagmiProvider — wraps QueryProvider (React Query context)
 * 3. SessionProvider — client-side session state (inside WagmiProvider)
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <WagmiProvider>{children}</WagmiProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
