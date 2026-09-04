import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product, type Testimonial } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import HeroSlider from '../components/HeroSlider'

const MATERIAL_LABEL: Record<string, string> = {
  'bac-925': 'Bạc 925', 'vang-18k': 'Vàng 18K', 'vang-24k': 'Vàng 24K',
  'da-quy': 'Đá quý tự nhiên', 'dinh-da': 'Đính đá CZ',
}

function formatVND(n: number) { return n.toLocaleString('vi-VN') + '₫' }

function ThemeProductCard({ p }: { p: Product }) {
  const matLabel = MATERIAL_LABEL[p.material] ?? p.material
  return (
    <article className="tr-prod-card" data-reveal>
      <Link to={`/san-pham/${p.slug}`} className="tr-prod-img" aria-label={p.name}>
        <img src={p.image} alt={p.name} loading="lazy" />
        {p.badge === 'new' && <span className="tr-prod-badge tr-prod-badge-new">Mới</span>}
        {p.badge === 'sale' && <span className="tr-prod-badge tr-prod-badge-sale">Sale</span>}
        {p.badge === 'hot' && <span className="tr-prod-badge tr-prod-badge-hot">Hot</span>}
        <span className="tr-prod-fav" role="button" aria-label={`Yêu thích ${p.name}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
        </span>
      </Link>
      <div className="tr-prod-body">
        <div className="tr-prod-material">{matLabel}</div>
        <h3 className="tr-prod-name"><Link to={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
        <div className="tr-prod-price">
          <span className={'tr-price-main' + (p.price_sale ? ' tr-price-sale' : '')}>{formatVND(p.price_sale || p.price)}</span>
          {p.price_sale ? <span className="tr-price-old">{formatVND(p.price)}</span> : null}
        </div>
      </div>
    </article>
  )
}

interface ThemeChip { label: string; category: string }
interface ThemeSectionProps {
  theme: string
  eyebrow: string
  title: React.ReactNode
  chips: ThemeChip[]
}

function ThemeSection({ theme, eyebrow, title, chips }: ThemeSectionProps) {
  const [all, setAll] = useState<Product[]>([])
  const [localCat, setLocalCat] = useState('tat-ca')
  const [localQuery, setLocalQuery] = useState('')

  useEffect(() => {
    api.getPaged<Product[]>(`/public/products?theme=${theme}&per_page=50`)
      .then(({ data }) => setAll(data))
      .catch(() => {})
  }, [theme])

  const items = all
    .filter(p => localCat === 'tat-ca' || p.category_slug === localCat)
    .filter(p => !localQuery || p.name.toLowerCase().includes(localQuery.toLowerCase()))
    .slice(0, 8)

  return (
    <section className="tr-theme-section tr-pad">
      <div className="tr-container">
        <div className="tr-sec-head-row" data-reveal>
          <div>
            <div className="tr-eyebrow">{eyebrow}</div>
            <h2 className="tr-sec-title">{title}</h2>
          </div>
          <Link to={`/san-pham?theme=${theme}`} className="tr-theme-viewall">
            Xem tất cả
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
        <div className="tr-theme-tools" data-reveal>
          {chips.map(c => (
            <button
              key={c.category}
              type="button"
              className={'tr-theme-chip' + (localCat === c.category ? ' active' : '')}
              onClick={() => setLocalCat(c.category)}
            >
              {c.label}
            </button>
          ))}
          <div className="tr-theme-local-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input type="search" placeholder="Tìm trong mục này..." aria-label={`Tìm trong mục ${eyebrow}`} value={localQuery} onChange={e => setLocalQuery(e.target.value)} />
          </div>
        </div>
        {items.length > 0 ? (
          <div className="tr-hscroll" data-reveal>
            {items.map(p => <ThemeProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <p className="tr-theme-empty">Không tìm thấy sản phẩm phù hợp trong mục này.</p>
        )}
      </div>
    </section>
  )
}

export default function HomePage() {
  const { settings, categories } = useSite()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useDocumentMeta({
    title: settings.meta_title || 'VIOLETTE — Trang sức tinh xảo, chế tác từ trái tim',
    description: settings.meta_description || 'VIOLETTE Fine Jewelry — nhẫn, dây chuyền, bông tai, lắc tay bạc 925, vàng 18K/24K và đá quý tự nhiên. Thiết kế tinh xảo, bảo hành trọn đời, kiểm định rõ ràng.',
  })

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setTestimonials).catch(() => {})
  }, [])

  return (
    <>
      <HeroSlider />

      <section className="tr-trust-strip">
        <div className="tr-container tr-trust-row">
          <div className="tr-trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M12 22s8-4.5 8-11V5l-8-3-8 3v6c0 6.5 8 11 8 11z" /></svg>
            <div className="tr-trust-item-text"><strong>Bảo hành trọn đời</strong>Khung trang sức</div>
          </div>
          <div className="tr-trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a4 4 0 018 0v2" /></svg>
            <div className="tr-trust-item-text"><strong>Kiểm định rõ ràng</strong>Giấy kiểm định đá quý</div>
          </div>
          <div className="tr-trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7S9 2 6 2 3 5 6 7z" /><path d="M12 7s3-5 6-5 3 3 0 5z" /></svg>
            <div className="tr-trust-item-text"><strong>Hộp quà sang trọng</strong>Miễn phí gói quà</div>
          </div>
          <div className="tr-trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
            <div className="tr-trust-item-text"><strong>Đổi trả 30 ngày</strong>Miễn phí đổi size</div>
          </div>
        </div>
      </section>

      <section className="tr-pad">
        <div className="tr-container">
          <div className="tr-sec-head center" data-reveal>
            <div className="tr-eyebrow" style={{ justifyContent: 'center' }}>Khám phá</div>
            <h2 className="tr-sec-title">Danh mục <em>nổi bật</em></h2>
          </div>
          <div className="tr-cat-grid" data-reveal>
            {categories.map(c => (
              <Link key={c.slug} to={`/san-pham?category=${c.slug}`} className="tr-cat-tile">
                <img src={c.image} alt={`${c.name} trang sức VIOLETTE`} loading="lazy" />
                <div className="tr-cat-tile-overlay">
                  <div className="tr-cat-tile-name">{c.name}</div>
                  <div className="tr-cat-tile-count">{c.product_count} mẫu</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ThemeSection
        theme="moi-ve"
        eyebrow="Vừa cập bến"
        title={<>Bộ sưu tập <em>mới về</em></>}
        chips={[
          { label: 'Tất cả', category: 'tat-ca' },
          { label: 'Nhẫn', category: 'nhan' },
          { label: 'Dây chuyền', category: 'day-chuyen' },
          { label: 'Bông tai', category: 'bong-tai' },
        ]}
      />

      <ThemeSection
        theme="ban-chay"
        eyebrow="Được yêu thích"
        title={<>Bán chạy <em>nhất</em></>}
        chips={[
          { label: 'Tất cả', category: 'tat-ca' },
          { label: 'Nhẫn', category: 'nhan' },
          { label: 'Bông tai', category: 'bong-tai' },
          { label: 'Bộ trang sức', category: 'bo-trang-suc' },
        ]}
      />

      <section className="tr-stat-bar tr-pad-sm">
        <div className="tr-container tr-stat-grid">
          <div data-reveal><div className="tr-stat-num">15+</div><div className="tr-stat-label">Năm kinh nghiệm</div></div>
          <div data-reveal data-reveal-d1><div className="tr-stat-num">48.000+</div><div className="tr-stat-label">Khách hàng tin dùng</div></div>
          <div data-reveal data-reveal-d2><div className="tr-stat-num">320+</div><div className="tr-stat-label">Mẫu thiết kế</div></div>
          <div data-reveal data-reveal-d3><div className="tr-stat-num">4.9<span style={{ fontSize: '.5em' }}>/5</span></div><div className="tr-stat-label">Đánh giá trung bình</div></div>
        </div>
      </section>

      <ThemeSection
        theme="qua-tang"
        eyebrow="Trao gửi yêu thương"
        title={<>Quà tặng <em>ý nghĩa</em></>}
        chips={[
          { label: 'Tất cả', category: 'tat-ca' },
          { label: 'Dây chuyền', category: 'day-chuyen' },
          { label: 'Lắc tay', category: 'lac-tay' },
        ]}
      />

      <ThemeSection
        theme="uu-dai"
        eyebrow="Ưu đãi có hạn"
        title={<>Đang <em>ưu đãi</em></>}
        chips={[
          { label: 'Tất cả', category: 'tat-ca' },
          { label: 'Nhẫn', category: 'nhan' },
          { label: 'Dây chuyền', category: 'day-chuyen' },
        ]}
      />

      <section className="tr-pad">
        <div className="tr-container">
          <div className="tr-sec-head center" data-reveal>
            <div className="tr-eyebrow" style={{ justifyContent: 'center' }}>Khách hàng nói gì</div>
            <h2 className="tr-sec-title">Những câu chuyện <em>từ trái tim</em></h2>
          </div>
          <div className="tr-testi-list" data-reveal>
            {testimonials.map(t => (
              <div className="tr-testi-item" key={t.id}>
                <img className="tr-testi-avatar" src={t.author_avatar} alt={`Khách hàng ${t.author_name}`} loading="lazy" />
                <div>
                  <div className="tr-testi-stars">{'★'.repeat(t.rating)}</div>
                  <p className="tr-testi-quote">&quot;{t.content}&quot;</p>
                  <div className="tr-testi-name">{t.author_name}</div>
                  <div className="tr-testi-role">{t.author_role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
