import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";   
import { Review } from "@/models/Review";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ReviewBody = {
  bookId?: string;
  rating?: number | string;
  content?: string;
};


export async function GET(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const bookId = (searchParams.get("bookId") || "").trim();

    if (!bookId) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const items = await Review.find({ bookId })
      .sort({ upvotes: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ items }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ GET /api/reviews error:", msg);
    return NextResponse.json(
      { error: "Internal error", details: msg },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    await connectMongo();

    const raw = (await req.json().catch(() => null)) as ReviewBody | null;
    if (!raw) {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }

    const bookId = (raw.bookId || "").trim();
    const content = (raw.content || "").trim();
    const ratingNum =
      typeof raw.rating === "string" ? Number(raw.rating) : raw.rating;

  
    if (!bookId || !content) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    if (
      !Number.isFinite(ratingNum) ||
      (ratingNum as number) < 1 ||
      (ratingNum as number) > 5
    ) {
      return NextResponse.json({ error: "El rating debe ser entre 1 y 5" }, { status: 400 });
    }

   
    const review = await Review.create({
      bookId,
      content,
      rating: Math.trunc(ratingNum as number),
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ POST /api/reviews error:", msg);
    return NextResponse.json(
      { error: "Internal error", details: msg },
      { status: 500 }
    );
  }
}
