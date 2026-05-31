import { NextResponse } from "next/server";
import { z } from "zod";

import { deleteAffiliateLink, upsertAffiliateLink } from "@/lib/db/queries/affiliate-links";

const schema = z.object({
  url: z.string().default(""),
  price: z.number().positive().nullable().optional(),
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

  const result = await upsertAffiliateLink(id, {
    url: parsed.data.url,
    price: parsed.data.price ?? null,
  });
  return NextResponse.json(result);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { productId } = await params;
  const id = parseInt(productId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid productId" }, { status: 400 });

  const deleted = await deleteAffiliateLink(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
