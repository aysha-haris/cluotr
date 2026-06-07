"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/cards/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/data";
import type { Product } from "@/lib/data";
import type { CategoryOverride } from "@/types/catalog";

const SORT_OPTIONS = [
  { label: "Trending", value: "trending" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹20", min: 0, max: 20 },
  { label: "₹20 – ₹50", min: 20, max: 50 },
  { label: "₹50 – ₹100", min: 50, max: 100 },
  { label: "Over ₹100", min: 100, max: Infinity },
];

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<CategoryOverride[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [priceRange, setPriceRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => {});
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: CategoryOverride[]) => setDbCategories(data))
      .catch(() => {});
  }, []);

  const staticIds = new Set<string>(CATEGORIES.map((c) => c.id));
  const extraCategories = dbCategories.filter((d) => !staticIds.has(d.id));
  const allCategories = [
    { id: "all", name: "All" },
    ...CATEGORIES,
    ...extraCategories.map((d) => ({ id: d.id, name: d.name })),
  ];
  const selectedPrice = PRICE_RANGES[priceRange];

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }
    list = list.filter((p) => p.price >= selectedPrice!.min && p.price < selectedPrice!.max);
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating")
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return list;
  }, [products, search, activeCategory, sortBy, selectedPrice]);

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("all");
    setSortBy("trending");
    setPriceRange(0);
  };

  const hasActiveFilters =
    search || activeCategory !== "all" || sortBy !== "trending" || priceRange !== 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-[hsl(270,40%,97%)] via-[hsl(340,60%,97%)] to-[hsl(20,80%,97%)] px-4 py-16">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-4 inline-block rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary/70">
              Shop All Finds
            </span>
            <h1 className="mb-4 font-serif text-4xl font-bold text-foreground md:text-5xl">
              Everything You&apos;ll Love
            </h1>
            <p className="mx-auto max-w-lg text-lg text-muted-foreground">
              Browse our full collection of curated picks across fashion, beauty, home, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative mx-auto mt-8 max-w-xl"
          >
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="h-12 rounded-full border-primary/20 bg-white/80 pl-11 pr-10 text-sm shadow-sm backdrop-blur-sm focus-visible:ring-primary/30"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="scrollbar-hide flex flex-nowrap items-center gap-2 overflow-x-auto pb-1">
              {allCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-white text-foreground hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full border-border text-sm"
                onClick={() => setShowFilters((v) => !v)}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
              </Button>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all
                </button>
              ) : null}
            </div>
          </div>

          {showFilters ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-white p-5 sm:grid-cols-2"
            >
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Price Range
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((range, i) => (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => setPriceRange(i)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                        priceRange === i
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white text-foreground hover:border-primary/40"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sort By
                </p>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSortBy(opt.value)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                        sortBy === opt.value
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white text-foreground hover:border-primary/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}

          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "find" : "finds"}
            {activeCategory !== "all" &&
              ` in ${allCategories.find((c) => c.id === activeCategory)?.name}`}
          </p>
        </div>

        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
            <p className="mb-4 text-4xl">✨</p>
            <p className="mb-2 text-lg font-medium text-foreground">No finds match your search</p>
            <p className="mb-6 text-sm text-muted-foreground">
              Try a different keyword or clear your filters.
            </p>
            <Button variant="outline" onClick={clearFilters} className="rounded-full">
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
