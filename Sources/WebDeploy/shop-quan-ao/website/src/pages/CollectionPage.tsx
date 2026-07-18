import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const COLLECTIONS = [
  {
    tag: 'Mới ra mắt',
    title: 'Xuân Hè',
    titleStrong: '2025',
    desc: 'Chất liệu linen và cotton mềm mại, tông màu pastel tươi sáng, thiết kế phóng khoáng phù hợp cho những ngày hè năng động.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    alt: 'Bộ sưu tập Xuân Hè — váy đầm nhẹ nhàng',
    reverse: false,
  },
  {
    tag: 'Giới hạn số lượng',
    title: 'Dòng',
    titleStrong: 'Công Sở',
    desc: 'Thiết kế thanh lịch, form dáng chuẩn, chất liệu cao cấp ít nhăn — tự tin sải bước trong môi trường công sở hiện đại.',
    image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&auto=format&fit=crop&q=80',
    alt: 'Bộ sưu tập Công Sở — áo thanh lịch',
    reverse: true,
  },
  {
    tag: 'Bán chạy nhất',
    title: 'Dạo Phố',
    titleStrong: 'Cuối Tuần',
    desc: 'Phong cách thoải mái, dễ phối đồ, chất liệu bền đẹp cho những buổi dạo phố hay cà phê cuối tuần cùng bạn bè.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop&q=80',
    alt: 'Bộ sưu tập Dạo Phố — phong cách năng động',
    reverse: false,
  },
]

export default function CollectionPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Lys Chic'

  return (
    <>
      <div className="qa-page-header">
        <div className="qa-container">
          <nav className="qa-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Bộ sưu tập</span>
          </nav>
          <h1 className="qa-page-title">Bộ sưu tập</h1>
          <p className="qa-page-count" style={{ fontSize: 16 }}>Mỗi bộ sưu tập kể một câu chuyện — chọn phong cách phù hợp với bạn nhất</p>
        </div>
      </div>

      <main>
        <section className="qa-sec">
          <div className="qa-container">
            {COLLECTIONS.map((c, i) => (
              <div
                className="qa-value-item"
                data-reveal
                key={c.title}
                style={{
                  gridTemplateColumns: '1fr 1fr',
                  gap: 44,
                  border: 'none',
                  padding: i === COLLECTIONS.length - 1 ? 0 : '0 0 60px',
                  flexDirection: c.reverse ? 'row-reverse' : undefined,
                }}
              >
                <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4/3', order: c.reverse ? 1 : undefined }}>
                  <img src={c.image} alt={c.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ alignSelf: 'center', order: c.reverse ? 2 : undefined }}>
                  <div className="qa-eyebrow">{c.tag}</div>
                  <h2 className="qa-sec-title">{c.title} <strong>{c.titleStrong}</strong></h2>
                  <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 24, maxWidth: 460 }}>{c.desc}</p>
                  <Link to="/san-pham" className="qa-btn qa-btn-primary">Khám phá ngay <i className="bi bi-arrow-right ms-1" /></Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="qa-sec qa-newsletter" aria-labelledby="cta-heading">
          <div className="qa-container">
            <div className="qa-newsletter-inner">
              <div className="qa-eyebrow" style={{ justifyContent: 'center' }} data-reveal>Không muốn bỏ lỡ</div>
              <h2 className="qa-sec-title" id="cta-heading" data-reveal data-delay="1">Xem toàn bộ <strong>sản phẩm</strong></h2>
              <p style={{ fontSize: 15, color: 'var(--text-2)', marginTop: 8 }} data-reveal data-delay="2">Khám phá đầy đủ danh mục sản phẩm từ tất cả các bộ sưu tập của {siteName}</p>
              <div style={{ marginTop: 28 }} data-reveal data-delay="3">
                <Link to="/san-pham" className="qa-btn qa-btn-primary">Xem tất cả sản phẩm <i className="bi bi-arrow-right ms-1" /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
