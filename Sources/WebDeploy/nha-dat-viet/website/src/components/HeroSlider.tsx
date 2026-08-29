import { useEffect, useState, Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { PROPERTY_TYPE_LABELS, PRICE_RANGES_BAN, PRICE_RANGES_THUE, DISTRICTS } from '../data/propertyMeta'
import { IconChevronLeft, IconChevronRight, IconSearch } from './icons'

// Tô màu accent cho cụm từ đặt trong dấu *...* (tương đương <em> trong template gốc) —
// dùng React elements thuần (không dangerouslySetInnerHTML) để tránh rủi ro XSS.
function renderEmTitle(title: string) {
  const parts = title.split(/\*(.+?)\*/g)
  return parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>))
}

export default function HeroSlider() {
  const { heroSlides } = useSite()
  const [cur, setCur] = useState(0)
  const navigate = useNavigate()

  const [listingType, setListingType] = useState<'ban' | 'cho-thue'>('ban')
  const [propertyType, setPropertyType] = useState('')
  const [district, setDistrict] = useState('')
  const [priceRange, setPriceRange] = useState('')

  useEffect(() => {
    if (heroSlides.length <= 1) return
    const t = setInterval(() => setCur(c => (c + 1) % heroSlides.length), 5000)
    return () => clearInterval(t)
  }, [heroSlides.length])

  if (heroSlides.length === 0) return null

  function go(i: number) { setCur((i + heroSlides.length) % heroSlides.length) }

  const priceOptions = listingType === 'cho-thue' ? PRICE_RANGES_THUE : PRICE_RANGES_BAN

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    params.set('listingType', listingType)
    if (propertyType) params.set('propertyType', propertyType)
    if (district) params.set('district', district)
    if (priceRange) params.set('price', priceRange)
    navigate('/bat-dong-san?' + params.toString())
  }

  return (
    <>
      <section className="ndv-hero">
        {heroSlides.map((slide, i) => {
          const [label, desc] = (slide.subtitle || '').split('||')
          return (
            <div key={slide.id} className={'ndv-hero-slide' + (i === cur ? ' active' : '')} style={{ backgroundImage: `url('${slide.image}')` }}>
              <div className="ndv-container">
                <div className="ndv-hero-content">
                  <span className="ndv-hero-label">{label}</span>
                  {i === 0 ? <h1 className="ndv-hero-title">{renderEmTitle(slide.title)}</h1> : <h2 className="ndv-hero-title">{renderEmTitle(slide.title)}</h2>}
                  <p className="ndv-hero-desc">{desc}</p>
                  <div className="ndv-hero-cta">
                    {slide.button_text && <Link to={slide.button_link || '/bat-dong-san'} className="ndv-btn ndv-btn-primary">{slide.button_text}</Link>}
                    <Link to="/lien-he" className="ndv-btn ndv-btn-outline-dark">Tư vấn miễn phí</Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <button className="ndv-hero-nav ndv-hero-prev" aria-label="Slide trước" onClick={() => go(cur - 1)}><IconChevronLeft /></button>
        <button className="ndv-hero-nav ndv-hero-next" aria-label="Slide tiếp" onClick={() => go(cur + 1)}><IconChevronRight /></button>
        <div className="ndv-hero-dots">
          {heroSlides.map((s, i) => (
            <button key={s.id} className={'ndv-hero-dot' + (i === cur ? ' active' : '')} aria-label={`Slide ${i + 1}`} onClick={() => go(i)}></button>
          ))}
        </div>
      </section>

      <div className="ndv-hero-search-wrap">
        <div className="ndv-container">
          <form className="ndv-hero-search" onSubmit={handleSearch}>
            <div className="ndv-search-pill" role="group" aria-label="Nhu cầu">
              <button type="button" className={listingType === 'ban' ? 'active' : ''} onClick={() => { setListingType('ban'); setPriceRange('') }}>Mua bán</button>
              <button type="button" className={listingType === 'cho-thue' ? 'active' : ''} onClick={() => { setListingType('cho-thue'); setPriceRange('') }}>Cho thuê</button>
            </div>
            <div className="ndv-search-field">
              <label htmlFor="heroPropertyType">Loại hình</label>
              <select id="heroPropertyType" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                <option value="">Tất cả loại hình</option>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="ndv-search-field">
              <label htmlFor="heroDistrict">Khu vực</label>
              <select id="heroDistrict" value={district} onChange={e => setDistrict(e.target.value)}>
                <option value="">Tất cả khu vực</option>
                {DISTRICTS.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
              </select>
            </div>
            <div className="ndv-search-field">
              <label htmlFor="heroPriceRange">Khoảng giá</label>
              <select id="heroPriceRange" value={priceRange} onChange={e => setPriceRange(e.target.value)}>
                <option value="">Tất cả mức giá</option>
                {priceOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <button type="submit" className="ndv-btn ndv-btn-primary"><IconSearch /> Tìm kiếm</button>
          </form>
        </div>
      </div>
    </>
  )
}
