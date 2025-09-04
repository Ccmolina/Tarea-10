import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type VoteBody = { type?: "up" | "down" };

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params; 
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const raw = (await req.json().catch(() => null)) as VoteBody | null;
    const type = raw?.type;
    if (type !== "up" && type !== "down") {
      return NextResponse.json({ error: "type debe ser 'up'|'down'" }, { status: 400 });
    }

    const data =
      type === "up" ? { upvotes: { increment: 1 } } : { downvotes: { increment: 1 } };

    const review = await prisma.review.update({ where: { id: idNum }, data });
    return NextResponse.json(review, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Internal error", details: message },
      { status: 500 }
    );
  }
}
