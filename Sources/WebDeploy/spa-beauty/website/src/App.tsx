import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import BookingPage from './pages/BookingPage'
import ContactPage from './pages/ContactPage'

function AppShell() {
  const location = useLocation()

  // Global IntersectionObserver for [data-reveal] — Rule 31
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' })

    const els = document.querySelectorAll('[data-reveal]')
    els.forEach(el => {
      el.classList.remove('visible')
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [location.pathname])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/dich-vu"  element={<ServicesPage />} />
        <Route path="/dat-lich" element={<BookingPage />} />
        <Route path="/lien-he"  element={<ContactPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <AppShell />
      </SiteProvider>
    </BrowserRouter>
  )
}
