import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { renderTitle } from '../utils/text'
import About from '../components/About'

export default function AboutPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Giới Thiệu — Rosette Bakery & Cafe',
    description: 'Câu chuyện thương hiệu Rosette Bakery & Cafe — hành trình từ bếp bánh gia đình nhỏ đến tiệm bánh được yêu thích, đội ngũ bếp trưởng bánh và barista, nguyên liệu tuyển chọn.',
  })

  return (
    <>
      <section className="cbn-page-hero">
        <div className="cbn-container">
          <div className="cbn-ph-eyebrow">Giới thiệu</div>
          <h1 className="cbn-ph-title">{renderTitle(settings.about_hero_title)}</h1>
          <p className="cbn-ph-sub">{settings.about_hero_desc}</p>
        </div>
      </section>

      <About />

      <section className="cbn-cta-sec">
        <div className="cbn-container">
          <div className="cbn-eyebrow" style={{ color: 'rgba(255,255,255,.85)' }}>Ghé thăm Rosette</div>
          <h2 className="cbn-cta-title">{renderTitle(settings.about_cta_title)}</h2>
          <p className="cbn-cta-sub">{settings.about_cta_desc}</p>
          <Link to="/lien-he" className="cbn-btn-white">Xem đường đi & liên hệ →</Link>
        </div>
      </section>
    </>
  )
}
