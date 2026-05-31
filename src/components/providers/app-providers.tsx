"use client";

import { AffiliateLinksProvider } from "@/lib/affiliate-links-context";
import { BoardProvider } from "@/lib/board-context";
import { Toaster } from "@/components/ui/toaster";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AffiliateLinksProvider>
      <BoardProvider>
        {children}
        <Toaster />
      </BoardProvider>
    </AffiliateLinksProvider>
  );
}
