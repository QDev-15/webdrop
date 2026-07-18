import { Link } from 'react-router-dom'

interface CollectionItem {
  eyebrow: string
  title: string
  titleEm: string
  desc: string
  image: string
  alt: string
  reverse?: boolean
}

const COLLECTIONS: CollectionItem[] = [
  {
    eyebrow: 'Drop mới nhất',
    title: 'Đường Phố',
    titleEm: 'Năng Động',
    desc: 'Chất liệu bền, form rộng, cá tính — dành cho những ai yêu thích phong cách streetwear tự do và không ngại thể hiện bản thân.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    alt: 'Bộ sưu tập Đường Phố — phong cách năng động',
  },
  {
    eyebrow: 'Giới hạn số lượng',
    title: 'Công Sở',
    titleEm: 'Hiện Đại',
    desc: 'Thiết kế tối giản, chất liệu cao cấp, tôn dáng — phù hợp môi trường công sở năng động và những buổi gặp gỡ quan trọng.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    alt: 'Bộ sưu tập Công Sở — thanh lịch hiện đại',
    reverse: true,
  },
  {
    eyebrow: 'Sản xuất giới hạn',
    title: 'Bộ Sưu Tập',
    titleEm: 'Độc Bản',
    desc: 'Số lượng giới hạn, thiết kế độc quyền — dành cho những ai yêu thích sự khác biệt và không muốn đụng hàng.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop&q=80',
    alt: 'Bộ sưu tập Giới Hạn — thiết kế độc bản',
  },
]

export default function CollectionPage() {
  return (
    <>
      <section className="st-page-hero" aria-label="Tiêu đề trang">
        <div className="st-container">
          <nav className="st-breadcrumb mb-3" aria-label="Điều hướng">
            <Link to="/">Trang chủ</Link>
            <span className="st-breadcrumb-sep">/</span>
            <span>Bộ sưu tập</span>
          </nav>
          <h1 className="st-page-title">Bộ Sưu Tập</h1>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 14, fontWeight: 600, maxWidth: 400, marginTop: 8 }}>
            Mỗi bộ sưu tập kể một câu chuyện riêng — chọn phong cách phù hợp với bạn
          </p>
        </div>
      </section>

      <section className="st-sec" aria-label="Danh sách bộ sưu tập">
        <div className="st-container">
          {COLLECTIONS.map((c, i) => (
            <div
              className="st-strip"
              data-reveal
              key={c.title}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 56,
                alignItems: 'center',
                paddingBottom: i < COLLECTIONS.length - 1 ? 64 : 0,
              }}
            >
              <div style={{ order: c.reverse ? 2 : undefined, borderRadius: 0, overflow: 'hidden', aspectRatio: '4/3' }}>
                <img src={c.image} alt={c.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ order: c.reverse ? 1 : undefined }}>
                <div className="st-eyebrow">{c.eyebrow}</div>
                <h2 className="st-sec-title">{c.title}<br /><em>{c.titleEm}</em></h2>
                <p className="st-sec-sub" style={{ maxWidth: 420 }}>{c.desc}</p>
                <Link to="/san-pham" className="st-btn st-btn-primary" style={{ marginTop: 20 }}>
                  Khám phá ngay <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
