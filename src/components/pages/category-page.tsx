"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/cards/product-card";
import { Button } from "@/components/ui/button";
import { CATEGORIES, PRODUCTS } from "@/lib/data";

interface CategoryPageProps {
  slug: string;
}

export function CategoryPage({ slug }: CategoryPageProps) {
  const categoryInfo = CATEGORIES.find((c) => c.id === slug) ?? {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: "Explore our curated finds.",
    image: "/images/cat-fashion.png",
  };

  const categoryProducts =
    slug === "trending" ? PRODUCTS : PRODUCTS.filter((p) => p.category === slug);

  const displayProducts = categoryProducts.length > 0 ? categoryProducts : PRODUCTS.slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Category header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-12 flex h-[30vh] items-center justify-center overflow-hidden rounded-[32px] bg-muted text-center md:h-[40vh]"
      >
        <Image
          src={categoryInfo.image}
          alt={categoryInfo.name}
          fill
          sizes="100vw"
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 p-6">
          <h1 className="mb-4 font-serif text-4xl font-bold text-white drop-shadow-md md:text-6xl">
            {categoryInfo.name}
          </h1>
          <p className="mx-auto max-w-lg text-lg font-medium text-white/90 drop-shadow-sm md:text-xl">
            {categoryInfo.description}
          </p>
        </div>
      </motion.div>

      {/* Filter row */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-border pb-4 sm:flex-row">
        <p className="text-sm font-medium text-muted-foreground">
          Showing {displayProducts.length} items
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full">
            Price: Low to High
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Highest Rated
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-primary/20 bg-primary/5 text-primary"
          >
            Newest
          </Button>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
        {displayProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {/* Load more */}
      <div className="mt-16 text-center">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-full border-primary/20 px-12 text-primary hover:bg-primary/5"
        >
          <Link href="/shop">Browse All Finds</Link>
        </Button>
      </div>
    </div>
  );
}
