
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Libro Reviews",
  description: "Descubre libros y comparte reseñas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="border-b border-rose-100 bg-white/70 backdrop-blur">
          <div className="container-pg py-4 flex items-center justify-between">
            <h1 className="text-2xl font-black text-rose-700">
              Libro<span className="text-rose-500">Reviews</span>
            </h1>
            <a href="/" className="btn btn-ghost">Inicio</a>
          </div>
        </header>

        <main className="container-pg">{children}</main>

        <footer className="container-pg pt-8 text-center muted">
           💗 
        </footer>
      </body>
    </html>
  );
}
