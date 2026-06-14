export interface AffiliateLink {
  productId: number;
  url: string;
  price: number | null;
}

export interface ProductOverride {
  productId: number;
  title: string | null;
  category: string | null;
  imageUrl: string | null;
}

export interface CategoryOverride {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  bannerUrl: string | null;
  sortOrder: number;
}
