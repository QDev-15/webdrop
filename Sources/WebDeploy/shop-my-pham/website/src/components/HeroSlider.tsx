import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { CAT_LABELS } from '../lib/format'

// "Search Zone" — hero DUY NHẤT của trang chủ LUMIÈRE (Biến thể 2 CATEGORY-SECTIONS):
// KHÔNG có ảnh lifestyle hay tagline dài, chỉ h1 + ô tìm kiếm lớn + category chips.
// Nội dung quản lý qua Cài đặt > Trang chủ (home_search_heading/home_search_sub).
// Giữ tên file HeroSlider.tsx theo scaffold.
export default function HeroSlider() {
  const { settings } = useSite()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const kw = q.trim()
    navigate(kw ? `/san-pham?q=${encodeURIComponent(kw)}` : '/san-pham')
  }

  return (
    <section className="mp-search-zone" aria-labelledby="mpSearchZoneTitle">
      <div className="wd-container">
        <h1 id="mpSearchZoneTitle" className="mp-search-zone-title">
          {settings.home_search_heading || 'Tìm trong 36 sản phẩm mỹ phẩm'}
        </h1>
        <p className="mp-search-zone-sub">{settings.home_search_sub || 'Chăm sóc da · Trang điểm · Nước hoa · Dụng cụ làm đẹp'}</p>
        <div className="mp-search-zone-form" role="search">
          <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <input
              type="text"
              className="mp-search-zone-input"
              placeholder="Bạn đang tìm gì? Vd: serum vitamin C, son môi..."
              aria-label="Tìm kiếm sản phẩm"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <button type="submit" className="mp-search-zone-btn" aria-label="Tìm kiếm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              Tìm kiếm
            </button>
          </form>
        </div>
        <div className="mp-search-zone-cats" role="navigation" aria-label="Danh mục sản phẩm">
          {Object.entries(CAT_LABELS).map(([slug, label]) => (
            <a key={slug} href={`/san-pham?category=${slug}`} className="mp-cat-chip"
              onClick={e => { e.preventDefault(); navigate(`/san-pham?category=${slug}`) }}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
