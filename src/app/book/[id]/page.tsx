import Image from "next/image";
import Link from "next/link";
import { libroPorId } from "@/lib/google";
import { ReviewForm } from "./review-form";
import { VoteBar } from "./VoteBar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Libro = {
  id: string;
  titulo: string | null;
  autores: string | null;
  portada: string | null;
  paginas: number | null;
  categorias: string | null;
  fechaPublicacion: string | null;
  descripcion: string | null;
};

export default async function BookPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const libro: Libro = await libroPorId(id);

  const reviews = await prisma.review.findMany({
    where: { bookId: id },
    orderBy: [{ upvotes: "desc" }, { createdAt: "desc" }],
  });

  const toHttps = (u?: string | null) =>
    u ? u.replace(/^http:\/\//, "https://") : null;

  return (
    <div className="relative space-y-6">
      <Link href="/" className="text-rose-700 hover:underline">
        &larr; Volver
      </Link>

      
      <div className="card card-pad relative z-10">
        <div className="flex flex-col sm:flex-row gap-6">
          {toHttps(libro.portada) ? (
            <Image
              src={toHttps(libro.portada)!}
              alt={libro.titulo || "Libro"}
              width={160}
              height={240}
              className="w-40 h-60 object-cover rounded-2xl border border-rose-100"
              priority
            />
          ) : (
            <Image
              src="https://via.placeholder.com/160x240?text=No+Img"
              alt={libro.titulo || "Libro"}
              width={160}
              height={240}
              className="w-40 h-60 object-cover rounded-2xl border border-rose-100"
              priority
            />
          )}

          <div className="flex-1 min-w-0">
            <h1 className="h1">{libro.titulo}</h1>
            <p className="muted mt-1">{libro.autores || "Autor desconocido"}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {libro.fechaPublicacion && (
                <span className="badge">
                  Publicado: {libro.fechaPublicacion}
                </span>
              )}
              {libro.paginas && <span className="badge">{libro.paginas} páginas</span>}
              {libro.categorias && <span className="badge">{libro.categorias}</span>}
            </div>
          </div>
        </div>

        {libro.descripcion && (
          <section className="mt-6">
            <h2 className="h2 mb-2">Descripción</h2>
            <p className="text-slate-800 leading-relaxed">{libro.descripcion}</p>
          </section>
        )}
      </div>

      
      <section className="card card-pad relative z-10">
        <h2 className="h2 mb-4">Reseñas de la comunidad</h2>

        <ReviewForm bookId={id} />

        <ul className="mt-6 grid gap-4">
          {reviews.length === 0 && (
            <li className="muted">Sé el primero en reseñar.</li>
          )}

          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-rose-100 p-4 bg-rose-50/40"
            >
              <div className="flex justify-between items-center">
                <span className="text-rose-700 font-semibold">⭐ {r.rating}/5</span>
                <span className="text-xs text-slate-500">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-slate-800">{r.content}</p>
              <VoteBar id={r.id} up={r.upvotes} down={r.downvotes} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
