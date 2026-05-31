import type { Metadata } from "next";

import { AdminPage } from "@/components/pages/admin-page";

export const metadata: Metadata = {
  title: "Admin | CLOUTR",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminPage />;
}
