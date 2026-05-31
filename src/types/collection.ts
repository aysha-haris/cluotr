export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  created_at: Date;
}
