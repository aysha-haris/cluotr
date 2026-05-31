import { ContentIndexPage } from "@/components/content/content-page";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Buying Guides",
  description: "In-depth buying guides for Pinterest-first affiliate marketing.",
  path: "/guides",
});

export default function GuidesIndexPage() {
  return <ContentIndexPage type="guides" />;
}
