export const runtime = "nodejs";

import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/validation";
import { signJWT } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { setAuthCookieOn } from "@/lib/auth-cookie";

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = LoginSchema.parse(await req.json());

  const user = await User.findOne({ email });
  if (!user) return new Response("Credenciales inválidas", { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return new Response("Credenciales inválidas", { status: 401 });

  const token = await signJWT({ sub: String(user._id), email: user.email });

  const res = NextResponse.json({ ok: true });
  setAuthCookieOn(res, token);
  return res;
}
