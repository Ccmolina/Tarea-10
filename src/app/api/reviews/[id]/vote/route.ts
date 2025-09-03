import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null)
  const type = (body as any)?.type as 'up'|'down'|undefined
  if (!type) return NextResponse.json({ error: 'Falta type' }, { status: 400 })
  const idNum = Number(params.id)
  if (Number.isNaN(idNum)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const review = await prisma.review.update({
    where: { id: idNum },
    data: type === 'up' ? { upvotes: { increment: 1 } } : { downvotes: { increment: 1 } },
  })
  return NextResponse.json(review)
}
