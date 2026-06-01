import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { content } = await req.json()

  if (!content?.trim()) return NextResponse.json({ error: 'Nội dung không được trống' }, { status: 400 })

  try {
    const note = await prisma.projectNote.create({
      data: { projectId: parseInt(id), content: content.trim(), createdBy: session.id },
      include: { createdByUser: { select: { name: true } } },
    })
    return NextResponse.json(note, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Lỗi thêm ghi chú' }, { status: 500 })
  }
}
