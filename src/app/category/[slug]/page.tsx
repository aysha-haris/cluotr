import type { Metadata } from "next";

import { CategoryPage } from "@/components/pages/category-page";
import { CATEGORIES } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.id === slug);
  const name = cat?.name ?? slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${name} | CLOUTR`,
    description: cat?.description ?? `Shop curated ${name} finds on CLOUTR.`,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CategoryPage slug={slug} />;
}
