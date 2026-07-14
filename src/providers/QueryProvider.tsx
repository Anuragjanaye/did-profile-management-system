"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Wraps the application with TanStack React Query's QueryClientProvider.
 * Creates a new QueryClient per render boundary to avoid shared state between
 * server and client in Next.js App Router.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Per Next.js + React Query docs: create one QueryClient per component
  // instance so that data is not shared between different users/requests.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, set staleTime > 0 to avoid re-fetching immediately on mount
            staleTime: 60 * 1000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
