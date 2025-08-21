"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { ThemeProvider } from "./ThemeProvider";
import { ReduxProvider } from "./ReduxProvider";
import AppInitializer from "../AppInitializer";
import TopLoader from "@/components/common/TopLoader";
import AppLoadingGate from "../AppLoadingGate";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <AppInitializer>
            <AppLoadingGate>
              <TopLoader />
              {children}
              <Toaster richColors position="top-center" />
            </AppLoadingGate>
          </AppInitializer>
        </QueryClientProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
