import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = (searchParams.get("bookId") || "").trim();
    if (!bookId) return NextResponse.json({ items: [] }, { status: 200 });

    const items = await prisma.review.findMany({
      where: { bookId },
      orderBy: [{ upvotes: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    console.error("[REVIEWS/GET] error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const { bookId, rating, content } = await req.json();

    console.log("[REVIEWS/POST] incoming", { bookId, rating, len: content?.length });

    if (!bookId || !content?.trim())
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });

    const ratingNum = Number(rating);
    if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5)
      return NextResponse.json({ error: "rating 1-5" }, { status: 400 });

    const review = await prisma.review.create({
      data: { bookId, content: content.trim(), rating: Math.trunc(ratingNum) },
    });

    console.log("[REVIEWS/POST] created", { id: review.id, bookId: review.bookId });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error("[REVIEWS/POST] error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
