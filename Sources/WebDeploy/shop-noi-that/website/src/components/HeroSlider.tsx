// "BANNER MỎNG" (Mode A — thay hero fullscreen) — khớp nguyên bố cục <section class="nt-banner">
// của template gốc: tiêu đề + mô tả + ô tìm kiếm nổi + 7 quick-category shortcut tròn.
// Được ProductsPage.tsx (trang chủ = catalog) render trực tiếp phía trên toolbar lọc.
interface QuickCat { slug: string; label: string; icon: JSX.Element }

const QUICK_CATS: QuickCat[] = [
  { slug: 'sofa', label: 'Sofa', icon: <path d="M4 18v-5a2 2 0 012-2h12a2 2 0 012 2v5M4 13V9a2 2 0 012-2h0M20 13V9a2 2 0 00-2-2h0M3 18h18v2H3z" /> },
  { slug: 'ban', label: 'Bàn', icon: <path d="M3 9h18M6 9v10M18 9v10" /> },
  { slug: 'ghe', label: 'Ghế', icon: <path d="M5 11V6a2 2 0 012-2h10a2 2 0 012 2v5M5 11h14v6H5zM6 17v3M18 17v3" /> },
  { slug: 'tu-ke', label: 'Tủ & kệ', icon: <><rect x="4" y="3" width="16" height="18" rx="1" /><line x1="12" y1="3" x2="12" y2="21" /></> },
  { slug: 'giuong', label: 'Giường ngủ', icon: <path d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6M3 18h18M3 18v2M21 18v2M7 10V6h4v4" /> },
  { slug: 'den', label: 'Đèn', icon: <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.6.6 1 1.3 1 2.5h6c0-1.2.4-1.9 1-2.5A6 6 0 0012 3z" /> },
  { slug: 'trang-tri', label: 'Trang trí', icon: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></> },
]

interface Props {
  title?: string
  subtitle?: string
  searchValue: string
  onSearchChange: (v: string) => void
  onSearchSubmit: () => void
  onQuickCat: (slug: string) => void
}

export default function HeroSlider({ title, subtitle, searchValue, onSearchChange, onSearchSubmit, onQuickCat }: Props) {
  return (
    <section className="nt-banner">
      <div className="nt-container">
        <h1>{title ?? <>Nội thất tối giản cho <em>không gian sống chậm</em></>}</h1>
        <p>{subtitle || 'Hơn 500 mẫu sofa, bàn ghế, tủ kệ và phụ kiện trang trí — chất liệu gỗ tự nhiên, thiết kế bền vững theo thời gian.'}</p>
        <form
          className="nt-banner-search"
          role="search"
          onSubmit={e => { e.preventDefault(); onSearchSubmit() }}
        >
          <input
            type="search"
            placeholder="Tìm sofa, bàn ăn, kệ tivi, đèn trang trí..."
            aria-label="Tìm sản phẩm"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
          />
          <button type="submit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            Tìm kiếm
          </button>
        </form>
        <div className="nt-quickcats" data-reveal>
          {QUICK_CATS.map(qc => (
            <a
              key={qc.slug}
              href={`#${qc.slug}`}
              className="nt-quickcat"
              onClick={e => { e.preventDefault(); onQuickCat(qc.slug) }}
            >
              <span className="nt-quickcat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}>{qc.icon}</svg>
              </span>
              <span>{qc.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
