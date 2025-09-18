import Image from "next/image";
import Link from "next/link";
import { dbConnect } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { VoteBar } from "./VoteBar";

type PageProps = {
  params: { id: string };
};

type VolumeInfo = {
  title?: string;
  authors?: string[];
  description?: string;
  imageLinks?: { thumbnail?: string };
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

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-6">
        <Link href="/" className="underline">← Volver al inicio</Link>
      </nav>

      <h1 className="text-2xl font-bold">{book.volumeInfo.title ?? "Sin título"}</h1>
      {book.volumeInfo.authors?.length && <p>Autor(es): {book.volumeInfo.authors.join(", ")}</p>}
      {book.volumeInfo.imageLinks?.thumbnail && (
        <Image src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title ?? "Portada"} width={200} height={300} />
      )}
      <article dangerouslySetInnerHTML={{ __html: book.volumeInfo.description ?? "" }} className="prose" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Reseñas</h2>
        {reviews.length === 0 && <p>No hay reseñas aún.</p>}
        <ul className="space-y-4">
          {reviews.map((r: any) => (
            <li key={String(r._id)} className="border rounded p-3">
              <p className="font-medium">{r.content}</p>
              <p className="text-sm text-gray-600">Rating: {r.rating} ⭐</p>
              <VoteBar id={String(r._id)} up={r.upvotes} down={r.downvotes} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
