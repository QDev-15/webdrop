import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroBanner from '../components/HeroBanner'
import CategoryGrid from '../components/CategoryGrid'
import ThreadList from '../components/ThreadList'
import Sidebar from '../components/Sidebar'
import { useSite } from '../contexts/SiteContext'

export default function HomePage() {
  const { categories, threads, tags } = useSite()

  // Reveal animation
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [categories, threads, tags])

  return (
    <>
      <Header />
      <main style={{ padding: '24px 0 60px' }}>
        <div className="wd-container">
          <HeroBanner />
          <div className="row g-4">
            {/* Main content */}
            <div className="col-lg-8">
              <CategoryGrid />
              <ThreadList />
            </div>
            {/* Sidebar */}
            <div className="col-lg-4">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
