import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const faqItems = await prisma.faqItem.findMany({
      orderBy: [{ groupKey: 'asc' }, { sortOrder: 'asc' }],
    })

    // Group items by groupKey
    const grouped = faqItems.reduce(
      (acc, item) => {
        if (!acc[item.groupKey]) {
          acc[item.groupKey] = []
        }
        acc[item.groupKey].push({
          q: item.question,
          a: item.answer,
        })
        return acc
      },
      {} as Record<string, Array<{ q: string; a: string }>>
    )

    // Convert to array format with group names
    const groupNames: Record<string, string> = {
      'mua-tai-template': 'Gói Template',
      'goi-web-co-ban': 'Gói Web cơ bản',
      'goi-theo-yeu-cau': 'Gói Theo Yêu cầu',
      'thanh-toan-bao-hanh': 'Thanh toán & Bảo hành',
    }

    const faqGroups = Object.entries(grouped).map(([key, items]) => ({
      group: groupNames[key] || key,
      items,
    }))

    return Response.json(faqGroups)
  } catch (error) {
    console.error('FAQ fetch error:', error)
    return Response.json({ error: 'Failed to fetch FAQ' }, { status: 500 })
  }
}
