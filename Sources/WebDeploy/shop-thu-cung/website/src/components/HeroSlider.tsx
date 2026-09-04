import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

// Template gốc (index.html) dùng "THIN BANNER — Mode A CATALOG-UNIFIED" — 1 khối nội dung TĨNH,
// KHÔNG phải carousel/hero fullscreen (không dots/arrows/auto-rotate). Nội dung title/subtitle đọc
// từ hero_slides[0] (quản lý qua Admin → Hero Slides) để khớp rule 4 (mọi text quản lý được qua admin).
export default function HeroSlider() {
  const { heroSlides } = useSite()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const slide = heroSlides[0]
  const title = slide?.title || 'Mọi thứ boss cưng cần, một nơi mua đủ'
  const subtitle = slide?.subtitle || 'Thức ăn, phụ kiện, đồ chơi, chuồng nhà & chăm sóc cho chó mèo — 42 sản phẩm nguồn gốc rõ ràng, kiểm định an toàn trước khi lên kệ.'

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/' + (q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''))
  }

  // Title có thể chứa "một nơi mua đủ" ở phần cuối (sau dấu phẩy) — in nghiêng accent giống bản gốc.
  const commaIdx = title.indexOf(',')
  const titleMain = commaIdx >= 0 ? title.slice(0, commaIdx + 1) : title
  const titleEm = commaIdx >= 0 ? title.slice(commaIdx + 1).trim() : ''

  return (
    <section className="tc-banner" aria-label="Giới thiệu cửa hàng">
      <div className="tc-container tc-banner-inner">
        <div data-reveal>
          <div className="tc-banner-tag">Cửa hàng thú cưng uy tín</div>
          <h1>
            {titleMain}
            {titleEm && <><br /><em>{titleEm}</em></>}
          </h1>
          <p className="tc-banner-desc">{subtitle}</p>
        </div>
        <form className="tc-banner-search" data-reveal data-delay="1" onSubmit={submitSearch}>
          <input type="text" placeholder="Tìm hạt khô, vòng cổ, đồ chơi..." autoComplete="off" value={q} onChange={e => setQ(e.target.value)} />
          <button type="submit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            Tìm
          </button>
        </form>
      </div>
    </section>
  )
}
