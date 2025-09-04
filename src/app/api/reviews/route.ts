import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

type ReviewBody = {
  bookId?: string;
  rating?: number | string;
  content?: string;
};

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("GET /api/reviews error:", message);
    return NextResponse.json(
      { error: "Internal error", details: message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const raw = (await req.json().catch(() => null)) as ReviewBody | null;
    if (!raw) return NextResponse.json({ error: "JSON inválido" }, { status: 400 });

    const bookId = (raw.bookId || "").trim();
    const content = (raw.content || "").trim();
    const ratingNum = typeof raw.rating === "string" ? Number(raw.rating) : raw.rating;

    if (!bookId || !content) return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    if (!Number.isFinite(ratingNum) || (ratingNum as number) < 1 || (ratingNum as number) > 5)
      return NextResponse.json({ error: "rating 1-5" }, { status: 400 });

    const review = await prisma.review.create({
      data: { bookId, content, rating: Math.trunc(ratingNum as number) },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("POST /api/reviews error:", message);
    return NextResponse.json(
      { error: "Internal error", details: message },
      { status: 500 }
    );
  }
}