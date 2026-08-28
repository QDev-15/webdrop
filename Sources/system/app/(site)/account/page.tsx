import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import AccountClient from './AccountClient'

export const metadata = { title: 'Tài khoản của tôi — webdrop.store' }

export default function AccountPage() {
  return (
    <>
      <RevealObserver />
      <div style={{ paddingTop: 62 }}>
        <AccountClient />
      </div>
      <Footer />
    </>
  )
}
