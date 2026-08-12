import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import './styles/template.css'

function AppShell() {
  const location = useLocation()

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    const observeNew = () => {
      document.querySelectorAll<Element>('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
    }

    const t = setTimeout(() => observeNew(), 0)

    const mo = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return
          if (node.hasAttribute('data-reveal') && !node.classList.contains('visible')) {
            io.observe(node)
          }
          node.querySelectorAll<Element>('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
        })
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { clearTimeout(t); io.disconnect(); mo.disconnect() }
  }, [location.pathname])

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<div className="yw-page-hero"><div className="wd-container"><h1 className="yw-ph-title">Yoga & Wellness</h1></div></div>} />
          <Route path="/dich-vu" element={<div className="yw-page-hero"><div className="wd-container"><h1 className="yw-ph-title">Các lớp học</h1></div></div>} />
          <Route path="/dat-lich" element={<div className="yw-page-hero"><div className="wd-container"><h1 className="yw-ph-title">Đăng ký</h1></div></div>} />
          <Route path="/lien-he" element={<div className="yw-page-hero"><div className="wd-container"><h1 className="yw-ph-title">Liên hệ</h1></div></div>} />
          <Route path="*" element={<div className="yw-page-hero"><div className="wd-container"><h1>404 Not Found</h1></div></div>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/yoga-wellness">
      <AppShell />
    </BrowserRouter>
  )
}
