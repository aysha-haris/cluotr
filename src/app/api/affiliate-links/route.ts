import { NextResponse } from "next/server";

import { getAffiliateLinks } from "@/lib/db/queries/affiliate-links";

export const revalidate = 60;

export async function GET() {
  try {
    const links = await getAffiliateLinks();
    return NextResponse.json(links);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
