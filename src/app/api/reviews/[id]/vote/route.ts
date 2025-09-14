import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VoteBody = { type?: "up" | "down" };

export async function POST(
  req: Request,
  { params }: { params: { id: string } } 
) {
  try {
    const idNum = Number(params.id); 
    if (!Number.isFinite(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const raw = (await req.json().catch(() => null)) as VoteBody | null;
    const type = raw?.type;

    if (type !== "up" && type !== "down") {
      return NextResponse.json({ error: "type debe ser 'up'|'down'" }, { status: 400 });
    }

    const data =
      type === "up"
        ? { upvotes: { increment: 1 } }
        : { downvotes: { increment: 1 } };

    const review = await prisma.review.update({ where: { id: idNum }, data });
    return NextResponse.json(review, { status: 200 });
  } catch (err) {
    console.error("POST /api/reviews/[id]/vote error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

