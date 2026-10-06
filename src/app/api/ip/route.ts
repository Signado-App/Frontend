import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfIp = req.headers.get("cf-connecting-ip");

  let ip =
    cfIp ||
    (forwarded ? forwarded.split(",")[0].trim() : null) ||
    realIp ||
    "";

  // Filter out internal localhost addresses so client can fallback to external lookup if in local dev
  if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") {
    ip = "";
  }

  return NextResponse.json({ ip });
}
