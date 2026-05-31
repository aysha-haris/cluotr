export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: Date | null;
  created_at: Date;
}
