import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchBooks } from "src/lib/api"; 

afterEach(() => vi.restoreAllMocks());

describe("fetchBooks (API)", () => {
  it("mapea respuesta OK y usa la URL construida", async () => {
    const mockFetch = vi
      .spyOn(global, "fetch" as any)
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            { id: "1", volumeInfo: { title: "1984", authors: ["Orwell"], imageLinks: { thumbnail: "t1" } } },
            { id: "2", volumeInfo: { title: "F451", authors: ["Bradbury"] } }
          ]
        })
      } as any);

    const books = await fetchBooks("El  principito");
    expect(books).toHaveLength(2);
    expect(books[0]).toMatchObject({ id: "1", title: "1984", authors: ["Orwell"], thumbnail: "t1" });

    
    const calledWith = (mockFetch.mock.calls[0]?.[0] ?? "") as string;
    expect(calledWith).toContain("q=el%20principito");
    expect(calledWith).toContain("maxResults=20");
    expect(calledWith).toContain("startIndex=0");
  });

  it("lanza error si la API responde !ok", async () => {
    vi.spyOn(global, "fetch" as any).mockResolvedValue({ ok: false } as any);
    await expect(fetchBooks("x")).rejects.toThrow("API error");
  });

  it("tolera campos faltantes (fallbacks)", async () => {
    vi.spyOn(global, "fetch" as any).mockResolvedValue({
      ok: true,
      json: async () => ({ items: [{}] })
    } as any);

    const [b] = await fetchBooks("x");
    expect(b.title).toBe("Sin título");
    expect(b.authors).toEqual([]);
    expect(b.thumbnail).toBeNull();
  });

  it("propaga errores de red (reject)", async () => {
    vi.spyOn(global, "fetch" as any).mockRejectedValue(new Error("Network"));
    await expect(fetchBooks("fallo")).rejects.toThrow("Network");
  });
});
