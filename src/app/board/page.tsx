import type { Metadata } from "next";

import { BoardPage } from "@/components/pages/board-page";

export const metadata: Metadata = {
  title: "My Board | CLOUTR",
  description: "Your saved finds — a personal curated collection.",
};

export default function Page() {
  return <BoardPage />;
}
