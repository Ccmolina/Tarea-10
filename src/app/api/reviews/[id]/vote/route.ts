import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { getTokenFromCookie } from "@/lib/auth-cookie";
import { verifyJWT } from "@/lib/jwt";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PatchSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  content: z.string().min(3).max(2000).optional(),
});

type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
  await dbConnect();
  const token = await getTokenFromCookie();
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { sub } = await verifyJWT(token);
  if (!sub) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const input = PatchSchema.parse(await req.json());
  const review = await Review.findById(params.id);
  if (!review) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  if (String(review.userId) !== String(sub)) {
    return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  }

  Object.assign(review, input);
  await review.save();
  return NextResponse.json(review, { status: 200 });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  await dbConnect();
  const token = await getTokenFromCookie();
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { sub } = await verifyJWT(token);
  if (!sub) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const review = await Review.findById(params.id);
  if (!review) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  if (String(review.userId) !== String(sub)) {
    return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  }

  await review.deleteOne();
  return NextResponse.json({ ok: true }, { status: 200 });
}
