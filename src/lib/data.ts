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

export const PRODUCTS = [
  { id: 1, title: "Glow Recipe Cloud Cream", category: "beauty", price: 34.0, rating: 4.8, image: "/images/product-1.png" },
  { id: 2, title: "Minimalist Crescent Bag", category: "accessories", price: 89.0, rating: 4.9, image: "/images/product-2.png" },
  { id: 3, title: "Ribbed Soy Candle Set", category: "home", price: 24.0, rating: 4.7, image: "/images/product-3.png" },
  { id: 4, title: "Dainty Gold Stacking Rings", category: "accessories", price: 45.0, rating: 4.6, image: "/images/product-4.png" },
  { id: 5, title: "Cloud Knit Lounge Set", category: "fashion", price: 68.0, rating: 4.9, image: "/images/product-5.png" },
  { id: 6, title: "Tortoiseshell Sunglasses", category: "accessories", price: 22.0, rating: 4.5, image: "/images/product-6.png" },
  { id: 7, title: "Linen Wide-Leg Trousers", category: "fashion", price: 52.0, rating: 4.7, image: "/images/product-1.png" },
  { id: 8, title: "Rose Quartz Roller Set", category: "beauty", price: 18.0, rating: 4.8, image: "/images/product-2.png" },
  { id: 9, title: "Rattan Side Table", category: "home", price: 79.0, rating: 4.6, image: "/images/product-3.png" },
  { id: 10, title: "Pearl Drop Earrings", category: "accessories", price: 28.0, rating: 4.9, image: "/images/product-4.png" },
  { id: 11, title: "Flowy Midi Sundress", category: "fashion", price: 38.0, rating: 4.7, image: "/images/product-5.png" },
  { id: 12, title: "Matcha Latte Kit", category: "gifts", price: 32.0, rating: 4.8, image: "/images/product-6.png" },
  { id: 13, title: "Viral Blush Serum", category: "beauty", price: 29.0, rating: 4.9, image: "/images/product-1.png" },
  { id: 14, title: "Aesthetic Desk Lamp", category: "home", price: 44.0, rating: 4.5, image: "/images/product-2.png" },
  { id: 15, title: "Bouclé Cardigan", category: "fashion", price: 74.0, rating: 4.8, image: "/images/product-3.png" },
  { id: 16, title: "Mini Tote Bag", category: "accessories", price: 62.0, rating: 4.7, image: "/images/product-4.png" },
  { id: 17, title: "Lavender Pillow Mist", category: "gifts", price: 16.0, rating: 4.6, image: "/images/product-5.png" },
  { id: 18, title: "Velvet Headband Set", category: "accessories", price: 14.0, rating: 4.8, image: "/images/product-6.png" },
  { id: 19, title: "Ceramic Planter Duo", category: "home", price: 36.0, rating: 4.7, image: "/images/product-1.png" },
  { id: 20, title: "SPF Lip Gloss Pack", category: "beauty", price: 21.0, rating: 4.9, image: "/images/product-2.png" },
  { id: 21, title: "Crochet Beach Bag", category: "trending", price: 33.0, rating: 4.8, image: "/images/product-3.png" },
  { id: 22, title: "Strawberry Body Butter", category: "beauty", price: 19.0, rating: 4.7, image: "/images/product-4.png" },
  { id: 23, title: "Y2K Butterfly Clips", category: "trending", price: 9.0, rating: 4.6, image: "/images/product-5.png" },
  { id: 24, title: "Linen Throw Blanket", category: "home", price: 58.0, rating: 4.8, image: "/images/product-6.png" },
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
export type Product = (typeof PRODUCTS)[number];
export type Collection = (typeof COLLECTIONS)[number];
export type Article = (typeof ARTICLES)[number];
