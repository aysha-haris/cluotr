"use client";

import { BoardProvider } from "@/lib/board-context";
import { Toaster } from "@/components/ui/toaster";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BoardProvider>
      {children}
      <Toaster />
    </BoardProvider>
  );
}
