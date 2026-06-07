import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authed = req.cookies.get("admin_authed")?.value === "1";
  return authed
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
