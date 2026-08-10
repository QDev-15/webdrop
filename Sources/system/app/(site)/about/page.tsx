import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import AboutPageClient from './AboutPageClient'

export const metadata = {
  title:      'Về chúng tôi — webdrop.store',
  description: 'Tìm hiểu về webdrop.store — đội ngũ chuyên cung cấp mẫu website đẹp và dịch vụ triển khai website trọn gói cho doanh nghiệp Việt Nam.',
}

export default function AboutPage() {
  return (
    <>
      <RevealObserver />
      <AboutPageClient />
      <Footer />
    </>
  )
}
