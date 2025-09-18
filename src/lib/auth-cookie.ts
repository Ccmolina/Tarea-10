import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const cookieName = "token";


export async function getTokenFromCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(cookieName)?.value ?? null;
}


export function setAuthCookieOn(res: NextResponse, token: string) {
  res.cookies.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}


export function clearAuthCookieOn(res: NextResponse) {
  res.cookies.delete(cookieName);
}
