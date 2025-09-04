import { buildGoogleBooksUrl } from "@/lib/business";

export type Book = {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string | null;
};

type GVolume = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    imageLinks?: { thumbnail?: string };
  };
};

type GVolumesResponse = { items?: GVolume[] };

export async function fetchBooks(query: string): Promise<Book[]> {
  const url = buildGoogleBooksUrl(query);
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");
  const data = (await res.json()) as GVolumesResponse;

  return (data.items ?? []).map((it) => ({
    id: it.id,
    title: it.volumeInfo?.title ?? "Sin título",
    authors: it.volumeInfo?.authors ?? [],
    thumbnail: it.volumeInfo?.imageLinks?.thumbnail ?? null,
  }));
}
