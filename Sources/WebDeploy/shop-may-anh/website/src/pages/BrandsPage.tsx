import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function BrandsPage() {
  useDocumentMeta({
    title: 'Thương Hiệu — PhotoPro Máy Ảnh & Thiết Bị Nhiếp Ảnh',
    description: 'Các thương hiệu máy ảnh chính hãng phân phối tại PhotoPro — Sony, Canon, Nikon, Fujifilm.',
  })

  const { settings } = useSite()
  const val = (k: string, fallback = '') => settings[k] || fallback

  const brands = [1, 2, 3, 4].map(i => ({
    name: val(`brand${i}_name`),
    desc: val(`brand${i}_desc`),
    image: val(`brand${i}_image`),
  })).filter(b => b.name)

  return (
    <>
      <section className="ma-page-hero">
        <div className="ma-container">
          <div className="ma-breadcrumb">
            <Link to="/">Trang chủ</Link><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /><span>Thương hiệu</span>
          </div>
          <h1 className="ma-page-title">Thương Hiệu</h1>
          <p className="ma-page-count">Đại lý phân phối chính hãng các thương hiệu máy ảnh hàng đầu thế giới</p>
        </div>
      </section>

      <main>
        <section className="ma-sec">
          <div className="ma-container">
            <div className="row g-4">
              {brands.map((b, i) => (
                <div className="col-md-3 col-6" data-reveal data-delay={String(i + 1)} key={b.name}>
                  <Link to="/san-pham" style={{ display: 'block', textDecoration: 'none' }}>
                    <div style={{ borderTop: '4px solid var(--accent)', borderRadius: 3, overflow: 'hidden', background: 'var(--surface)' }}>
                      <div style={{ aspectRatio: '4/3' }}>
                        <img src={b.image} alt={`${b.name} — máy ảnh chính hãng`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: 20 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{b.name}</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>{b.desc}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ma-sec ma-sec-alt" aria-labelledby="why-heading">
          <div className="ma-container">
            <div className="ma-sec-header ma-center" data-reveal>
              <div className="ma-eyebrow"><i className="bi bi-patch-check" /> Cam kết</div>
              <h2 className="ma-sec-title" id="why-heading">Vì sao chọn <em>đại lý chính hãng</em></h2>
            </div>
            <div className="ma-feature-grid">
              <div className="ma-feature" data-reveal data-delay="1">
                <div className="ma-feature-icon"><i className="bi bi-award" /></div>
                <h3>Đại lý ủy quyền</h3>
                <p>Là đại lý ủy quyền chính thức, đảm bảo nguồn gốc rõ ràng cho mọi sản phẩm.</p>
              </div>
              <div className="ma-feature" data-reveal data-delay="2">
                <div className="ma-feature-icon"><i className="bi bi-shield-check" /></div>
                <h3>Bảo hành toàn quốc</h3>
                <p>Bảo hành chính hãng 24 tháng tại tất cả trung tâm ủy quyền trên toàn quốc.</p>
              </div>
              <div className="ma-feature" data-reveal data-delay="3">
                <div className="ma-feature-icon"><i className="bi bi-truck" /></div>
                <h3>Giao hàng nhanh</h3>
                <p>Giao hàng toàn quốc, kiểm tra máy trước khi thanh toán.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
