"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { ThemeProvider } from "./ThemeProvider";
import { ReduxProvider } from "./ReduxProvider";
import AppInitializer from "../AppInitializer";
import TopLoader from "@/components/common/TopLoader";
import AppLoadingGate from "../AppLoadingGate";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <AppInitializer>
            <AppLoadingGate>
              <TopLoader />
              {children}
            </AppLoadingGate>
          </AppInitializer>
        </QueryClientProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
