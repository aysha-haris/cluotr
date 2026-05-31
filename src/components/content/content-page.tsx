import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLdScript } from "@/components/seo/json-ld-script";
import { blogPath, guidePath, pinPath, roundupPath } from "@/constants/routes";
import {
  getAllContent,
  getContentEntry,
  getContentSlugs,
  renderMdxContent,
} from "@/lib/content";
import { buildArticleJsonLd, buildMetadata } from "@/lib/seo";
import type { ContentType } from "@/types/content";

const CONTENT_ROUTE: Record<ContentType, (slug: string) => string> = {
  blog: blogPath,
  guides: guidePath,
  roundups: roundupPath,
  pinterest: pinPath,
};

interface ContentPageProps {
  type: ContentType;
  slug: string;
}

export function createContentPageConfig(type: ContentType) {
  return {
    async generateStaticParams() {
      const slugs = await getContentSlugs(type);
      return slugs.map((slug) => ({ slug }));
    },

    async generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
      const { slug } = await params;

      try {
        const entry = await getContentEntry(type, slug);
        const path = CONTENT_ROUTE[type](slug);

        return buildMetadata({
          title: entry.frontmatter.seoTitle ?? entry.frontmatter.title,
          description:
            entry.frontmatter.seoDescription ??
            entry.frontmatter.description ??
            entry.frontmatter.excerpt,
          path,
          image: entry.frontmatter.featuredImage ?? entry.frontmatter.pinterestImage,
          publishedTime: entry.frontmatter.publishedAt,
          type: "article",
        });
      } catch {
        return buildMetadata({ title: "Not Found", noIndex: true });
      }
    },
  };
}

export async function ContentPage({ type, slug }: ContentPageProps) {
  let entry;

  try {
    entry = await getContentEntry(type, slug);
  } catch {
    notFound();
  }

  const mdx = await renderMdxContent(entry.content);
  const path = CONTENT_ROUTE[type](slug);
  const description =
    entry.frontmatter.description ??
    entry.frontmatter.excerpt ??
    entry.frontmatter.title;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <JsonLdScript
        data={buildArticleJsonLd({
          title: entry.frontmatter.title,
          description,
          path,
          image: entry.frontmatter.featuredImage ?? entry.frontmatter.pinterestImage,
          publishedAt: entry.frontmatter.publishedAt,
        })}
      />

      <header className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-wide text-neutral-500">{type}</p>
        <h1 className="text-4xl font-bold tracking-tight">{entry.frontmatter.title}</h1>
        {entry.frontmatter.excerpt ? (
          <p className="text-lg text-neutral-600">{entry.frontmatter.excerpt}</p>
        ) : null}
        <p className="text-sm text-neutral-500">{entry.readingTime}</p>
      </header>

      {entry.frontmatter.affiliateDisclosure ? (
        <p className="mb-8 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          This page may contain affiliate links. We may earn a commission at no extra
          cost to you.
        </p>
      ) : null}

      <div className="prose-neutral">{mdx}</div>
    </article>
  );
}

export async function ContentIndexPage({ type }: { type: ContentType }) {
  const items = await getAllContent(type);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold capitalize tracking-tight">{type}</h1>
      <ul className="space-y-6">
        {items.map((item) => (
          <li key={item.slug} className="border-b border-neutral-200 pb-6">
            <Link
              href={CONTENT_ROUTE[type](item.slug)}
              className="text-xl font-semibold hover:underline"
            >
              {item.title}
            </Link>
            {item.excerpt ? (
              <p className="mt-2 text-neutral-600">{item.excerpt}</p>
            ) : null}
            <p className="mt-2 text-sm text-neutral-500">{item.readingTime}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
