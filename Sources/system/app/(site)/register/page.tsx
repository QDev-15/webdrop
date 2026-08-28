import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import RegisterClient from './RegisterClient'

export const metadata = { title: 'Đăng ký tài khoản — webdrop.store' }

export default function RegisterPage() {
  return (
    <>
      <RevealObserver />
      <div style={{ paddingTop: 62 }}>
        <RegisterClient />
      </div>
      <Footer />
    </>
  )
}
