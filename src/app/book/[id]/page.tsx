
import Image from "next/image";
import Link from "next/link";

type PageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

type VolumeInfo = {
  title?: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  language?: string;
};

type Volume = {
  id: string;
  volumeInfo: VolumeInfo;
};

async function fetchBook(id: string): Promise<Volume> {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`, {
    
    next: { revalidate: 3600 },
  });

  if (res.status === 404) {
    
    throw new Error("Libro no encontrado");
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al obtener el libro (${res.status}): ${text}`);
  }

  const data = (await res.json()) as Volume;
  if (!data?.id || !data?.volumeInfo) {
    throw new Error("Respuesta inválida de Google Books");
  }
  return data;
}

function normalizeDescription(html?: string): string {
  
  return html ?? "";
}

function formatAuthors(authors?: string[]): string | null {
  if (!authors || authors.length === 0) return null;
  return authors.join(", ");
}

export const dynamic = "force-static"; // o "auto"; está bien para esta página
export const revalidate = 3600; // 1 hora

export default async function BookPage({ params }: PageProps) {
  const { id } = params;
  const book = await fetchBook(id);
  const v = book.volumeInfo;

  const title = v.title ?? "Sin título";
  const authors = formatAuthors(v.authors);
  const cover =
    v.imageLinks?.thumbnail ||
    v.imageLinks?.smallThumbnail ||
    undefined;

  const description = normalizeDescription(v.description);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-6 text-sm">
        <Link href="/" className="underline hover:no-underline">
          ← Volver al inicio
        </Link>
      </nav>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr]">
        <div className="flex items-start justify-center">
          {cover ? (
            <Image
              src={cover.replace("http://", "https://")}
              alt={title}
              width={200}
              height={300}
              className="rounded-xl shadow"
              priority
            />
          ) : (
            <div className="flex h-[300px] w-[200px] items-center justify-center rounded-xl bg-gray-100 text-gray-500">
              Sin portada
            </div>
          )}
        </div>

        <div>
          <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
          {authors && <p className="mb-3 text-gray-700">Autor(es): {authors}</p>}

          <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-gray-600 sm:grid-cols-3">
            {v.publisher && (
              <div>
                <span className="font-medium">Editorial:</span> {v.publisher}
              </div>
            )}
            {v.publishedDate && (
              <div>
                <span className="font-medium">Fecha:</span> {v.publishedDate}
              </div>
            )}
            {typeof v.pageCount === "number" && (
              <div>
                <span className="font-medium">Páginas:</span> {v.pageCount}
              </div>
            )}
            {v.categories?.length ? (
              <div className="col-span-2 sm:col-span-1">
                <span className="font-medium">Categorías:</span>{" "}
                {v.categories.join(", ")}
              </div>
            ) : null}
            {typeof v.averageRating === "number" && (
              <div>
                <span className="font-medium">Rating:</span> {v.averageRating} ⭐
                {typeof v.ratingsCount === "number" ? ` (${v.ratingsCount})` : ""}
              </div>
            )}
            {v.language && (
              <div>
                <span className="font-medium">Idioma:</span> {v.language.toUpperCase()}
              </div>
            )}
          </div>

          <article
            className="prose max-w-none prose-p:leading-relaxed prose-headings:mt-6 prose-headings:mb-3"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          
          <div className="mt-8 flex gap-3">
            <Link
              href={`/reviews/new?bookId=${encodeURIComponent(book.id)}`}
              className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90"
            >
              Escribir reseña
            </Link>
            <form action={`/api/favorites`} method="post">
              <input type="hidden" name="bookId" value={book.id} />
              <button
                className="rounded-xl border px-4 py-2 hover:bg-gray-50"
                type="submit"
              >
                Agregar a Favoritos
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
