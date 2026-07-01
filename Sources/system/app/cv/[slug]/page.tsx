import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CvPreview from '@/components/cv/CvPreview'
import type { CvDataType } from '@/types/cv'

export const dynamic = 'force-dynamic'

export default async function CvPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const profile = await prisma.cvProfile.findUnique({
    where: { slug },
    include: { data: true },
  })

  if (!profile || !profile.isPublic) notFound()

  const cvData: CvDataType = profile.data ? {
    ...profile.data,
    experience: (profile.data.experience ?? []) as unknown as CvDataType['experience'],
    education: (profile.data.education ?? []) as unknown as CvDataType['education'],
    skills: (profile.data.skills ?? []) as unknown as CvDataType['skills'],
    projects: (profile.data.projects ?? []) as unknown as CvDataType['projects'],
    certifications: (profile.data.certifications ?? []) as unknown as CvDataType['certifications'],
    languages: (profile.data.languages ?? []) as unknown as CvDataType['languages'],
  } : {}

  const name = profile.data?.fullName || 'CV'
  const title = profile.data?.jobTitle || ''

  return (
    <>
      <title>{[name, title].filter(Boolean).join(' — ')}</title>
      <meta name="robots" content="noindex, nofollow" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />

      <div style={{ minHeight: '100vh', background: '#f5f0e8', padding: '32px 16px', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 20px 52px rgba(0,0,0,.08)', overflow: 'hidden' }}>
          <CvPreview data={cvData} templateType={profile.templateType} />
        </div>
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#a09d97' }}>
          Tạo CV của bạn tại{' '}
          <a href="https://webdrop.store/cvs" style={{ color: '#1a6b52', textDecoration: 'none' }}>webdrop.store</a>
        </div>
      </div>
    </>
  )
}
