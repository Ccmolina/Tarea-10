import { NextResponse } from "next/server";
import { clearAuthCookieOn } from "@/lib/auth-cookie";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearAuthCookieOn(res);
  return res;
}
