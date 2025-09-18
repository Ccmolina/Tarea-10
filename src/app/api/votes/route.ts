export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { getTokenFromCookie } from "@/lib/auth-cookie";
import { verifyJWT } from "@/lib/jwt";
import { VoteSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const token = await getTokenFromCookie();
    if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload?.sub) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const { reviewId, type } = VoteSchema.parse(await req.json());

    const inc = type === "up" ? { upvotes: 1 } : { downvotes: 1 };
    const updated = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: inc },
      { new: true }
    ).lean();

    if (!updated) return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 });

    return NextResponse.json({ item: updated }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Internal error", details: msg }, { status: 500 });
  }
}


export function GET() { return new Response("Method Not Allowed", { status: 405 }); }
export const PUT = GET; export const PATCH = GET; export const DELETE = GET;
