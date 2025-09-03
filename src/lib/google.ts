const BASE = 'https://www.googleapis.com/books/v1/volumes'

type VolumeInfo = {
  title?: string
  authors?: string[]
  imageLinks?: { thumbnail?: string; smallThumbnail?: string }
  pageCount?: number
  categories?: string[]
  publishedDate?: string
  description?: string
}

type GoogleItem = { id: string; volumeInfo?: VolumeInfo }
type GoogleSearch = { totalItems?: number; items?: GoogleItem[] }

// Normaliza el libro que devuelve Google
function normalizar(item: GoogleItem) {
  const v = item.volumeInfo ?? {}
  const img = v.imageLinks ?? {}
  return {
    id: item.id,
    titulo: v.title ?? 'Sin título',
    autores: (v.authors ?? []).join(', ') || null,
    portada: img.thumbnail ?? img.smallThumbnail ?? null,
    paginas: v.pageCount ?? null,
    categorias: (v.categories ?? []).join(', ') || null,
    fechaPublicacion: v.publishedDate ?? null,
    descripcion: v.description ?? null,
  }
}

// Busca libros por título, autor o ISBN
export async function buscarLibros(q: string, startIndex = 0) {
  if (!q) return { items: [], total: 0 }
  const url = `${BASE}?q=${encodeURIComponent(q)}&maxResults=20&startIndex=${startIndex}`
  const res = await fetch(url, { cache: 'no-store' })
  const data: GoogleSearch = await res.json()
  const items = (data.items ?? []).map(normalizar)
  return { items, total: data.totalItems ?? 0 }
}

export async function libroPorId(id: string) {
  // ¿Es una consulta tipo "isbn:...", "inauthor:...", etc.?
  if (id.includes(':')) {
    const buscado = await buscarLibros(id, 0)
    const primero = buscado.items[0]
    if (primero) return primero

    // Sin resultados: devolver estructura 
    return {
      id,
      titulo: 'Sin título',
      autores: null,
      portada: null,
      paginas: null,
      categorias: null,
      fechaPublicacion: null,
      descripcion: null,
    }
  }

  // volumeId real
  const res = await fetch(`${BASE}/${id}`, { cache: 'no-store' })
  const data: GoogleItem = await res.json()
  return normalizar(data)
}
