import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSite, Category } from '../contexts/SiteContext'

const CATEGORY_ICONS: Record<string, string> = {
  'nha-bep': '🍳',
  'trang-tri': '🪴',
  'phong-tam': '🛁',
  'noi-that-nho': '🛋️',
  'den-chieu-sang': '💡',
}

// Dùng làm Search Zone (Biến thể 2 — không có hero ảnh)
export default function HeroSlider({ categories }: { categories: Category[] }) {
  const { settings } = useSite()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const h1Part1  = String(settings.hero_title_part1 || 'Đồ Gia Dụng')
  const h1Part2  = String(settings.hero_title_part2 || 'Chất Lượng')
  const h1Line2  = String(settings.hero_title_line2 || 'Cho Mọi Gia Đình')
  const subtitle = String(settings.site_slogan || 'Đồ gia dụng chất lượng cao cho mọi gia đình')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const s = q.trim()
    if (s) {
      navigate(`/san-pham?q=${encodeURIComponent(s)}`)
    }
  }

  return (
    <section id="dg-search-zone">
      <div className="dg-container">
        <div className="dg-search-zone__content">
          <h1 className="dg-search-zone__h1">
            {h1Part1} <em>{h1Part2}</em><br />{h1Line2}
          </h1>
          <p className="dg-search-zone__sub">{subtitle}</p>

          <form className="dg-search-zone__form" onSubmit={handleSubmit}>
            <input
              className="dg-search-zone__input"
              type="text"
              placeholder="Tìm kiếm sản phẩm... (nồi, bình, kệ...)"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <button type="submit" className="dg-search-zone__submit">
              Tìm ngay
            </button>
          </form>

          {categories.length > 0 && (
            <div className="dg-search-zone__cats">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/san-pham?category=${cat.slug}`}
                  className="dg-search-zone__cat"
                >
                  <span>{CATEGORY_ICONS[cat.slug] || '📦'}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
