import { buildGoogleBooksUrl } from "src/lib/business";

export type Book = {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string | null;
};

export async function fetchBooks(query: string): Promise<Book[]> {
  const url = buildGoogleBooksUrl(query);
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  const items = data?.items ?? [];
  return items.map((it: any) => ({
    id: it.id,
    title: it.volumeInfo?.title ?? "Sin título",
    authors: it.volumeInfo?.authors ?? [],
    thumbnail: it.volumeInfo?.imageLinks?.thumbnail ?? null,
  }));
}
