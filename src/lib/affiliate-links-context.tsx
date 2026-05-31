"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { AffiliateLink } from "@/types/catalog";

const AffiliateLinksContext = createContext<Map<number, AffiliateLink>>(new Map());

export function AffiliateLinksProvider({ children }: { children: React.ReactNode }) {
  const [links, setLinks] = useState<AffiliateLink[]>([]);

  useEffect(() => {
    fetch("/api/affiliate-links")
      .then((res) => res.json())
      .then((data: AffiliateLink[]) => setLinks(data))
      .catch(() => {});
  }, []);

  const map = useMemo(() => new Map(links.map((l) => [l.productId, l])), [links]);

  return <AffiliateLinksContext.Provider value={map}>{children}</AffiliateLinksContext.Provider>;
}

export function useAffiliateLink(productId: number): AffiliateLink | undefined {
  return useContext(AffiliateLinksContext).get(productId);
}
