export const CATEGORIES = [
  {
    id: "fashion",
    name: "Fashion",
    image: "/images/cat-fashion.png",
    description: "Curated style picks",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/images/cat-accessories.png",
    description: "Complete the look",
  },
  {
    id: "beauty",
    name: "Beauty",
    image: "/images/cat-beauty.png",
    description: "Skincare & makeup",
  },
  {
    id: "home",
    name: "Home",
    image: "/images/cat-home.png",
    description: "Aesthetic spaces",
  },
  {
    id: "gifts",
    name: "Gifts",
    image: "/images/cat-gifts.png",
    description: "For someone special",
  },
  {
    id: "trending",
    name: "Trending Finds",
    image: "/images/cat-trending.png",
    description: "Going viral now",
  },
] as const;

export const COLLECTIONS = [
  { id: 1, title: "15 Cute Summer Dresses Under $40", image: "/images/collection-1.png" },
  { id: 2, title: "Amazon Finds Every Girl Needs", image: "/images/blog-1.png" },
  { id: 3, title: "Best Home Decor Picks", image: "/images/cat-home.png" },
  { id: 4, title: "Trending Accessories This Month", image: "/images/cat-accessories.png" },
  { id: 5, title: "Self-Care Essentials", image: "/images/cat-beauty.png" },
] as const;

export const ARTICLES = [
  {
    slug: "summer-fashion-trends",
    title: "Best Summer Fashion Trends",
    image: "/images/blog-1.png",
    excerpt:
      "The definitive guide to looking effortlessly chic this summer without breaking the bank.",
  },
  {
    slug: "must-have-desk-accessories",
    title: "Must-Have Desk Accessories",
    image: "/images/blog-2.png",
    excerpt: "Elevate your WFH setup with these aesthetic and functional desk finds.",
  },
  {
    slug: "home-essentials",
    title: "Home Essentials Worth Buying",
    image: "/images/cat-home.png",
    excerpt: "Transform your space into a sanctuary with these highly-rated home products.",
  },
  {
    slug: "affordable-beauty-finds",
    title: "Affordable Beauty Finds",
    image: "/images/blog-3.png",
    excerpt: "Drugstore beauty products that actually perform like high-end luxury brands.",
  },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Collection = (typeof COLLECTIONS)[number];
export type Article = (typeof ARTICLES)[number];

export interface Product {
  id: number;
  title: string;
  category: string;
  imageUrl: string | null;
  price: number;
  affiliateUrl: string | null;
  rating: number | null;
  createdAt: string;
}
