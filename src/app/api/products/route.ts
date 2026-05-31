import { NextResponse } from "next/server";

import { getProductOverrides } from "@/lib/db/queries/product-overrides";

export const revalidate = 0;

export async function GET() {
  try {
    const overrides = await getProductOverrides();
    return NextResponse.json(overrides);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
