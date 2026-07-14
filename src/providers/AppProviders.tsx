"use client";

import { type ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Composes all application-level providers in the correct nesting order.
 * Add new providers here — do not scatter them across individual pages.
 *
 * Order matters:
 * 1. ThemeProvider — outermost so theming is available to all children
 * 2. QueryProvider — React Query context
 * 3. (Phase 2) WagmiProvider — wallet state
 * 4. (Phase 2) SessionProvider — Auth.js session
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
