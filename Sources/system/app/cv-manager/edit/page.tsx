import { redirect } from 'next/navigation'
import { getAccountSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import CvEditorClient from './CvEditorClient'

export const metadata = { title: 'Chỉnh sửa CV — webdrop.store' }

export default async function CvEditPage() {
  const session = await getAccountSession()
  if (!session) redirect('/login?redirect=/cv-manager/edit')

  const profile = await prisma.cvProfile.findUnique({
    where: { accountId: session.id },
    include: { data: true },
  })

  if (!profile) redirect('/cvs')

  return (
    <CvEditorClient
      profile={{
        id: profile.id,
        accountId: profile.accountId,
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
