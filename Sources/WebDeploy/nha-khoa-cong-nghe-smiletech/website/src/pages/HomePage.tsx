import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <About />
      <Services limit={4} showViewAll />
      <Testimonials />
    </>
  )
}
