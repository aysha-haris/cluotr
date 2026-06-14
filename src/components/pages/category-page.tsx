"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ProductCard } from "@/components/cards/product-card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/data";
import type { Product } from "@/lib/data";

export interface DbCategory {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  bannerUrl: string | null;
}

interface CategoryPageProps {
  slug: string;
  initialCategory?: DbCategory | null;
}

export function CategoryPage({ slug, initialCategory }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        const filtered =
          slug === "trending" ? data : data.filter((p) => p.category === slug);
        setProducts(filtered);
      })
      .catch(() => {});
  }, [slug]);

  const staticInfo = CATEGORIES.find((c) => c.id === slug);
  const categoryInfo = {
    name: initialCategory?.name ?? staticInfo?.name ?? (slug.charAt(0).toUpperCase() + slug.slice(1)),
    description: initialCategory?.description ?? staticInfo?.description ?? "Explore our curated finds.",
    image: initialCategory?.bannerUrl ?? null,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-12 flex h-[30vh] items-center justify-center overflow-hidden rounded-[32px] bg-muted text-center md:h-[40vh]"
      >
        {categoryInfo.image ? (
          <Image
            src={categoryInfo.image}
            alt={categoryInfo.name}
            fill
            sizes="100vw"
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        )}
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

      <div className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-border pb-4 sm:flex-row">
        <p className="text-sm font-medium text-muted-foreground">
          Showing {products.length} items
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

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="mb-2 text-lg font-medium text-foreground">No products yet</p>
          <p className="text-sm text-muted-foreground">Check back soon for new finds in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}

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
