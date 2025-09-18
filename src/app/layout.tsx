import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Libro Reviews",
  description: "Descubre libros y comparte reseñas",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const store = await cookies();                  
  const token = store.get("token")?.value ?? null;

  return (
    <html lang="es">
      <body>
        <header className="border-b border-rose-100 bg-white/70 backdrop-blur">
          <div className="container-pg py-4 flex items-center justify-between">
            <h1 className="text-2xl font-black text-rose-700">
              Libro<span className="text-rose-500">Reviews</span>
            </h1>
            <nav className="flex gap-3">
              <Link href="/" className="btn btn-ghost">Inicio</Link>
              {token ? (
                <>
                  <Link href="/favorites" className="btn btn-ghost">Favoritos</Link>
                  <form action="/api/auth/logout" method="post">
                    <button className="btn btn-ghost">Salir</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn btn-ghost">Login</Link>
                  <Link href="/auth/register" className="btn btn-ghost">Registro</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="container-pg">{children}</main>
        <footer className="container-pg pt-8 text-center muted">💗</footer>
      </body>
    </html>
  );
}
