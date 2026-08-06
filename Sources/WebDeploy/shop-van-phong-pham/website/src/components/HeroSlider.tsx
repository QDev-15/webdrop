import { useSite } from '../contexts/SiteContext'

// Trang chủ OFFICEHUB dùng biến thể SEARCH-FIRST UNIFIED — không có hero slider ảnh, chỉ có
// "Page Header (Search Zone)" (h1 lớn + ô tìm kiếm) đặt ngay phía trên filter toolbar + catalog.
// File giữ tên HeroSlider.tsx theo đúng scaffold nhưng tái sử dụng để render Search Zone, khớp
// đúng cấu trúc thật của index.html (không có bất kỳ ảnh/banner nào).
interface Props {
  searchValue: string
  onSearchChange: (v: string) => void
  onSearchSubmit: () => void
}

export default function HeroSlider({ searchValue, onSearchChange, onSearchSubmit }: Props) {
  const { settings } = useSite()

  return (
    <section className="vp-page-header">
      <div className="vp-container">
        <div className="vp-page-header-inner">
          <h1>{settings.home_search_heading || 'Văn phòng phẩm chính hãng'}</h1>
          <p className="vp-page-header-sub">{settings.home_search_sub || 'Hơn 500 sản phẩm — giao hàng nhanh trong ngày tại TP.HCM'}</p>
          <div className="vp-search-zone" role="search">
            <input
              type="search"
              placeholder="Tìm bút viết, sổ tay, file hộp, balo laptop..."
              aria-label="Tìm sản phẩm"
              value={searchValue}
              onChange={e => onSearchChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onSearchSubmit() } }}
            />
            <button type="button" onClick={onSearchSubmit}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
