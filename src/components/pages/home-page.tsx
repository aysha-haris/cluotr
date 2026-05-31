"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { ArticleCard } from "@/components/cards/article-card";
import { CategoryCard } from "@/components/cards/category-card";
import { CollectionCard } from "@/components/cards/collection-card";
import { ProductCard } from "@/components/cards/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ARTICLES, CATEGORIES, COLLECTIONS, PRODUCTS } from "@/lib/data";

export function HomePage() {
  return (
    <div className="flex w-full flex-col">
      <section className="bg-hero-gradient relative overflow-hidden pb-32 pt-24">
        <div className="pointer-events-none absolute left-10 top-10 opacity-20">
          <svg width="200" height="150" viewBox="0 0 28 20" fill="none" aria-hidden>
            <path
              d="M7.5 19C3.35786 19 0 15.6421 0 11.5C0 7.63229 2.92348 4.45331 6.66986 4.04505C7.94276 1.60226 10.4907 0 13.5 0C17.3756 0 20.6121 2.72361 21.3283 6.36862C24.5186 6.67104 27 9.35246 27 12.6667C27 16.1645 24.1645 19 20.6667 19H7.5Z"
              fill="white"
            />
          </svg>
        </div>
        <div className="pointer-events-none absolute bottom-10 right-10 rotate-12 scale-150 transform opacity-30">
          <svg width="200" height="150" viewBox="0 0 28 20" fill="none" aria-hidden>
            <path
              d="M7.5 19C3.35786 19 0 15.6421 0 11.5C0 7.63229 2.92348 4.45331 6.66986 4.04505C7.94276 1.60226 10.4907 0 13.5 0C17.3756 0 20.6121 2.72361 21.3283 6.36862C24.5186 6.67104 27 9.35246 27 12.6667C27 16.1645 24.1645 19 20.6667 19H7.5Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="mb-6 inline-block rounded-full border border-white/80 bg-white/60 px-3 py-1 text-sm font-medium text-primary shadow-sm">
              Curated Lifestyle Discovery
            </span>
            <h1 className="mb-6 font-serif text-5xl font-bold leading-[1.1] text-foreground md:text-7xl">
              Discover Trending Finds You&apos;ll{" "}
              <span className="gradient-text">Actually Love</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-muted-foreground md:text-xl">
              Curated fashion, accessories, beauty, and lifestyle picks for modern women. Your
              daily dose of aesthetic inspiration.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 w-full rounded-full bg-primary px-8 text-base text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/20 sm:w-auto"
              >
                <Link href="/category/trending">Explore Trending Finds</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 w-full rounded-full border-white/60 bg-white/50 px-8 text-base text-foreground transition-all hover:bg-white/80 sm:w-auto"
              >
                <Link href="/shop">Browse Categories</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-10 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold md:text-4xl">
            Shop by Category
          </h2>
          <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:hidden">
            {CATEGORIES.map((cat, i) => (
              <div key={cat.id} className="h-[260px] w-[72vw] shrink-0 snap-center">
                <CategoryCard category={cat} index={i} className="h-full" />
              </div>
            ))}
          </div>
          <div className="mx-auto hidden max-w-6xl auto-rows-[240px] gap-4 md:grid md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {CATEGORIES.map((cat, i) => {
              let className = "";
              if (i === 0) className = "md:col-span-2 md:row-span-2";
              else if (i === 1 || i === 2) className = "md:col-span-1 md:row-span-1";
              else if (i === 3)
                className = "md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1";
              else className = "md:col-span-1 md:row-span-1";
              return (
                <CategoryCard key={cat.id} category={cat} index={i} className={`h-full ${className}`} />
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="mb-2 font-serif text-3xl font-bold md:text-4xl">Trending This Week</h2>
              <p className="text-muted-foreground">The most loved items right now.</p>
            </div>
            <Link
              href="/category/trending"
              className="hidden text-sm font-medium text-primary hover:underline md:inline-flex"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-6">
            {PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href="/category/trending">View All Trending</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center font-serif text-3xl font-bold md:text-4xl">
            Curated For You
          </h2>
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-6 overflow-hidden md:flex-nowrap">
            {COLLECTIONS.slice(0, 3).map((collection, i) => (
              <div key={collection.id} className="w-full md:w-1/3">
                <CollectionCard collection={collection} index={i} />
              </div>
            ))}
          </div>
          <div className="mx-auto mt-6 flex max-w-5xl flex-wrap justify-center gap-6 md:flex-nowrap">
            {COLLECTIONS.slice(3, 5).map((collection, i) => (
              <div key={collection.id} className="w-full md:w-1/2">
                <CollectionCard collection={collection} index={i + 3} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="mb-2 font-serif text-3xl font-bold md:text-4xl">The Edit</h2>
              <p className="text-muted-foreground">Style guides, tips, and aesthetic inspiration.</p>
            </div>
            <Link
              href="/blog"
              className="hidden text-sm font-medium text-primary hover:underline md:inline-flex"
            >
              Read Blog
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {ARTICLES.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[32px] border border-primary/10 bg-card p-10 shadow-xl md:p-16"
          >
            <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-primary to-accent" />
            <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
              Get Weekly Trending Finds
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of readers discovering new fashion, beauty, and lifestyle favorites
              every week.
            </p>
            <form
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-12 rounded-full border-transparent bg-muted/50 px-6 focus-visible:border-primary"
              />
              <Button type="submit" className="h-12 rounded-full bg-primary px-8 hover:bg-primary/90">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
