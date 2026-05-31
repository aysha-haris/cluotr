import {
  ContentPage,
  createContentPageConfig,
} from "@/components/content/content-page";

export const revalidate = 3600;
export const generateStaticParams =
  createContentPageConfig("roundups").generateStaticParams;
export const generateMetadata = createContentPageConfig("roundups").generateMetadata;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RoundupPage({ params }: PageProps) {
  const { slug } = await params;
  return <ContentPage type="roundups" slug={slug} />;
}
