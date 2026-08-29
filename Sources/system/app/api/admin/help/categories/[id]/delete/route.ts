import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return Response.redirect('/admin/login')

  const { id } = await params
  const categoryId = parseInt(id)

  if (isNaN(categoryId)) {
    return Response.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    await prisma.helpCategory.delete({ where: { id: categoryId } })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }

  return Response.redirect('/admin/help')
}
