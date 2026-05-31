import { NextResponse } from "next/server";

import { getCategoryOverrides } from "@/lib/db/queries/category-overrides";

export const revalidate = 0;

export async function GET() {
  try {
    const categories = await getCategoryOverrides();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
