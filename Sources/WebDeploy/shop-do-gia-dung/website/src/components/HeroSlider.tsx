import { Link } from 'react-router-dom'
import type { Category } from '../contexts/SiteContext'

// Trang chủ shop-do-gia-dung dùng "Search Zone" (Biến thể 2 CATEGORY-SECTIONS) thay cho
// hero ảnh/slider — giữ tên file HeroSlider.tsx theo đúng scaffold, nhưng nội dung thực tế
// là khối tìm kiếm lớn + danh mục chip, tách ra từ HomePage.tsx để tái sử dụng được.
// Class dg-search-zone__* đã định nghĩa sẵn trong template.css (mục 6).

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  'nha-bep': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  'trang-tri': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  'phong-tam': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 12c0-1.1.9-2 2-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z" /><rect x="7" y="2" width="10" height="4" /></svg>,
  'noi-that-nho': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>,
  'den-chieu-sang': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>,
}

interface HeroSliderProps {
  categories: Category[]
  subtitle?: string
}

export default function HeroSlider({ categories, subtitle }: HeroSliderProps) {
  return (
    <section id="dg-search-zone" aria-labelledby="dg-sz-heading">
      <div className="dg-container">
        <div className="dg-search-zone__content">
          <h1 className="dg-search-zone__h1" id="dg-sz-heading">
            Tất cả sản phẩm <em>gia dụng</em>
          </h1>
          <p className="dg-search-zone__sub">
            {subtitle || 'Tìm trong hơn 40 sản phẩm đồ gia dụng chất lượng cao'}
          </p>
          <form
            className="dg-search-zone__form"
            onSubmit={e => {
              e.preventDefault()
              const input = e.currentTarget.querySelector('input') as HTMLInputElement
              if (input?.value) window.location.href = `/san-pham?q=${encodeURIComponent(input.value)}`
            }}
          >
            <input
              type="text"
              className="dg-search-zone__input"
              placeholder="Bạn muốn tìm gì? (nồi, đèn, khung ảnh...)"
              aria-label="Tìm kiếm sản phẩm"
            />
            <button type="submit" className="dg-search-zone__submit">Tìm kiếm</button>
          </form>
          <div className="dg-search-zone__cats">
            {categories.map(cat => (
              <Link key={cat.slug} to={`/san-pham?category=${cat.slug}`} className="dg-search-zone__cat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  {CATEGORY_ICONS[cat.slug]?.props?.children}
                </svg>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
