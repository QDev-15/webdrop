import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'
import Booking from '../components/Booking'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function HomePage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: settings.meta_title || 'Thẩm Mỹ Viện Quốc Tế — Medical Aesthetics',
    description: settings.meta_description || 'Thẩm mỹ viện chuyên nghiệp hàng đầu. Nâng mũi, độn cằm, căng da, xóa nếp nhăn, điêu khắc cơ thể với đội ngũ bác sĩ giàu kinh nghiệm.',
  })

  return (
    <>
      <HeroSlider />
      <About />
      <Services />
      <Team />
      <Testimonials />
      <Booking />
    </>
  )
}
