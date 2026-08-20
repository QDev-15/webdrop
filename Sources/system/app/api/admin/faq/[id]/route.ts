import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { FAQ_GROUPS, isValidFaqGroup } from '@/lib/faq'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const faqId = parseInt(id)
  if (isNaN(faqId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  try {
    const faq = await prisma.faqItem.findUnique({ where: { id: faqId } })
    if (!faq) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json(faq)
  } catch (e) {
    console.error('Error fetching FAQ:', e)
    return NextResponse.json({ error: 'Lỗi lấy dữ liệu' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const faqId = parseInt(id)
  if (isNaN(faqId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  try {
    const { question, answer, groupKey, sortOrder } = await req.json()

    // Validation
    if (question !== undefined && question !== null && question.trim().length < 10) {
      return NextResponse.json({ error: 'Câu hỏi phải có ít nhất 10 ký tự' }, { status: 400 })
    }
    if (answer !== undefined && answer !== null && answer.trim().length < 20) {
      return NextResponse.json({ error: 'Câu trả lời phải có ít nhất 20 ký tự' }, { status: 400 })
    }
    if (groupKey !== undefined && !isValidFaqGroup(groupKey)) {
      return NextResponse.json({ error: 'Nhóm không hợp lệ' }, { status: 400 })
    }

    const faq = await prisma.faqItem.update({
      where: { id: faqId },
      data: {
        ...(question !== undefined && { question: question.trim() }),
        ...(answer !== undefined && { answer: answer.trim() }),
        ...(groupKey !== undefined && { groupKey }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    })

    return NextResponse.json(faq)
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    console.error('Error updating FAQ:', e)
    return NextResponse.json({ error: 'Lỗi cập nhật FAQ' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const faqId = parseInt(id)
  if (isNaN(faqId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  try {
    await prisma.faqItem.delete({ where: { id: faqId } })
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    console.error('Error deleting FAQ:', e)
    return NextResponse.json({ error: 'Lỗi xóa FAQ' }, { status: 500 })
  }
}
