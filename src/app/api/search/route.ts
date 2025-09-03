import { NextResponse } from 'next/server'
import { buscarLibros } from '@/lib/google'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const startIndex = Number(searchParams.get('startIndex') ?? 0)
  const data = await buscarLibros(q, startIndex)
  return NextResponse.json(data)
}
