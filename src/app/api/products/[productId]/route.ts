import { NextResponse } from "next/server";
import { z } from "zod";

import { deleteProduct, updateProduct } from "@/lib/db/queries/product-overrides";

const updateSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  imageUrl: z.string().refine((v) => { try { new URL(v); return true; } catch { return false; } }).nullable().optional(),
  price: z.number().positive(),
  affiliateUrl: z.string().refine((v) => { try { new URL(v); return true; } catch { return false; } }).nullable().optional(),
  rating: z.number().min(0).max(5).nullable().optional(),
});

interface Params {
  params: Promise<{ productId: string }>;
}

export async function PUT(req: Request, { params }: Params) {
  const { productId } = await params;
  const id = parseInt(productId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid productId" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const result = await updateProduct(id, {
    title: parsed.data.title,
    category: parsed.data.category,
    imageUrl: parsed.data.imageUrl ?? null,
    price: parsed.data.price,
    affiliateUrl: parsed.data.affiliateUrl ?? null,
    rating: parsed.data.rating ?? null,
  });
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { productId } = await params;
  const id = parseInt(productId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid productId" }, { status: 400 });

  const deleted = await deleteProduct(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
