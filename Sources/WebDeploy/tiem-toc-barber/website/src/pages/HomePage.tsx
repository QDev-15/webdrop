import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Gallery from '../components/Gallery'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'
import Booking from '../components/Booking'

export default function HomePage() {
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
