import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { AdminPage } from "@/components/pages/admin-page";

export const metadata: Metadata = {
  title: "Admin | CLOUTR",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminPage />;
}
