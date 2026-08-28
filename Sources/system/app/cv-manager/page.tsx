import { redirect } from 'next/navigation'
import { getAccountSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function CvManagerPage() {
  const session = await getAccountSession()
  if (!session) redirect('/login?redirect=/cv-manager/edit')

  const profile = await prisma.cvProfile.findUnique({ where: { accountId: session.id } })
  if (!profile) redirect('/cvs')

  redirect('/cv-manager/edit')
}
