import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const bookId = searchParams.get('bookId') ?? ''
  if (!bookId) return NextResponse.json({ items: [] })
  const items = await prisma.review.findMany({
    where: { bookId },
    orderBy: [{ upvotes: 'desc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json({ items })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const { bookId, rating, content } = (body ?? {}) as { bookId?: string; rating?: number; content?: string }
  if (!bookId || !rating || !content) return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  if (rating < 1 || rating > 5) return NextResponse.json({ error: 'rating 1-5' }, { status: 400 })

  const review = await prisma.review.create({ data: { bookId, rating, content } })
  return NextResponse.json(review, { status: 201 })
}
