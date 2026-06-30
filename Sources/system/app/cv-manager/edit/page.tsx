import { redirect } from 'next/navigation'
import { getCvSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import CvEditorClient from './CvEditorClient'

export const metadata = { title: 'Chỉnh sửa CV — webdrop.store' }

export default async function CvEditPage() {
  const session = await getCvSession()
  if (!session) redirect('/cv-manager/login')

  const profile = await prisma.cvProfile.findUnique({
    where: { userId: session.id },
    include: { data: true },
  })

  if (!profile) redirect('/cvs')

  return (
    <CvEditorClient
      profile={{
        id: profile.id,
        userId: profile.userId,
        templateType: profile.templateType,
        slug: profile.slug,
        isPublic: profile.isPublic,
      }}
      initialData={profile.data ? {
        ...profile.data,
        experience: (profile.data.experience ?? []) as unknown[],
        education: (profile.data.education ?? []) as unknown[],
        skills: (profile.data.skills ?? []) as unknown[],
        projects: (profile.data.projects ?? []) as unknown[],
        certifications: (profile.data.certifications ?? []) as unknown[],
        languages: (profile.data.languages ?? []) as unknown[],
      } : null}
    />
  )
}
