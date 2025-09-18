import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedApi = [/^\/api\/reviews/, /^\/api\/votes/, /^\/api\/favorites/];

export function middleware(req: NextRequest) {
  if (protectedApi.some((r) => r.test(req.nextUrl.pathname))) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/reviews/:path*", "/api/votes/:path*", "/api/favorites/:path*"]
};
