import {
  ContentPage,
  createContentPageConfig,
} from "@/components/content/content-page";

export const revalidate = 3600;
export const generateStaticParams = createContentPageConfig("blog").generateStaticParams;
export const generateMetadata = createContentPageConfig("blog").generateMetadata;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  return <ContentPage type="blog" slug={slug} />;
}
