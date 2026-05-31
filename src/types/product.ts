export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  affiliate_url: string;
  price: string | null;
  rating: string | null;
  featured: boolean;
  created_at: Date;
}
