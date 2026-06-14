import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function uploadImage(bucket: string, file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

export const uploadProductImage = (file: File) => uploadImage("product-images", file);
export const uploadCategoryImage = (file: File) => uploadImage("category-images", file);
export const uploadCategoryBanner = (file: File) => uploadImage("category-banners", file);
