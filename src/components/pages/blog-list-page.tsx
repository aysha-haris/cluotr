import Image from "next/image";
import Link from "next/link";

import { ArticleCard } from "@/components/cards/article-card";
import { ARTICLES } from "@/lib/data";

export function BlogListPage() {
  const featured = ARTICLES[0];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <div className="mb-16 text-center">
        <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">The Edit</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Style guides, curated lists, aesthetic inspiration, and everything in between.
        </p>
      </div>

      {featured ? (
        <Link href={`/blog/${featured.slug}`} className="group mb-16 block cursor-pointer">
          <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-[24px] shadow-md md:aspect-[21/9]">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-medium uppercase tracking-wider text-accent">
              Latest Story
            </span>
            <h2 className="mb-4 font-serif text-3xl font-bold transition-colors group-hover:text-primary md:text-4xl">
              {featured.title}
            </h2>
            <p className="mb-4 text-lg text-muted-foreground">{featured.excerpt}</p>
            <span className="inline-block font-medium text-primary group-hover:underline">
              Read the full story
            </span>
          </div>
        </Link>
      ) : null}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
        {ARTICLES.slice(1).map((article, i) => (
          <ArticleCard key={article.slug} article={article} index={i} />
        ))}
      </div>
    </div>
  );
}
