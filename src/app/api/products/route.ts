import { NextResponse } from "next/server";
import { z } from "zod";

import { createProduct, getAllProducts } from "@/lib/db/queries/product-overrides";

export const revalidate = 0;

const createSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  imageUrl: z.string().refine((v) => { try { new URL(v); return true; } catch { return false; } }).nullable().optional(),
  price: z.number().positive(),
  affiliateUrl: z.string().refine((v) => { try { new URL(v); return true; } catch { return false; } }).nullable().optional(),
  rating: z.number().min(0).max(5).nullable().optional(),
});

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const product = await createProduct({
    title: parsed.data.title,
    category: parsed.data.category,
    imageUrl: parsed.data.imageUrl ?? null,
    price: parsed.data.price,
    affiliateUrl: parsed.data.affiliateUrl ?? null,
    rating: parsed.data.rating ?? null,
  });
  return NextResponse.json(product, { status: 201 });
}
