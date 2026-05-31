import {
  ContentPage,
  createContentPageConfig,
} from "@/components/content/content-page";

export const revalidate = 3600;
export const generateStaticParams =
  createContentPageConfig("guides").generateStaticParams;
export const generateMetadata = createContentPageConfig("guides").generateMetadata;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  return <ContentPage type="guides" slug={slug} />;
}
