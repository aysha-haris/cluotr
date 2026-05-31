import { ContentIndexPage } from "@/components/content/content-page";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Product Roundups",
  description: "Curated product roundups designed for Pinterest saves and affiliate clicks.",
  path: "/roundups",
});

export default function RoundupsIndexPage() {
  return <ContentIndexPage type="roundups" />;
}
