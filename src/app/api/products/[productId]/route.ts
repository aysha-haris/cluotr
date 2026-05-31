import { NextResponse } from "next/server";
import { z } from "zod";

import { deleteProductOverride, upsertProductOverride } from "@/lib/db/queries/product-overrides";

const schema = z.object({
  title: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
});

interface Params {
  params: Promise<{ productId: string }>;
}

export async function PUT(req: Request, { params }: Params) {
  const { productId } = await params;
  const id = parseInt(productId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid productId" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const result = await upsertProductOverride(id, {
    title: parsed.data.title ?? null,
    category: parsed.data.category ?? null,
    imageUrl: parsed.data.imageUrl ?? null,
  });
  return NextResponse.json(result);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { productId } = await params;
  const id = parseInt(productId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid productId" }, { status: 400 });

  const deleted = await deleteProductOverride(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
