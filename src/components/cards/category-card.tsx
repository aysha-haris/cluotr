"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: { id: string; name: string; description: string; imageUrl?: string | null };
  index?: number;
  className?: string;
}

export function CategoryCard({ category, index = 0, className = "" }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`group relative h-full min-h-[240px] cursor-pointer overflow-hidden rounded-[24px] shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60" />
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 72vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-background" />
        )}
        <div className="absolute bottom-0 left-0 z-20 w-full p-6">
          <h3 className="mb-1 font-serif text-2xl font-bold text-white">{category.name}</h3>
          <p className="translate-y-4 text-sm font-medium text-white/80 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {category.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
