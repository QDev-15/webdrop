import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Gallery from '../components/Gallery'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'
import Booking from '../components/Booking'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function HomePage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: settings.meta_title || 'Tiệm Tóc Barber — Barber Shop & Hair Salon',
    description: settings.meta_description || 'Tiệm tóc phong cách, chuyên nghiệp. Cắt tóc, uốn nhuộm, cạo râu theo phong cách Mỹ/châu Âu.',
  })

  return (
    <>
      <HeroSlider />
      <About />
      <Services />
      <Gallery />
      <Team />
      <Testimonials />
      <Booking />
    </>
  )
}
