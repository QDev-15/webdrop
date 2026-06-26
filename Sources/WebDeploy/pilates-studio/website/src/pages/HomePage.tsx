import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import Team from '../components/Team'

export default function HomePage() {
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
