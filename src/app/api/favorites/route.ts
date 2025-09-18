import { dbConnect } from "@/lib/mongodb";
import { Favorite } from "@/models/Favorite";
import { FavoriteSchema } from "@/lib/validation";
import { getTokenFromCookie } from "@/lib/auth-cookie";
import { verifyJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  await dbConnect();
  const token = await getTokenFromCookie();
  if (!token) return new Response("No autorizado", { status: 401 });
  const { sub } = await verifyJWT(token);

  const { bookId } = FavoriteSchema.parse(await req.json());
  const fav = await Favorite.findOneAndUpdate(
    { userId: sub, bookId },
    { $setOnInsert: { userId: sub, bookId } },
    { upsert: true, new: true }
  );

  return new Response(JSON.stringify(fav), {
    status: 201,
    headers: { "content-type": "application/json" }
  });
}

export async function GET() {
  await dbConnect();
  const token = await getTokenFromCookie();
  if (!token) return new Response("No autorizado", { status: 401 });
  const { sub } = await verifyJWT(token);

  const list = await Favorite.find({ userId: sub }).lean();
  return new Response(JSON.stringify(list), {
    headers: { "content-type": "application/json" }
  });
}
