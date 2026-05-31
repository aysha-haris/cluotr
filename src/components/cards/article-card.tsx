"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import type { Article } from "@/lib/data";

interface ArticleCardProps {
  article: Article;
  index?: number;
}

export function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${article.slug}`} className="group block">
        <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-[20px] shadow-sm">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/10" />
        </div>
        <h3 className="mb-2 font-serif text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        <span className="mt-3 inline-block text-xs font-medium uppercase tracking-wider text-accent group-hover:underline">
          Read More
        </span>
      </Link>
    </motion.div>
  );
}
