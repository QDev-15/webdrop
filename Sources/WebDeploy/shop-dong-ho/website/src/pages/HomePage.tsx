import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product, type Testimonial } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { BRANDS } from '../data/filters'
import HeroSlider from '../components/HeroSlider'
import ProductCard from '../components/ProductCard'

// ══ Counter animate — khớp [data-counter] template gốc ══
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let cur = 0
        const step = Math.ceil(target / 60) || 1
        const t = setInterval(() => {
          cur = Math.min(cur + step, target)
          setValue(cur)
          if (cur >= target) clearInterval(t)
        }, 25)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{value.toLocaleString('vi-VN')}{suffix}</span>
}

// ══ Themed section — fetch pool theo theme, filter LOCAL bằng search + chip style (không gọi lại API
// mỗi lần gõ) — khớp đúng hành vi dhInitThemeSection() trong index.html gốc. ══
interface ThemeSectionProps {
  eyebrow: string
  titlePrefix: string
  titleEmphasis: string
  viewAllLink: string
  viewAllLabel: string
  fetchQuery: string
  poolFilter?: (p: Product) => boolean
  chips?: { value: string; label: string }[]
  limit: number
  cols3?: boolean
  alt?: boolean
}

function ThemeSection({ eyebrow, titlePrefix, titleEmphasis, viewAllLink, viewAllLabel, fetchQuery, poolFilter, chips, limit, cols3, alt }: ThemeSectionProps) {
  const [pool, setPool] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [activeStyle, setActiveStyle] = useState('all')

  useEffect(() => {
    api.get<Product[]>(`/public/products?${fetchQuery}`)
      .then(rows => setPool(poolFilter ? rows.filter(poolFilter) : rows))
      .catch(() => setPool([]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchQuery])

  const q = search.trim().toLowerCase()
  const filtered = pool.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    const matchStyle = activeStyle === 'all' || p.style === activeStyle
    return matchQ && matchStyle
  }).slice(0, limit)

  return (
    <section className={'dh-theme-section' + (alt ? ' alt' : '')}>
      <div className="dh-container">
        <div className="dh-theme-head" data-reveal>
          <div>
            <p className="dh-eyebrow">{eyebrow}</p>
            <h2 className="dh-sec-title">{titlePrefix} <em>{titleEmphasis}</em></h2>
          </div>
          <Link to={viewAllLink} className="dh-theme-viewall">
            {viewAllLabel}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
        <div className="dh-theme-tools" data-reveal>
          <div className="dh-theme-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input type="search" placeholder={`Tìm trong ${titlePrefix}${titleEmphasis ? ' ' + titleEmphasis : ''}...`} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {chips && (
            <div className="dh-chip-row">
              {chips.map(c => (
                <button key={c.value} className={'dh-chip' + (activeStyle === c.value ? ' active' : '')} onClick={() => setActiveStyle(c.value)}>{c.label}</button>
              ))}
            </div>
          )}
        </div>
        <div className={'dh-prod-grid' + (cols3 ? ' dh-cols-3' : '')} data-reveal>
          {filtered.length ? filtered.map(p => <ProductCard key={p.id} product={p} />) : (
            <div className="dh-theme-empty">Không tìm thấy sản phẩm phù hợp trong mục này.</div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { categories } = useSite()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqOpen, setFaqOpen] = useState(0)

  useDocumentMeta({
    title: 'MERIDIAN — Đồng hồ chính hãng đa thương hiệu',
    description: 'MERIDIAN — đồng hồ nam nữ chính hãng đa thương hiệu: CASIO, SEIKO, CITIZEN, TISSOT, LONGINES... Bảo hành chính hãng, giao hàng toàn quốc, đổi trả 30 ngày.',
  })

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setTestimonials).catch(() => {})
  }, [])

  const namId = categories.find(c => c.slug === 'nam')?.id
  const nuId = categories.find(c => c.slug === 'nu')?.id

  return (
    <>
      <HeroSlider />

      {/* ══ STAT-BAR ══ */}
      <section className="dh-statbar">
        <div className="dh-container">
          <div className="dh-stats-grid">
            <div data-reveal><div className="dh-stat-num"><Counter target={40} suffix="+" /></div><div className="dh-stat-label">Mẫu đồng hồ chính hãng</div></div>
            <div data-reveal data-reveal-d1><div className="dh-stat-num"><Counter target={10} /></div><div className="dh-stat-label">Thương hiệu phân phối</div></div>
            <div data-reveal data-reveal-d2><div className="dh-stat-num"><Counter target={8500} suffix="+" /></div><div className="dh-stat-label">Khách hàng tin dùng</div></div>
            <div data-reveal data-reveal-d3><div className="dh-stat-num"><Counter target={2} suffix=" năm" /></div><div className="dh-stat-label">Bảo hành chính hãng tối thiểu</div></div>
          </div>
        </div>
      </section>

      {/* ══ Thương hiệu phân phối ══ */}
      <section className="dh-sec-tight">
        <div className="dh-container">
          <p className="dh-eyebrow" data-reveal>Thương hiệu phân phối</p>
          <div className="dh-brand-scroll" data-reveal>
            {BRANDS.map(b => (
              <Link key={b} to={`/san-pham?brand=${encodeURIComponent(b)}`} className="dh-brand-pill">{b}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BST Nam ══ */}
      {namId && (
        <ThemeSection
          eyebrow="Bộ sưu tập Nam"
          titlePrefix="Bản lĩnh &"
          titleEmphasis="đẳng cấp"
          viewAllLink="/san-pham?category=nam"
          viewAllLabel="Xem tất cả BST Nam"
          fetchQuery={`category_ids=${namId}&per_page=100`}
          chips={[
            { value: 'all', label: 'Tất cả' },
            { value: 'the-thao', label: 'Thể thao' },
            { value: 'co-dien', label: 'Cổ điển' },
            { value: 'sang-trong', label: 'Sang trọng' },
          ]}
          limit={8}
        />
      )}

      {/* ══ BST Nữ ══ */}
      {nuId && (
        <ThemeSection
          eyebrow="Bộ sưu tập Nữ"
          titlePrefix="Tinh tế"
          titleEmphasis="mọi khoảnh khắc"
          viewAllLink="/san-pham?category=nu"
          viewAllLabel="Xem tất cả BST Nữ"
          fetchQuery={`category_ids=${nuId}&per_page=100`}
          chips={[
            { value: 'all', label: 'Tất cả' },
            { value: 'sang-trong', label: 'Sang trọng' },
            { value: 'co-dien', label: 'Cổ điển' },
            { value: 'the-thao', label: 'Thể thao' },
          ]}
          limit={8}
          alt
        />
      )}

      {/* ══ Limited Edition ══ */}
      <ThemeSection
        eyebrow="Limited Edition"
        titlePrefix="Phiên bản"
        titleEmphasis="giới hạn"
        viewAllLink="/san-pham?limited=1"
        viewAllLabel="Xem tất cả Limited"
        fetchQuery="limited=1&per_page=100"
        limit={6}
        cols3
      />

      {/* ══ Bán chạy nhất ══ */}
      <ThemeSection
        eyebrow="Được yêu thích"
        titlePrefix="Bán chạy"
        titleEmphasis="nhất"
        viewAllLink="/san-pham?sort=bestseller"
        viewAllLabel="Xem tất cả"
        fetchQuery="sort=bestseller&per_page=100"
        poolFilter={p => p.sold >= 300}
        limit={8}
        alt
      />

      {/* ══ BENTO — Vì sao chọn MERIDIAN ══ */}
      <section className="dh-sec">
        <div className="dh-container">
          <div className="dh-sec-head" data-reveal>
            <div>
              <p className="dh-eyebrow">Vì sao chọn MERIDIAN</p>
              <h2 className="dh-sec-title">Cam kết <em>chính hãng, minh bạch</em></h2>
            </div>
          </div>
          <div className="dh-bento" data-reveal>
            <div className="dh-bento-item b1">
              <div className="dh-bento-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg></div>
              <h3>100% chính hãng, có giấy tờ</h3>
              <p>Mỗi sản phẩm kèm hóa đơn VAT, phiếu bảo hành điện tử và tem chống hàng giả — truy xuất nguồn gốc rõ ràng.</p>
            </div>
            <div className="dh-bento-item b2">
              <div className="dh-bento-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 12v-2a2 2 0 00-2-2h-2M4 12v2a2 2 0 002 2h2M9 21l3-3 3 3M9 3l3 3 3-3" /></svg></div>
              <h3>Bảo hành chính hãng đến 5 năm</h3>
              <p>Tối thiểu 2 năm cho mọi sản phẩm, riêng phiên bản giới hạn bảo hành mở rộng 5 năm toàn quốc.</p>
            </div>
            <div className="dh-bento-item b3">
              <div className="dh-bento-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 3h15l3 5v10a2 2 0 01-2 2H5a2 2 0 01-2-2V3z" /><path d="M16 3v5h5" /></svg></div>
              <h3>Đổi trả trong 30 ngày</h3>
              <p>Không hài lòng — đổi mẫu khác hoặc hoàn tiền 100% trong 30 ngày đầu, không cần lý do phức tạp.</p>
            </div>
            <div className="dh-bento-item b4">
              <div className="dh-bento-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 8h14M5 8a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" /></svg></div>
              <h3>Giao hàng toàn quốc</h3>
              <p>Miễn phí ship đơn từ 2.000.000₫, kiểm tra hàng trước khi thanh toán (COD).</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Quy trình mua hàng ══ */}
      <section className="dh-sec-tight" style={{ background: 'var(--surface)' }}>
        <div className="dh-container">
          <div className="dh-sec-head" data-reveal><div><p className="dh-eyebrow">Quy trình đơn giản</p><h2 className="dh-sec-title">Mua sắm <em>4 bước dễ dàng</em></h2></div></div>
          <div className="dh-feature-row">
            <div className="dh-feature-item" data-reveal>
              <div className="dh-feature-icon">01</div>
              <h4>Chọn mẫu yêu thích</h4>
              <p>Lọc theo danh mục, chất liệu dây, thương hiệu và mức giá phù hợp.</p>
            </div>
            <div className="dh-feature-item" data-reveal data-reveal-d1>
              <div className="dh-feature-icon">02</div>
              <h4>Đặt hàng nhanh chóng</h4>
              <p>Thêm vào giỏ, điền thông tin giao hàng — chỉ mất 2 phút.</p>
            </div>
            <div className="dh-feature-item" data-reveal data-reveal-d2>
              <div className="dh-feature-icon">03</div>
              <h4>Kiểm tra trước khi nhận</h4>
              <p>Xem hàng, kiểm tra tem chính hãng trước khi thanh toán COD.</p>
            </div>
            <div className="dh-feature-item" data-reveal data-reveal-d3>
              <div className="dh-feature-icon">04</div>
              <h4>Kích hoạt bảo hành</h4>
              <p>Đăng ký bảo hành điện tử ngay khi nhận hàng, tra cứu online 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Testimonials ══ */}
      <section className="dh-sec">
        <div className="dh-container">
          <div className="dh-sec-head" data-reveal><div><p className="dh-eyebrow">Khách hàng nói gì</p><h2 className="dh-sec-title">Được <em>tin tưởng lựa chọn</em></h2></div></div>
          <div className="dh-testi-grid">
            {testimonials.map((t, i) => {
              const delayAttr = i === 1 ? { 'data-reveal-d1': true } : i === 2 ? { 'data-reveal-d2': true } : {}
              return (
              <div className="dh-testi-card" data-reveal {...delayAttr} key={t.id}>
                <div className="dh-testi-stars">★★★★★</div>
                <p>&quot;{t.content}&quot;</p>
                <div className="dh-testi-user">
                  <img src={t.author_avatar} alt="Khách hàng" />
                  <div><strong>{t.author_name}</strong><span>{t.author_location}</span></div>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="dh-sec-tight" style={{ background: 'var(--surface)' }}>
        <div className="dh-container">
          <div className="dh-sec-head" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }} data-reveal>
            <p className="dh-eyebrow">Câu hỏi thường gặp</p>
            <h2 className="dh-sec-title">Giải đáp <em>thắc mắc của bạn</em></h2>
          </div>
          <div className="dh-faq" data-reveal>
            {FAQS.map((item, i) => (
              <div className={'dh-faq-item' + (faqOpen === i ? ' open' : '')} key={i}>
                <button className="dh-faq-q" onClick={() => setFaqOpen(o => o === i ? -1 : i)}>
                  <span>{item.q}</span><span className="plus">+</span>
                </button>
                <div className="dh-faq-a"><div className="dh-faq-a-inner">{item.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BAND ══ */}
      <section className="dh-sec-tight">
        <div className="dh-container">
          <div className="dh-cta-band" data-reveal>
            <div>
              <h3>Nhận ưu đãi & mẫu mới sớm nhất</h3>
              <p>Đăng ký email để nhận thông báo phiên bản giới hạn mới và mã giảm giá độc quyền.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 3000)
  }
  return (
    <form className="dh-cta-form" onSubmit={submit}>
      <input type="email" placeholder="Nhập email của bạn" required value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit" className="dh-btn dh-btn-primary">{sent ? 'Đăng ký thành công!' : 'Đăng ký'}</button>
    </form>
  )
}

const FAQS = [
  { q: 'Làm sao để biết đồng hồ MERIDIAN là hàng chính hãng?', a: 'Mỗi sản phẩm đều có tem chống hàng giả, hóa đơn VAT và phiếu bảo hành điện tử tra cứu được trên hệ thống của hãng. Bạn có thể kiểm tra trực tiếp mã serial trên website chính hãng trước khi thanh toán.' },
  { q: 'Chính sách bảo hành cụ thể như thế nào?', a: 'Tối thiểu 2 năm chính hãng cho toàn bộ sản phẩm, riêng dòng phiên bản giới hạn được bảo hành mở rộng 5 năm. Bảo hành bao gồm lỗi máy, lỗi kỹ thuật từ nhà sản xuất — không bao gồm rơi vỡ, vào nước do sử dụng sai cách.' },
  { q: 'Tôi có thể đổi trả nếu không vừa ý không?', a: 'Có. Trong 30 ngày kể từ ngày nhận hàng, nếu sản phẩm còn nguyên tem, chưa qua sử dụng, bạn có thể đổi mẫu khác hoặc hoàn tiền 100% giá trị đơn hàng.' },
  { q: 'Thời gian giao hàng mất bao lâu?', a: 'Nội thành TP.HCM và Hà Nội: 1-2 ngày làm việc. Các tỉnh thành khác: 2-4 ngày làm việc. Miễn phí vận chuyển cho đơn hàng từ 2.000.000₫.' },
  { q: 'Có hỗ trợ trả góp không?', a: 'Có, hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng của các ngân hàng liên kết cho đơn hàng từ 3.000.000₫, kỳ hạn 3-6 tháng.' },
  { q: 'Đồng hồ có được điều chỉnh dây miễn phí không?', a: 'Có, MERIDIAN hỗ trợ chỉnh dây (bấm mắt dây kim loại hoặc đục lỗ dây da) miễn phí tại cửa hàng hoặc hướng dẫn qua video nếu bạn ở xa.' },
  { q: 'Sản phẩm phiên bản giới hạn có gì khác biệt?', a: 'Dòng Limited Edition được sản xuất số lượng có hạn, kèm giấy chứng nhận số thứ tự riêng, hộp đựng cao cấp và bảo hành mở rộng 5 năm — phù hợp làm quà tặng cao cấp hoặc sưu tầm.' },
]
