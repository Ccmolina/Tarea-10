import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VoteBody = { type?: "up" | "down" };
type VoteCtx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: VoteCtx) {
  const { id } = await ctx.params;          
  const idNum = Number(id);
  if (!Number.isFinite(idNum)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const { type } = (await req.json().catch(() => ({}))) as VoteBody;
  if (type !== "up" && type !== "down") {
    return NextResponse.json({ error: "type debe ser 'up'|'down'" }, { status: 400 });
  }

  try {
    const data =
      type === "up" ? { upvotes: { increment: 1 } } : { downvotes: { increment: 1 } };
    const review = await prisma.review.update({ where: { id: idNum }, data });
    return NextResponse.json({ item: review }, { status: 200 });
  } catch {
  
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
