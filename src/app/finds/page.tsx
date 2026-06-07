import type { Metadata } from "next";

import { ShopPage } from "@/components/pages/shop-page";

export const metadata: Metadata = {
  title: "Finds | CLOUTR",
  description: "Browse our full collection of curated picks across fashion, beauty, home, and more.",
};

export default function Page() {
  return <ShopPage />;
}
