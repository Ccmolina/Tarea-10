export const runtime = "nodejs";

import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/lib/validation";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const { email, password, name } = RegisterSchema.parse(body);

  const exists = await User.findOne({ email });
  if (exists) return new Response("Email ya registrado", { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name });

  return new Response(JSON.stringify({ id: user._id, email: user.email }), {
    status: 201,
    headers: { "content-type": "application/json" }
  });
}
