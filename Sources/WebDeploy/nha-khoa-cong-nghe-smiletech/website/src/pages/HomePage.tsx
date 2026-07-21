import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function HomePage() {
  useDocumentMeta({
    title: 'SmileTech — Nha Khoa Công Nghệ Cao',
    description: 'SmileTech — nha khoa ứng dụng AI chẩn đoán, scan 3D không đau, hồ sơ số bảo mật. Đặt lịch online 24/7.',
  })

  return (
    <>
      <HeroSlider />
      <About />
      <Services limit={4} showViewAll />
      <Testimonials />
    </>
  )
}
