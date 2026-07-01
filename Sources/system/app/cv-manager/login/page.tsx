import { redirect } from 'next/navigation'
import { getCvSession } from '@/lib/auth'
import CvLoginClient from './CvLoginClient'

export const metadata = { title: 'Đăng nhập CV Manager — webdrop.store' }

export default async function CvLoginPage() {
  const session = await getCvSession()
  if (session) redirect('/cv-manager/edit')
  return <CvLoginClient />
}
