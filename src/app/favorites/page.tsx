import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { dbConnect } from "@/lib/mongodb";
import { Favorite } from "@/models/Favorite";
import Link from "next/link";

export default async function FavoritesPage() {
  const store = await cookies();
  const token = store.get("token")?.value ?? null;
  if (!token) return <main className="mx-auto max-w-3xl px-4 py-8">Necesitás iniciar sesión.</main>;

  let sub: string | null = null;
  try {
    const payload = await verifyJWT(token);
    sub = typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return <main className="mx-auto max-w-3xl px-4 py-8">Sesión inválida. Volvé a entrar.</main>;
  }
  if (!sub) return <main className="mx-auto max-w-3xl px-4 py-8">Sesión inválida.</main>;

  await dbConnect();
  const list = await Favorite.find({ userId: sub }).sort({ createdAt: -1 }).lean();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="card card-pad">
        <h1 className="text-2xl font-extrabold text-rose-800">Mis favoritos</h1>
        {list.length === 0 ? (
          <p className="muted mt-2">No tenés libros favoritos aún.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {list.map((f: any) => (
              <li key={String(f._id)} className="rounded-2xl border border-rose-100 bg-white/70 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate">{f.bookId}</span>
                  <Link className="btn btn-ghost" href={`/book/${encodeURIComponent(f.bookId)}`}>Ver libro</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
