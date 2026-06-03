import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import RevealObserver from '../RevealObserver'

interface Service {
  id: number; name: string; slug: string; icon: string; description: string
  content: string; price_text: string; features: string; featured: number; sort_order: number
}

const PRICING = [
  {
    tier: 'Starter', price: '15.000.000', unit: 'đ', hot: false,
    desc: 'Website landing page đơn giản, responsive, deploy lên hosting.',
    features: ['Tối đa 5 trang', 'Thiết kế theo mẫu có sẵn', 'Responsive mobile', 'Hỗ trợ 1 tháng'],
    btnText: 'Yêu cầu báo giá',
  },
  {
    tier: 'Professional', price: '35.000.000', unit: 'đ', hot: true,
    desc: 'Website đầy đủ tính năng, CMS admin, SEO cơ bản, 1 năm hosting.',
    features: ['Không giới hạn trang', 'Thiết kế riêng theo brand', 'CMS quản lý nội dung', 'SEO on-page cơ bản', 'Hỗ trợ 3 tháng'],
    btnText: 'Yêu cầu báo giá',
  },
  {
    tier: 'Enterprise', price: 'Liên hệ', unit: '', hot: false,
    desc: 'Hệ thống phức tạp, tích hợp API, custom logic theo yêu cầu doanh nghiệp.',
    features: ['Phân tích chuyên sâu', 'Kiến trúc hệ thống riêng', 'Tích hợp bên thứ 3', 'Bàn giao source code', 'Bảo trì dài hạn'],
    btnText: 'Liên hệ tư vấn',
  },
]

const PROCESS = [
  { num: '01', title: 'Tư vấn & Phân tích yêu cầu', desc: 'Gặp gỡ, lắng nghe, phân tích mục tiêu kinh doanh và xác định scope dự án chi tiết.' },
  { num: '02', title: 'Thiết kế & Duyệt giao diện', desc: 'Wireframe → Mockup → Prototype. Duyệt 2 vòng cho đến khi bạn hoàn toàn hài lòng.' },
  { num: '03', title: 'Phát triển & Kiểm thử', desc: 'Lập trình, tích hợp API, test đa thiết bị, performance testing, security review.' },
  { num: '04', title: 'Bàn giao & Hỗ trợ', desc: 'Deploy, training sử dụng, bàn giao source code. Hỗ trợ 30 ngày sau khi live.' },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    api.get<Service[]>('/public/services').then(setServices).catch(() => {})
  }, [])

  const parseFeatures = (f: string): string[] => {
    try { return JSON.parse(f) } catch { return [] }
  }

  const featured = services.filter(s => s.featured)
  const others   = services.filter(s => !s.featured)

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Dịch vụ</div>
          <h1 className="ph-title">Giải pháp số <em>toàn diện</em></h1>
          <p className="ph-sub">Từ ý tưởng đến sản phẩm hoàn chỉnh — chúng tôi đồng hành cùng bạn ở mọi giai đoạn.</p>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          {featured.length > 0 && (
            <div className="row g-4 mb-5">
              {featured.slice(0, 2).map((s, i) => (
                <div key={s.id} className="col-md-6">
                  <div className={`reveal${i > 0 ? ' reveal-d1' : ''}`}
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
                    <div style={{ padding: '28px' }}>
                      <div className="svc-icon" style={{ marginBottom: '14px' }}>{s.icon}</div>
                      <h3 className="svc-title">{s.name}</h3>
                      <p className="svc-desc" style={{ marginBottom: '16px' }}>{s.description}</p>
                      {parseFeatures(s.features).length > 0 && (
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '20px' }}>
                          {parseFeatures(s.features).map((f, fi) => (
                            <li key={fi} style={{ fontSize: '13px', color: 'var(--text-2)', display: 'flex', gap: '8px' }}>
                              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>✓</span>{f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Link to="/lien-he" className="btn-accent" style={{ fontSize: '13px', padding: '10px 20px' }}>Tư vấn miễn phí →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="row g-3">
            {others.map((s, i) => (
              <div key={s.id} className="col-md-4">
                <div className={`svc-card reveal${i % 3 === 1 ? ' reveal-d1' : i % 3 === 2 ? ' reveal-d2' : ''}`}>
                  <div className="svc-icon">{s.icon}</div>
                  <div className="svc-title">{s.name}</div>
                  <div className="svc-desc">{s.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="row g-5 align-items-center">
            <div className="col-md-5 reveal">
              <div className="eyebrow">Quy trình</div>
              <h2 className="sec-title">Làm việc <em>minh bạch</em><br />từ đầu đến cuối</h2>
              <p className="sec-sub mb-0">Mỗi dự án đều có timeline rõ ràng, milestone được xác nhận, cập nhật tiến độ hàng ngày qua Zalo.</p>
            </div>
            <div className="col-md-7 reveal reveal-d1">
              {PROCESS.map(p => (
                <div key={p.num} className="process-step">
                  <div className="ps-num">{p.num}</div>
                  <div>
                    <div className="ps-title">{p.title}</div>
                    <div className="ps-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Bảng giá</div>
            <h2 className="sec-title">Phù hợp với <em>mọi ngân sách</em></h2>
            <p className="sec-sub">Giá cố định, không phát sinh. Liên hệ để nhận báo giá dự án cụ thể.</p>
          </div>
          <div className="row g-3">
            {PRICING.map((p, i) => (
              <div key={p.tier} className="col-md-4">
                <div className={`price-card${p.hot ? ' hot' : ''} reveal${i > 0 ? ` reveal-d${i}` : ''}`}>
                  {p.hot && <div className="pc-hot-tag">✦ Phổ biến nhất</div>}
                  <div className="pc-tier">{p.tier}</div>
                  <div className="pc-price">
                    {p.price} {p.unit && <sub>{p.unit}</sub>}
                  </div>
                  <div className="pc-desc">{p.desc}</div>
                  <ul className="pc-list">
                    {p.features.map((f, fi) => <li key={fi}>{f}</li>)}
                  </ul>
                  <Link to="/lien-he"><button className="pc-btn">{p.btnText}</button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="wd-container reveal">
          <h2 className="cta-title">Dự án của bạn bắt đầu từ đây</h2>
          <p className="cta-sub">Tư vấn miễn phí · Báo giá trong 24 giờ · Không ràng buộc</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <Link to="/lien-he" className="btn-white">Nhận báo giá ngay →</Link>
            <Link to="/du-an" className="btn-outline-white">Xem dự án đã làm</Link>
          </div>
        </div>
      </section>

      <RevealObserver />
    </>
  )
}
