import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { type ReactNode, useEffect } from 'react'
import { SiteProvider } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ZaloFloat from './components/ZaloFloat'
import HomePage from './components/pages/HomePage'
import ServicesPage from './components/pages/ServicesPage'
import ProjectsPage from './components/pages/ProjectsPage'
import ProjectDetailPage from './components/pages/ProjectDetailPage'
import AboutPage from './components/pages/AboutPage'
import ContactPage from './components/pages/ContactPage'

function useReveal() {
  const location = useLocation()
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    const observe = () =>
      document.querySelectorAll('.reveal:not(.visible), [data-reveal]:not(.visible)')
        .forEach(el => io.observe(el))
    observe()
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [location.pathname])
}

function Layout({ children }: { children: ReactNode }) {
  useReveal()
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ZaloFloat />
    </>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/dich-vu" element={<Layout><ServicesPage /></Layout>} />
          <Route path="/du-an" element={<Layout><ProjectsPage /></Layout>} />
          <Route path="/du-an/:slug" element={<Layout><ProjectDetailPage /></Layout>} />
          <Route path="/ve-chung-toi" element={<Layout><AboutPage /></Layout>} />
          <Route path="/lien-he" element={<Layout><ContactPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </SiteProvider>
  )
}
