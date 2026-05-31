import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";

import { AnalyticsScripts } from "@/components/analytics";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AppProviders } from "@/components/providers/app-providers";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { buildMetadata, buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/seo";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <JsonLdScript data={[buildWebsiteJsonLd(), buildOrganizationJsonLd()]} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <AppProviders>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AppProviders>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
