"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, ShoppingBag, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useBoard } from "@/lib/board-context";
import { useToast } from "@/hooks/use-toast";

export function BoardPage() {
  const { items, removeItem } = useBoard();
  const { toast } = useToast();

  const handleRemove = (id: string, title: string) => {
    removeItem(id);
    toast({ description: `"${title}" removed from board.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-[hsl(270,40%,97%)] via-[hsl(340,60%,97%)] to-[hsl(20,80%,97%)] px-4 py-16">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary/70">
              <Bookmark className="h-3.5 w-3.5" />
              My Board
            </div>
            <h1 className="mb-4 font-serif text-4xl font-bold text-foreground md:text-5xl">
              Your Saved Finds
            </h1>
            <p className="mx-auto max-w-lg text-lg text-muted-foreground">
              Everything you&apos;ve saved — your personal curated collection.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-sm py-24 text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/8">
              <Bookmark className="h-8 w-8 text-primary/50" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Your board is empty</h2>
            <p className="mb-8 text-sm text-muted-foreground">
              Start saving products and collections as you browse — they&apos;ll all appear here.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="gap-2 rounded-full bg-primary text-white hover:bg-primary/90">
                <Link href="/shop">
                  <ShoppingBag className="h-4 w-4" />
                  Browse the Shop
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-primary/20 text-primary">
                <Link href="/">Explore Homepage</Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            <p className="mb-8 text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group relative flex flex-col overflow-hidden rounded-[20px] bg-card shadow-sm transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="20vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {item.type === "collection" ? (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id, item.title)}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-500 opacity-0 shadow-sm transition-all duration-200 hover:bg-rose-50 group-hover:opacity-100"
                        aria-label="Remove from board"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <span
                        className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          item.type === "collection"
                            ? "bg-accent/90 text-white"
                            : "bg-primary/90 text-white"
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                    <div className="flex flex-grow flex-col p-4">
                      {item.rating ? (
                        <div className="mb-1.5 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-accent text-accent" />
                          <span className="text-xs text-muted-foreground">{item.rating}</span>
                        </div>
                      ) : null}
                      <p className="mb-3 line-clamp-2 flex-grow text-sm font-medium leading-tight text-foreground">
                        {item.title}
                      </p>
                      {item.price !== undefined ? (
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">
                            ${item.price.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            className="text-[11px] font-medium text-primary hover:underline"
                          >
                            View
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
