"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import Image from "next/image";

import { useBoard } from "@/lib/board-context";
import { useToast } from "@/hooks/use-toast";
import type { Collection } from "@/lib/data";

interface CollectionCardProps {
  collection: Collection;
  index?: number;
}

export function CollectionCard({ collection, index = 0 }: CollectionCardProps) {
  const { isSaved, saveItem, removeItem } = useBoard();
  const { toast } = useToast();
  const saved = isSaved(`collection-${collection.id}`);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = `collection-${collection.id}`;
    if (saved) {
      removeItem(id);
      toast({ description: "Removed from your board." });
    } else {
      saveItem({
        id,
        type: "collection",
        title: collection.title,
        image: collection.image,
      });
      toast({ description: "Collection saved to your board!" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-[24px] shadow-md transition-all duration-500 hover:shadow-xl md:aspect-[4/5]"
    >
      <Image
        src={collection.image}
        alt={collection.title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <button
        type="button"
        onClick={handleSave}
        className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
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

      <div className="absolute inset-x-0 bottom-0 transform p-6 transition-transform duration-300 group-hover:-translate-y-2">
        <h3 className="font-serif text-xl font-bold leading-tight text-white drop-shadow-md md:text-2xl">
          {collection.title}
        </h3>
        <div className="mt-4 h-1 w-10 origin-left scale-x-0 rounded-full bg-accent transition-all duration-300 group-hover:scale-x-100" />
      </div>
    </motion.div>
  );
}
