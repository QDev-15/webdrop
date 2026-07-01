import { redirect } from 'next/navigation'
import { getCvSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function CvManagerPage() {
  const session = await getCvSession()
  if (!session) redirect('/cv-manager/login')

  const profile = await prisma.cvProfile.findUnique({ where: { userId: session.id } })
  if (!profile) redirect('/cvs')

  redirect('/cv-manager/edit')
}
