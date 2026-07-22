import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import Team from '../components/Team'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function HomePage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: settings.meta_title || settings.site_name,
    description: settings.meta_description || settings.site_description,
  })

  return (
    <>
      <HeroSlider />
      <About />
      <Services featured />
      <Testimonials />
      <Team />
    </>
  )
}
