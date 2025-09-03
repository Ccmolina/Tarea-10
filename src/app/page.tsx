'use client'
import { useState } from 'react'
import Link from 'next/link'

type Libro = {
  id: string
  titulo: string | null
  autores: string | null
  portada: string | null
  paginas: number | null
  categorias: string | null
  fechaPublicacion: string | null
  descripcion: string | null
}

export default function Page() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState<Libro[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function buscar() {
    try {
      setError(null); setCargando(true)
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setItems(data.items ?? [])
    } catch {
      setError('Ocurrió un error buscando libros.')
    } finally { setCargando(false) }
  }

  return (
    <div className="space-y-6">
      <div className="card card-pad">
        <h2 className="h1 mb-3">Descubre libros</h2>
        <form onSubmit={(e)=>{e.preventDefault(); buscar()}} className="flex flex-col sm:flex-row gap-3">
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Título, autor o ISBN…"
            className="input"
          />
          <button className="btn btn-rose whitespace-nowrap" disabled={cargando}>
            {cargando ? 'Buscando…' : 'Buscar'}
          </button>
        </form>
        {error && <p className="mt-3 text-rose-700">{error}</p>}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map(b => (
          <li key={b.id} className="card overflow-hidden">
            <Link href={`/book/${b.id}`} className="flex gap-4 card-pad hover:bg-rose-50/40 transition">
              <img
                src={b.portada || 'https://via.placeholder.com/96x144?text=No+Img'}
                alt={b.titulo || 'Libro'}
                className="w-24 h-36 object-cover rounded-xl border border-rose-100"
              />
              <div className="min-w-0">
                <h3 className="font-semibold text-lg text-rose-800 truncate">{b.titulo}</h3>
                <p className="muted truncate">{b.autores || 'Autor desconocido'}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {b.fechaPublicacion && <span className="badge">{b.fechaPublicacion}</span>}
                  {b.categorias && <span className="badge">{b.categorias}</span>}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
