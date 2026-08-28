import { Suspense } from 'react'
import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import LoginClient from './LoginClient'

export const metadata = { title: 'Đăng nhập — webdrop.store' }

export default function LoginPage() {
  return (
    <>
      <RevealObserver />
      <div style={{ paddingTop: 62 }}>
        <Suspense>
          <LoginClient />
        </Suspense>
      </div>
      <Footer />
    </>
  )
}
