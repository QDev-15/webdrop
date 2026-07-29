import { useSite } from '../contexts/SiteContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function HeroSlider() {
  const { settings } = useSite()
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/san-pham?q=${encodeURIComponent(searchInput.trim())}`)
      setSearchInput('')
    }
  }

  return (
    <section className="dc-search-zone" id="searchZone">
      <div className="dc-container">
        <h1 className="dc-search-zone-title">Tìm đồ chơi hoàn hảo cho bé</h1>
        <p className="dc-search-zone-sub">{settings['hero_subtitle'] || 'Hơn 500 sản phẩm an toàn, chất lượng cao từ 0–12 tuổi'}</p>
        <form className="dc-search-zone-form" onSubmit={handleSearch} role="search">
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Ví dụ: Lego, gấu bông, xe điều khiển..."
            autoComplete="off"
            aria-label="Tìm kiếm sản phẩm"
          />
          <button type="submit" aria-label="Tìm kiếm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <span>Tìm kiếm</span>
          </button>
        </form>
        <div className="dc-search-zone-chips" aria-label="Danh mục nhanh">
          <a href="#" onClick={e => { e.preventDefault(); navigate('/san-pham?category=do-choi-giao-duc') }}>Giáo dục</a>
          <a href="#" onClick={e => { e.preventDefault(); navigate('/san-pham?category=lego-xep-hinh') }}>Lego & Xếp hình</a>
          <a href="#" onClick={e => { e.preventDefault(); navigate('/san-pham?category=xe-mo-hinh') }}>Xe & Mô hình</a>
          <a href="#" onClick={e => { e.preventDefault(); navigate('/san-pham?category=bup-be-thu-bong') }}>Búp bê & Thú bông</a>
          <a href="#" onClick={e => { e.preventDefault(); navigate('/san-pham?category=do-choi-ngoai-troi') }}>Ngoài trời</a>
        </div>
      </div>
    </section>
  )
}
