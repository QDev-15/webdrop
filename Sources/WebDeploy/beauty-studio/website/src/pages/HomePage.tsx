import HeroSlider    from '../components/HeroSlider'
import Services      from '../components/Services'
import About         from '../components/About'
import Team          from '../components/Team'
import Testimonials  from '../components/Testimonials'
import Booking       from '../components/Booking'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Services />
      <About />
      <Team />
      <Testimonials />
      <Booking />
    </>
  )
}
