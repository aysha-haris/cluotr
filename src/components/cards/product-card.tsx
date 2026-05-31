"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Star } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAffiliateLink } from "@/lib/affiliate-links-context";
import { useBoard } from "@/lib/board-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/data";

interface ProductCardProps {
  product: Pick<Product, "id" | "title" | "price" | "rating" | "image">;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isSaved, saveItem, removeItem } = useBoard();
  const { toast } = useToast();
  const saved = isSaved(`product-${product.id}`);
  const link = useAffiliateLink(product.id);
  const affiliateUrl = link?.url ?? "";
  const displayPrice = link?.price != null ? link.price : product.price;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = `product-${product.id}`;
    if (saved) {
      removeItem(id);
      toast({ description: "Removed from your board." });
    } else {
      saveItem({
        id,
        type: "product",
        title: product.title,
        image: product.image,
        price: displayPrice,
        rating: product.rating,
      });
      toast({ description: "Saved to your board!" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border-none bg-card shadow-sm transition-all duration-300 hover:shadow-lg">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <button
            type="button"
            onClick={handleSave}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
              saved
                ? "scale-100 bg-primary text-white opacity-100"
                : "scale-90 bg-white/80 text-primary opacity-0 group-hover:scale-100 group-hover:opacity-100"
            }`}
            aria-label={saved ? "Remove from board" : "Save to board"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {saved ? (
                <motion.span
                  key="saved"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.5 }}
                >
                  <BookmarkCheck className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="unsaved"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.5 }}
                >
                  <Bookmark className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {affiliateUrl ? (
            <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Linked
            </span>
          ) : null}
        </div>

        <CardContent className="flex flex-grow flex-col p-4">
          <div className="mb-2 flex items-center gap-1">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="text-xs font-medium text-muted-foreground">{product.rating}</span>
          </div>
          <h3 className="mb-3 line-clamp-2 flex-grow text-sm font-medium leading-tight text-foreground">
            {product.title}
          </h3>
          <div className="mt-auto flex flex-col gap-2 pt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-foreground">
                ${displayPrice.toFixed(2)}
              </span>
              {link?.price != null ? (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              ) : null}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-full border-primary/20 text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              onClick={(e) => {
                e.stopPropagation();
                if (affiliateUrl) window.open(affiliateUrl, "_blank", "noopener,noreferrer");
              }}
            >
              View on Amazon
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
