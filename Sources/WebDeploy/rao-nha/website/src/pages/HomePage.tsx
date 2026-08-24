import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import HeroSlider from '../components/HeroSlider'
import PropertyCard from '../components/PropertyCard'
import Counter from '../components/Counter'
import { Listing, AREAS, TIER_ORDER, PRICE_RANGES_BAN, PRICE_RANGES_THUE, formatDateVN } from '../lib/listings'

interface Article { id: number; slug: string; title: string; category: string; thumbnail: string; published_at: string }
interface Faq { id: number; question: string; answer: string }

export default function HomePage() {
  useDocumentMeta({
    title: 'RaoNhà — Sàn giao dịch bất động sản trực tuyến',
    description: 'RaoNhà — nền tảng đăng tin và tìm kiếm bất động sản trực tuyến: chung cư, nhà phố, đất nền, biệt thự, shophouse tại Hà Nội, TP.HCM, Đà Nẵng.',
  })

  const { settings } = useSite()
  const navigate = useNavigate()
  const [listings, setListings] = useState<Listing[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const [need, setNeed] = useState('')
  const [area, setArea] = useState('')
  const [type, setType] = useState('')
  const [price, setPrice] = useState('')
  const [q, setQ] = useState('')

  useEffect(() => {
    api.get<Listing[]>('/public/listings').then(setListings).catch(() => {})
    api.get<Article[]>('/public/articles').then(setArticles).catch(() => {})
    api.get<Faq[]>('/public/faqs').then(setFaqs).catch(() => {})
  }, [])

  const vipListings = [...listings].filter(p => p.tier !== 'thuong')
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]).slice(0, 8)
  const newListings = [...listings].sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()).slice(0, 8)
  const priceRanges = need === 'cho-thue' ? PRICE_RANGES_THUE : PRICE_RANGES_BAN

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (need) params.set('nhu-cau', need)
    if (type) params.set('loai', type)
    if (area) params.set('khu-vuc', area)
    if (price) params.set('gia', price)
    if (q) params.set('q', q)
    navigate('/bat-dong-san?' + params.toString())
  }

  return (
    <>
      <HeroSlider />

      <div className="rn-container rn-search-wrap">
        <form className="rn-search-card" onSubmit={submitSearch}>
          <div className="rn-search-tabs">
            <button type="button" className={'rn-search-tab' + (need === '' ? ' active' : '')} onClick={() => { setNeed(''); setPrice('') }}>Tất cả</button>
            <button type="button" className={'rn-search-tab' + (need === 'ban' ? ' active' : '')} onClick={() => { setNeed('ban'); setPrice('') }}>Mua bán</button>
            <button type="button" className={'rn-search-tab' + (need === 'cho-thue' ? ' active' : '')} onClick={() => { setNeed('cho-thue'); setPrice('') }}>Cho thuê</button>
          </div>
          <div className="rn-search-fields">
            <div className="rn-search-field">
              <label htmlFor="home-search-area">Khu vực</label>
              <select id="home-search-area" value={area} onChange={e => setArea(e.target.value)}>
                <option value="">Tất cả khu vực</option>
                <optgroup label="Hà Nội">{AREAS.filter(a => a.city === 'Hà Nội').map(a => <option key={a.slug} value={a.slug}>{a.label}</option>)}</optgroup>
                <optgroup label="TP.HCM">{AREAS.filter(a => a.city === 'TP.HCM').map(a => <option key={a.slug} value={a.slug}>{a.label}</option>)}</optgroup>
                <optgroup label="Đà Nẵng">{AREAS.filter(a => a.city === 'Đà Nẵng').map(a => <option key={a.slug} value={a.slug}>{a.label}</option>)}</optgroup>
              </select>
            </div>
            <div className="rn-search-field">
              <label htmlFor="home-search-type">Loại hình</label>
              <select id="home-search-type" value={type} onChange={e => setType(e.target.value)}>
                <option value="">Tất cả loại hình</option>
                <option value="chung-cu">Chung cư</option>
                <option value="nha-pho">Nhà phố</option>
                <option value="dat-nen">Đất nền</option>
                <option value="biet-thu">Biệt thự</option>
                <option value="shophouse">Shophouse</option>
                <option value="can-ho-dich-vu">Căn hộ dịch vụ</option>
              </select>
            </div>
            <div className="rn-search-field">
              <label htmlFor="home-search-price">Khoảng giá</label>
              <select id="home-search-price" value={price} onChange={e => setPrice(e.target.value)}>
                <option value="">Khoảng giá</option>
                {priceRanges.map(r => <option key={r.v} value={r.v}>{r.label}</option>)}
              </select>
            </div>
            <div className="rn-search-field">
              <label htmlFor="home-search-keyword">Từ khóa</label>
              <input id="home-search-keyword" type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Tên đường, dự án..." />
            </div>
            <button type="submit" className="rn-search-submit">🔍 Tìm kiếm</button>
          </div>
        </form>
      </div>

      <section className="sec-pad" style={{ paddingTop: 32 }}>
        <div className="rn-container">
          <div className="eyebrow">Khu vực nổi bật</div>
          <div className="rn-area-scroll">
            {AREAS.map(a => (
              <Link key={a.slug} to={`/bat-dong-san?khu-vuc=${a.slug}`} className="rn-area-chip">{a.label}<small>{a.city}</small></Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-pad" style={{ paddingTop: 0 }}>
        <div className="rn-container">
          <div className="sec-head-row" data-reveal>
            <div><div className="eyebrow">💎 Ưu tiên hiển thị</div><h2 className="sec-title">Tin <em>VIP</em> nổi bật</h2></div>
            <Link to="/bat-dong-san" className="btn-rn btn-rn-ghost">Xem tất cả →</Link>
          </div>
          <div className="rn-grid">{vipListings.map(p => <PropertyCard key={p.id} p={p} />)}</div>
        </div>
      </section>

      <section className="sec-pad" style={{ paddingTop: 0 }}>
        <div className="rn-container">
          <div className="sec-head-row" data-reveal>
            <div><div className="eyebrow">Cập nhật liên tục</div><h2 className="sec-title">Tin <em>mới đăng</em></h2></div>
            <Link to="/bat-dong-san" className="btn-rn btn-rn-ghost">Xem tất cả →</Link>
          </div>
          <div className="rn-grid">{newListings.map(p => <PropertyCard key={p.id} p={p} />)}</div>
        </div>
      </section>

      <section className="rn-statbar sec-pad">
        <div className="rn-container">
          <div className="rn-stats-grid">
            <div data-reveal><div className="rn-stat-num"><Counter value={parseInt(settings.stat_listings || '12500')} suffix="+" /></div><div className="rn-stat-label">Tin đăng đang hoạt động</div></div>
            <div data-reveal data-reveal-d1><div className="rn-stat-num"><Counter value={parseInt(settings.stat_members || '3200')} suffix="+" /></div><div className="rn-stat-label">Môi giới & chính chủ tham gia</div></div>
            <div data-reveal data-reveal-d2><div className="rn-stat-num"><Counter value={parseInt(settings.stat_visits || '850')} suffix="k" /></div><div className="rn-stat-label">Lượt truy cập mỗi tháng</div></div>
            <div data-reveal data-reveal-d3><div className="rn-stat-num"><Counter value={98} suffix="%" /></div><div className="rn-stat-label">Người dùng hài lòng</div></div>
          </div>
        </div>
      </section>

      <section className="sec-pad">
        <div className="rn-container">
          <div className="sec-head center" data-reveal>
            <div className="eyebrow">Quy trình</div>
            <h2 className="sec-title">RaoNhà hoạt động <em>như thế nào?</em></h2>
            <p className="sec-sub">Chỉ 4 bước đơn giản để đăng tin hoặc tìm được bất động sản phù hợp.</p>
          </div>
          <div className="rn-steps-row">
            <div className="rn-step" data-reveal><div className="rn-step-num">1</div><h3>Đăng tin miễn phí</h3><p>Điền thông tin bất động sản, tải ảnh và chọn gói tin phù hợp — chỉ mất vài phút.</p></div>
            <div className="rn-step" data-reveal data-reveal-d1><div className="rn-step-num">2</div><h3>RaoNhà kiểm duyệt</h3><p>Đội ngũ kiểm duyệt xác minh thông tin trước khi tin đăng được hiển thị công khai.</p></div>
            <div className="rn-step" data-reveal data-reveal-d2><div className="rn-step-num">3</div><h3>Hiển thị công khai</h3><p>Tin đăng xuất hiện trong kết quả tìm kiếm, xếp hạng theo gói tin đã chọn.</p></div>
            <div className="rn-step" data-reveal data-reveal-d3><div className="rn-step-num">4</div><h3>Kết nối trực tiếp</h3><p>Người mua/thuê liên hệ thẳng với người đăng tin — không qua trung gian.</p></div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <section className="sec-pad">
        <div className="rn-container">
          <div className="sec-head-row" data-reveal>
            <div><div className="eyebrow">Kiến thức bất động sản</div><h2 className="sec-title">Tin tức <em>mới nhất</em></h2></div>
            <Link to="/tin-tuc" className="btn-rn btn-rn-ghost">Xem tất cả →</Link>
          </div>
          <div className="rn-news-grid">
            {articles.slice(0, 4).map(a => (
              <Link key={a.id} to={`/tin-tuc-chi-tiet?slug=${a.slug}`} className="rn-news-card" data-reveal>
                <div className="rn-news-thumb"><img src={a.thumbnail} alt={a.title} loading="lazy" /></div>
                <div className="rn-news-body">
                  <span className="rn-news-cat">{a.category}</span>
                  <h3>{a.title}</h3>
                  <span className="rn-news-date">{formatDateVN(a.published_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="rn-container">
          <div className="sec-head center" data-reveal><div className="eyebrow">Giải đáp</div><h2 className="sec-title">Câu hỏi <em>thường gặp</em></h2></div>
          <div className="rn-faq">
            {faqs.map(f => (
              <div key={f.id} className={'rn-faq-item' + (openFaq === f.id ? ' open' : '')}>
                <button className="rn-faq-q" onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}>
                  {f.question}<span className="rn-faq-icon">+</span>
                </button>
                <div className="rn-faq-a"><div className="rn-faq-a-inner">{f.answer}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function TestimonialsSection() {
  const [items, setItems] = useState<{ id: number; name: string; role: string; avatar: string; content: string }[]>([])
  useEffect(() => { api.get<typeof items>('/public/testimonials').then(d => setItems(d.slice(0, 4))).catch(() => {}) }, [])
  if (items.length === 0) return null
  return (
    <section className="sec-pad" style={{ background: 'var(--surface)' }}>
      <div className="rn-container">
        <div className="sec-head center" data-reveal><div className="eyebrow">Người dùng nói gì</div><h2 className="sec-title">Câu chuyện từ <em>người dùng RaoNhà</em></h2></div>
        <div className="rn-testi-list" style={{ maxWidth: 820, margin: '0 auto' }}>
          {items.map(t => (
            <div key={t.id} className="rn-testi-item" data-reveal>
              <img src={t.avatar} className="rn-testi-avatar" alt={t.name} />
              <div>
                <p className="rn-testi-quote">{t.content}</p>
                <div className="rn-testi-name">{t.name}</div>
                <div className="rn-testi-role">{t.role}</div>
              </div>
              <div className="rn-testi-stars">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
