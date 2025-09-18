import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { getTokenFromCookie } from "@/lib/auth-cookie";
import { verifyJWT } from "@/lib/jwt";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ReviewSchema = z.object({
  bookId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(3).max(2000),
});

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const bookId = (searchParams.get("bookId") || "").trim();

    if (!bookId) return NextResponse.json({ items: [] }, { status: 200 });

    const items = await Review.find({ bookId })
      .sort({ upvotes: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Internal error", details: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const token = await getTokenFromCookie();
    if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { sub } = await verifyJWT(token);
    if (!sub) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const input = ReviewSchema.parse(await req.json());

    const review = await Review.create({
      userId: sub,
      bookId: input.bookId,
      content: input.content,
      rating: input.rating,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Internal error", details: msg }, { status: 500 });
  }
}
