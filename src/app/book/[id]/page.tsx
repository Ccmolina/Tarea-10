
import Image from "next/image";
import Link from "next/link";
import { dbConnect } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { ReviewForm } from "./review-form";             
import { VoteBar } from "./VoteBar";                  
import { AddFavoriteButton } from "@/components/AddFavoriteButton";

type PageProps = { params: { id: string } };

type VolumeInfo = {
  title?: string;
  authors?: string[];
  description?: string;
  imageLinks?: { thumbnail?: string };
  categories?: string[];
};
type Volume = { id: string; volumeInfo: VolumeInfo };

async function fetchBook(id: string): Promise<Volume> {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("No se pudo obtener el libro");
  return (await res.json()) as Volume;
}

export const revalidate = 3600;

export default async function BookPage({ params }: PageProps) {
  const { id } = params;
  const book = await fetchBook(id);

  await dbConnect();
  const reviews = await Review.find({ bookId: id }).sort({ createdAt: -1 }).lean();

  const thumb = book.volumeInfo.imageLinks?.thumbnail
    ? book.volumeInfo.imageLinks.thumbnail.replace("http://", "https://")
    : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-6">
        <Link href="/" className="underline">← Volver al inicio</Link>
      </nav>

      <div className="card card-pad">
        <div className="flex gap-5">
          {thumb ? (
            <Image
              src={thumb}
              alt={book.volumeInfo.title ?? "Portada"}
              width={120}
              height={180}
              className="rounded-xl border border-rose-100"
              
            />
          ) : (
            <div className="w-[120px] h-[180px] rounded-xl bg-rose-50 border border-rose-100" />
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-rose-800">
              {book.volumeInfo.title ?? "Sin título"}
            </h1>

            {book.volumeInfo.authors?.length ? (
              <p className="muted mt-1">{book.volumeInfo.authors.join(", ")}</p>
            ) : null}

            {book.volumeInfo.categories?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {book.volumeInfo.categories.map((c) => (
                  <span key={c} className="badge">{c}</span>
                ))}
              </div>
            ) : null}

            <div className="mt-3">
              <AddFavoriteButton bookId={id} className="btn btn-rose" />
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-xl font-bold text-rose-800">Descripción</h2>
        <article
          className="prose mt-2"
          dangerouslySetInnerHTML={{
            __html: book.volumeInfo.description ?? "<p>Sin descripción.</p>",
          }}
        />
      </div>

      
      <section className="mt-6">
        <div className="card">
          <div className="card-pad">
            <h2 className="text-2xl font-extrabold text-rose-800">
              Reseñas de la comunidad
            </h2>

            <div className="mt-4 rounded-2xl border border-rose-100 bg-white/70 p-4">
              <ReviewForm bookId={id} />
            </div>

            <div className="mt-6">
              {reviews.length === 0 ? (
                <p className="muted">No hay reseñas aún. ¡Sé el primero!</p>
              ) : (
                <ul className="space-y-4">
                  {reviews.map((r: any) => (
                    <li
                      key={String(r._id)}
                      className="rounded-2xl border border-rose-100 bg-white/70 p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-rose-700">⭐ {r.rating}/5</span>
                          <p className="mt-1">{r.content}</p>
                        </div>
                        <span className="muted text-xs">
                          {new Date(r.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <VoteBar
                        id={String(r._id)}
                        up={r.upvotes ?? 0}
                        down={r.downvotes ?? 0}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
