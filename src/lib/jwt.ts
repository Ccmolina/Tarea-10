import { SignJWT, jwtVerify } from "jose";

const secretStr = process.env.JWT_SECRET;
if (!secretStr) throw new Error("JWT_SECRET no configurado");
const secret = new TextEncoder().encode(secretStr);

export async function signJWT(payload: Record<string, unknown>, exp = "7d") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifyJWT(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as { sub?: string; email?: string; [k: string]: unknown };
}
