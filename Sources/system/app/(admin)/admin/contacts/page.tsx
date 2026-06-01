export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import ContactList from './ContactList'

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { status, page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr || '1'))
  const limit = 20

  const where = status && status !== 'all' ? { status: status as 'new' | 'read' | 'replied' } : {}

  let contacts: Array<{
    id: number; name: string; email: string | null; phone: string | null
    subject: string | null; message: string; status: string; createdAt: Date
  }> = []
  let total = 0
  let counts = { all: 0, new: 0, read: 0, replied: 0 }

  try {
    const [rows, cnt, newC, readC, repliedC] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contact.count({ where }),
      prisma.contact.count({ where: { status: 'new' } }),
      prisma.contact.count({ where: { status: 'read' } }),
      prisma.contact.count({ where: { status: 'replied' } }),
    ])
    contacts = rows
    total = cnt
    counts = { all: newC + readC + repliedC, new: newC, read: readC, replied: repliedC }
  } catch { /* DB offline */ }

  const pages = Math.ceil(total / limit)

  return (
    <AdminLayout title="Liên hệ">
      <ContactList
        contacts={contacts} total={total} page={page} pages={pages}
        currentStatus={status || 'all'} counts={counts}
      />
    </AdminLayout>
  )
}
