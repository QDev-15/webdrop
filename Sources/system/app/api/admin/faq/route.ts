import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { FAQ_GROUPS, isValidFaqGroup } from '@/lib/faq'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const faqs = await prisma.faqItem.findMany({
      orderBy: [{ groupKey: 'asc' }, { sortOrder: 'asc' }],
    })
    return NextResponse.json({ faqs })
  } catch (e) {
    console.error('Error fetching FAQs:', e)
    return NextResponse.json({ error: 'Lỗi lấy dữ liệu' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { question, answer, groupKey, sortOrder } = await req.json()

    // Validation
    if (!question || question.trim().length < 10) {
      return NextResponse.json({ error: 'Câu hỏi phải có ít nhất 10 ký tự' }, { status: 400 })
    }
    if (!answer || answer.trim().length < 20) {
      return NextResponse.json({ error: 'Câu trả lời phải có ít nhất 20 ký tự' }, { status: 400 })
    }
    if (!groupKey || !isValidFaqGroup(groupKey)) {
      return NextResponse.json({ error: 'Nhóm không hợp lệ' }, { status: 400 })
    }

    const faq = await prisma.faqItem.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        groupKey,
        sortOrder: sortOrder || 0,
      },
    })

    return NextResponse.json(faq, { status: 201 })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') return NextResponse.json({ error: 'Câu hỏi đã tồn tại' }, { status: 409 })
    console.error('Error creating FAQ:', e)
    return NextResponse.json({ error: 'Lỗi tạo FAQ' }, { status: 500 })
  }
}
