import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

// "Search Zone" — hero DUY NHẤT của trang chủ AMI Fashion (Biến thể 2 CATEGORY-SECTIONS):
// KHÔNG có tagline thương hiệu/lifestyle image, chỉ h1 + ô tìm kiếm lớn. Nội dung quản lý
// qua Cài đặt > Trang chủ (home_search_heading). Giữ tên file HeroSlider.tsx theo scaffold.
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
    <section className="am-search-zone" aria-label="Tìm kiếm sản phẩm">
      <div className="am-container">
        <h1 className="am-search-zone-sub">{settings.home_search_heading || 'Tìm trong hơn 36 sản phẩm AMI'}</h1>
        <form onSubmit={handleSubmit} role="search">
          <input
            type="text"
            name="q"
            placeholder="Tên sản phẩm, chất liệu, màu sắc..."
            aria-label="Từ khóa tìm kiếm"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button type="submit">Tìm kiếm</button>
        </form>
      </div>
    </section>
  )
}
