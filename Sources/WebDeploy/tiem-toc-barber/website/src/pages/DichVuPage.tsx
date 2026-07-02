import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Category {
  id: number
  name: string
  slug: string
  icon: string
  tag: string
  sort_order: number
}

interface Service {
  id: number
  category_id: number
  name: string
  note: string
  description: string
  price_text: string
  image: string
  is_featured: number
  sort_order: number
}

const FEATURE_IMAGES: Record<string, string> = {
  'cat-tao-kieu-nam': 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=700&q=80&auto=format&fit=crop',
  'cat-tao-kieu-nu':  'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=700&q=80&auto=format&fit=crop',
  'cao-rau-cham-soc': 'https://images.unsplash.com/photo-1593702288056-7cc0a831b8da?w=700&q=80&auto=format&fit=crop',
}

const FEATURE_DESC: Record<string, string> = {
  'cat-tao-kieu-nam': 'Từ kiểu tóc cổ điển đến fade hiện đại, undercut hay pompadour — chúng tôi am hiểu từng phong cách và tư vấn kiểu tóc phù hợp với khuôn mặt và lối sống của bạn.',
  'cat-tao-kieu-nu':  'Cắt layer, tỉa đuôi, bob, wolf cut hay lob — stylist nữ của chúng tôi am hiểu xu hướng và tư vấn kiểu tóc phù hợp với từng khuôn mặt và phong cách sống.',
  'cao-rau-cham-soc': 'Trải nghiệm cạo râu barber cổ điển với dao thẳng (straight razor) và khăn nóng (hot towel) — nhẹ nhàng, mịn màng và thư giãn tuyệt đối. Nghệ thuật của những người thợ thủ công thực thụ.',
}

export default function DichVuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/public/service-categories'),
      api.get<Service[]>('/public/services'),
    ]).then(([cats, svcs]) => {
      setCategories(cats)
      setServices(svcs)
    }).catch(() => {})
  }, [])

  const byCategory = (catId: number) => services.filter(s => s.category_id === catId)

  const featureSlugs = ['cat-tao-kieu-nam', 'cat-tao-kieu-nu', 'cao-rau-cham-soc']
  const featureCats = featureSlugs
    .map(slug => categories.find(c => c.slug === slug))
    .filter((c): c is Category => !!c)
  const restCats = categories.filter(c => !featureSlugs.includes(c.slug))

  return (
    <>
      <section className="tb-page-hero">
        <div className="wd-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="tb-ph-tag">Dịch vụ &amp; Bảng giá</div>
          <h1 className="tb-ph-title">Tất cả dịch vụ <em>&amp; giá cả</em></h1>
          <p className="tb-ph-sub">Minh bạch — không phát sinh chi phí ẩn. Giá hiển thị đã bao gồm mọi chi phí cơ bản.</p>
        </div>
      </section>

      <section style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          {featureCats.map((cat, idx) => {
            const items = byCategory(cat.id)
            const reverse = idx === 1
            return (
              <div className="tb-feature-strip" key={cat.id}>
                <div className={`row align-items-center g-5${reverse ? ' flex-row-reverse' : ''}`}>
                  <div className="col-lg-5" data-reveal>
                    <div className="tb-feature-img">
                      <img src={FEATURE_IMAGES[cat.slug] || items[0]?.image} alt={cat.name} />
                    </div>
                  </div>
                  <div className="col-lg-7" data-reveal data-delay="1">
                    <span className="tb-feature-label">Dịch vụ 0{idx + 1}</span>
                    <h2 className="tb-feature-title">{cat.name}</h2>
                    <p className="tb-feature-desc">{FEATURE_DESC[cat.slug]}</p>
                    <div className="tb-price-group">
                      <div className="tb-price-group-head">
                        <div className="tb-price-group-icon">{cat.icon}</div>
                        <span className="tb-price-group-name">{cat.name}</span>
                      </div>
                      {items.map(s => (
                        <div className="tb-price-item" key={s.id}>
                          <div>
                            <div className="tb-price-name">{s.name}</div>
                            {s.note && <span className="tb-price-note">{s.note}</span>}
                          </div>
                          <div className="tb-price-val">{s.price_text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="sec-pad tb-sec-light">
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="tb-eyebrow-dk">Hóa học &amp; Chăm sóc</div>
            <h2 className="tb-title-dk">Uốn / Duỗi / Nhuộm <em>&amp; Dưỡng</em></h2>
            <p className="tb-sub-dk mx-auto">Sử dụng sản phẩm cao cấp thương hiệu uy tín — bảo vệ tóc trong suốt quá trình xử lý hóa học.</p>
          </div>
          <div className="row g-4">
            {restCats.map((cat, idx) => (
              <div className="col-lg-6" data-reveal data-delay={String((idx % 2) + 1)} key={cat.id}>
                <div className="tb-price-group" style={{ background: '#fff', borderColor: '#e0dbd2' }}>
                  <div className="tb-price-group-head" style={{ background: 'rgba(184,144,42,.06)', borderColor: 'rgba(184,144,42,.2)' }}>
                    <div className="tb-price-group-icon">{cat.icon}</div>
                    <span className="tb-price-group-name" style={{ color: 'var(--text-dark)' }}>{cat.name}</span>
                  </div>
                  {byCategory(cat.id).map((s, i, arr) => (
                    <div className="tb-price-item" style={{ borderColor: i === arr.length - 1 ? 'transparent' : '#ede8e0' }} key={s.id}>
                      <div>
                        <div className="tb-price-name" style={{ color: 'var(--text-dark)' }}>{s.name}</div>
                        {s.note && <span className="tb-price-note" style={{ color: 'var(--text-dark-2)' }}>{s.note}</span>}
                      </div>
                      <div className="tb-price-val">{s.price_text}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4" data-reveal>
            <p style={{ fontSize: 13, color: 'var(--text-dark-2)', fontWeight: 300 }}>* Giá cuối cùng phụ thuộc vào độ dài, độ dày và tình trạng tóc. Stylist sẽ báo giá chính xác trước khi thực hiện.</p>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border-gold)', padding: 'clamp(56px,8vw,88px) 0' }}>
        <div className="wd-container text-center" data-reveal>
          <div className="tb-eyebrow" style={{ justifyContent: 'center' }}>Bắt đầu ngay</div>
          <h2 className="tb-title">Chọn được dịch vụ phù hợp? <em>Đặt lịch thôi!</em></h2>
          <p className="tb-sub mx-auto mb-4">Tư vấn miễn phí trước khi cắt — chúng tôi sẽ đề xuất kiểu phù hợp nhất với bạn.</p>
          <Link to="/dat-lich" className="tb-btn-gold">Đặt lịch ngay →</Link>
        </div>
      </section>
    </>
  )
}
