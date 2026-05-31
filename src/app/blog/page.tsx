import { ContentIndexPage } from "@/components/content/content-page";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Blog",
  description: "Affiliate marketing insights, trends, and Pinterest growth strategies.",
  path: "/blog",
});

export default function BlogIndexPage() {
  return <ContentIndexPage type="blog" />;
}
