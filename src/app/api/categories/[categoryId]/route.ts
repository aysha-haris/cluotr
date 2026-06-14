import { NextResponse } from "next/server";
import { z } from "zod";

import { deleteCategoryOverride, upsertCategoryOverride } from "@/lib/db/queries/category-overrides";

const isValidUrl = (v: string) => { try { new URL(v); return true; } catch { return false; } };
const urlField = z.string().refine((v) => !v || isValidUrl(v), "Invalid URL").nullable().optional();

const schema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  imageUrl: urlField,
  bannerUrl: urlField,
  sortOrder: z.number().int().default(0),
});

interface Params {
  params: Promise<{ categoryId: string }>;
}

export async function PUT(req: Request, { params }: Params) {
  const { categoryId } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const result = await upsertCategoryOverride(categoryId, {
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    imageUrl: parsed.data.imageUrl ?? null,
    bannerUrl: parsed.data.bannerUrl ?? null,
    sortOrder: parsed.data.sortOrder,
  });
  return NextResponse.json(result);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { categoryId } = await params;

  const deleted = await deleteCategoryOverride(categoryId);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
