import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface ServiceCategory {
  id: number
  name: string
  slug: string
  description: string
  icon_svg: string
}

interface Service {
  id: number
  category_id: number
  category_name: string
  name: string
  description: string
  price_from: number
  price_unit: string
  duration: string
  recovery: string
  image: string
  is_featured: number
}

const CAT_ICONS: Record<string, string> = {
  'tham-my-guong-mat': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>`,
  'cham-soc-da-laser': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4"/></svg>`,
  'tham-my-co-the': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`,
}

const DEFAULT_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`

export default function DichVuPage() {
  const { settings }                = useSite()
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [services, setServices]     = useState<Service[]>([])
  const [activeTab, setActiveTab]   = useState<number | 'all'>('all')
  const [loading, setLoading]       = useState(true)

  const phone = settings.site_phone || '0901 234 567'

  useEffect(() => {
    Promise.all([
      api.get<ServiceCategory[]>('/public/service-categories'),
      api.get<Service[]>('/public/services'),
    ]).then(([cats, svcs]) => {
      setCategories(cats)
      setServices(svcs)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const displayed = activeTab === 'all' ? services : services.filter(s => s.category_id === activeTab)

  const grouped = categories.map(cat => ({
    cat,
    items: displayed.filter(s => s.category_id === cat.id),
  })).filter(g => g.items.length > 0)

  return (
    <>
      {/* Page hero */}
      <section className="tmv-page-hero">
        <div className="wd-container">
          <div data-reveal>
            <div className="tmv-ph-badge">Danh mục dịch vụ</div>
            <h1 className="tmv-ph-title">Dịch vụ thẩm mỹ <em>toàn diện</em></h1>
            <p className="tmv-ph-sub">Từ phẫu thuật chuyên sâu đến chăm sóc da — mọi nhu cầu làm đẹp đều được đáp ứng bởi đội ngũ bác sĩ hàng đầu.</p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">

          {/* Filter tabs */}
          <div className="tmv-filter-bar" data-reveal>
            <button
              className={`tmv-filter-btn${activeTab === 'all' ? ' active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Tất cả dịch vụ
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                className={`tmv-filter-btn${activeTab === c.id ? ' active' : ''}`}
                onClick={() => setActiveTab(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="row g-5">
            {/* Services list */}
            <div className="col-12 col-lg-8">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
                  Đang tải danh sách dịch vụ...
                </div>
              ) : grouped.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
                  Không có dịch vụ nào.
                </div>
              ) : grouped.map(({ cat, items }) => (
                <div key={cat.id} className="tmv-sg" data-reveal>
                  <div className="tmv-sg-header">
                    <div
                      className="tmv-sg-icon"
                      dangerouslySetInnerHTML={{ __html: CAT_ICONS[cat.slug] || DEFAULT_ICON }}
                    />
                    <div>
                      <div className="tmv-sg-title-text">{cat.name}</div>
                      <div className="tmv-sg-count">{items.length} dịch vụ</div>
                    </div>
                  </div>

                  {items.map(s => (
                    <div key={s.id} className="tmv-svc-row">
                      {s.image ? (
                        <img
                          className="tmv-svc-row-img"
                          src={s.image}
                          alt={s.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="tmv-svc-row-img" style={{ background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 28, opacity: .3 }}>✦</span>
                        </div>
                      )}
                      <div className="tmv-svc-row-body">
                        <div className="tmv-svc-row-tag">{s.category_name}</div>
                        <div className="tmv-svc-row-name">{s.name}</div>
                        {s.description && <p className="tmv-svc-row-desc">{s.description}</p>}
                        <div className="tmv-svc-row-meta">
                          {s.price_from > 0 && (
                            <div className="tmv-svc-meta-item">
                              <strong>Từ {Number(s.price_from).toLocaleString('vi-VN')}đ/{s.price_unit}</strong>
                            </div>
                          )}
                          {s.duration && <div className="tmv-svc-meta-item">⏱ Thời gian: {s.duration}</div>}
                          {s.recovery && <div className="tmv-svc-meta-item">🔄 Phục hồi: {s.recovery}</div>}
                        </div>
                      </div>
                      <div className="tmv-svc-row-cta d-none d-md-block">
                        <Link
                          to="/tu-van"
                          className="tmv-btn tmv-btn-outline-gold"
                          style={{ fontSize: 12, padding: '8px 16px' }}
                        >
                          Tư vấn
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="col-12 col-lg-4">
              {/* Highlight card */}
              <div className="tmv-highlight-card" data-reveal style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8, position: 'relative', zIndex: 1 }}>
                  Tư vấn miễn phí
                </h3>
                <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, marginBottom: 24, position: 'relative', zIndex: 1 }}>
                  Không chắc nên chọn dịch vụ nào? Đặt lịch tư vấn miễn phí với bác sĩ chuyên khoa — không ràng buộc.
                </p>
                <Link
                  to="/tu-van"
                  className="tmv-btn tmv-btn-gold"
                  style={{ display: 'inline-flex', position: 'relative', zIndex: 1 }}
                >
                  Đặt lịch tư vấn ngay →
                </Link>
              </div>

              {/* Why choose us */}
              <div style={{ background: 'var(--clinical-white)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px', position: 'sticky', top: 88 }} data-reveal>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 18 }}>
                  Cam kết chất lượng
                </div>
                {[
                  { icon: '✓', text: 'Bác sĩ được cấp phép bởi Bộ Y tế' },
                  { icon: '✓', text: 'Thiết bị nhập khẩu chính hãng từ châu Âu' },
                  { icon: '✓', text: 'Phòng mổ vô khuẩn tiêu chuẩn ISO 14644' },
                  { icon: '✓', text: 'Theo dõi sau điều trị miễn phí 1 tháng' },
                  { icon: '✓', text: 'Bảo hành kết quả theo cam kết hợp đồng' },
                  { icon: '✓', text: 'Hoàn tiền 100% nếu không đúng như cam kết' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-light)', alignItems: 'flex-start' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--accent-light)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--accent)', fontWeight: 700, marginTop: 1 }}>
                      {item.icon}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.6 }}>{item.text}</div>
                  </div>
                ))}

                <div style={{ marginTop: 20 }}>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="tmv-btn tmv-btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                    📞 Gọi ngay để tư vấn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
