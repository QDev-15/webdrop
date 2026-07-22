import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { api } from './api/client'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import About from './components/About'
import Menu from './components/Menu'
import Testimonials from './components/Testimonials'
import Reservation from './components/Reservation'
import Contact from './components/Contact'
import Gallery from './components/Gallery'
import './styles/template.css'

type Settings = Record<string, string>

interface Slide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
  status: string
}

function HomePage({ settings, slides }: { settings: Settings; slides: Slide[] }) {
  useDocumentMeta({
    title: settings.meta_title || 'Vị Biển Hải Sản — Tươi Sống Nhập Mỗi Ngày',
    description: settings.meta_description || 'Nhà hàng hải sản tươi sống Vị Biển — tôm, cua, ghẹ, mực nhập từ ngư dân địa phương mỗi ngày. Đặt bàn ngay!',
  })
  return (
    <>
      <HeroSlider settings={settings} slides={slides} />
      <About settings={settings} />
      <Menu />
      <Testimonials />
      <Reservation settings={settings} />
    </>
  )
}

function MenuPage() {
  useDocumentMeta({
    title: 'Thực đơn — Vị Biển Hải Sản',
    description: 'Menu hải sản tươi sống Vị Biển — tôm, cua, ghẹ, mực, cá biển nhập tươi mỗi ngày, tính giá theo kg.',
  })
  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Thực đơn</div>
          <h1 className="ph-title">Menu <em>hải sản</em> tươi</h1>
          <p className="ph-sub">Tất cả đều nhập tươi mỗi ngày. Giá tính theo kg, cân trước khi chế biến.</p>
        </div>
      </div>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <Menu fullPage />
        </div>
      </section>
    </>
  )
}

function ReservationPage({ settings }: { settings: Settings }) {
  useDocumentMeta({
    title: 'Đặt bàn — Vị Biển Hải Sản',
    description: 'Đặt bàn trước tại Vị Biển Hải Sản để giữ chỗ và chuẩn bị hải sản tươi ngon nhất cho bạn.',
  })
  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Đặt bàn</div>
          <h1 className="ph-title">Giữ chỗ <em>hải sản tươi</em></h1>
          <p className="ph-sub">Đặt trước để chúng tôi chuẩn bị những con hải sản tươi ngon nhất và bàn đẹp nhất cho bạn.</p>
        </div>
      </div>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <Reservation settings={settings} fullPage />
        </div>
      </section>
    </>
  )
}

function ContactPage({ settings }: { settings: Settings }) {
  useDocumentMeta({
    title: 'Liên hệ — Vị Biển Hải Sản',
    description: 'Thông tin liên hệ, địa chỉ và giờ mở cửa của nhà hàng hải sản Vị Biển. Gọi ngay để đặt bàn.',
  })
  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Liên hệ</div>
          <h1 className="ph-title">Tìm chúng tôi & <em>đặt bàn</em></h1>
          <p className="ph-sub">Ghé thăm nhà hàng hoặc liên hệ để đặt bàn và hỏi về thực đơn.</p>
        </div>
      </div>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <Contact settings={settings} />
        </div>
      </section>
    </>
  )
}

function GalleryPage() {
  useDocumentMeta({
    title: 'Thư viện ảnh — Vị Biển Hải Sản',
    description: 'Khám phá không gian nhà hàng và hải sản tươi sống tại Vị Biển qua bộ sưu tập hình ảnh.',
  })
  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Thư viện ảnh</div>
          <h1 className="ph-title">Hình ảnh <em>nhà hàng</em></h1>
          <p className="ph-sub">Khám phá không gian và hải sản tươi sống tại Vị Biển.</p>
        </div>
      </div>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <Gallery />
        </div>
      </section>
    </>
  )
}

export default function App() {
  const [settings, setSettings] = useState<Settings>({})
  const [slides, setSlides] = useState<Slide[]>([])

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<Slide[]>('/public/hero-slides'),
    ]).then(([s, sl]) => {
      setSettings(s)
      setSlides(sl)
    }).catch(() => {})
  }, [])

  return (
    <>
      <Header settings={settings} />
      <Routes>
        <Route path="/" element={<HomePage settings={settings} slides={slides} />} />
        <Route path="/thuc-don" element={<MenuPage />} />
        <Route path="/dat-ban" element={<ReservationPage settings={settings} />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/lien-he" element={<ContactPage settings={settings} />} />
        <Route path="*" element={<HomePage settings={settings} slides={slides} />} />
      </Routes>
      <Footer settings={settings} />
      {/* Zalo float */}
      {settings.social_zalo && (
        <div className="zf">
          <div className="zf-tip">Liên hệ Zalo</div>
          <a href={`https://zalo.me/${settings.social_zalo}`} className="zf-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">💬</a>
        </div>
      )}
    </>
  )
}
