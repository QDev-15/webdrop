import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import { usePageTitle } from '../../hooks/usePageTitle'

interface Service {
  id: number; name: string; description: string; content: string; icon: string; image: string; price: string; status: string
}

export default function ServicesPage() {
  const { settings } = useSite()
  usePageTitle('Dịch vụ', `Các dịch vụ agency cung cấp tại ${settings.site_name || 'chúng tôi'}.`)
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    api.get<Service[]>('/public/services').then(setServices).catch(console.error)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [services])

  const pricing = [
    { tier: 'Starter', price: '15.000.000', sub: 'đ', desc: 'Website landing page đơn giản, responsive, deploy lên hosting.', items: ['Tối đa 5 trang', 'Thiết kế theo mẫu có sẵn', 'Responsive mobile', 'Hỗ trợ 1 tháng'], hot: false },
    { tier: 'Professional', price: '35.000.000', sub: 'đ', desc: 'Website đầy đủ tính năng, CMS admin, SEO cơ bản, 1 năm hosting.', items: ['Không giới hạn trang', 'Thiết kế riêng theo brand', 'CMS quản lý nội dung', 'SEO on-page cơ bản', 'Hỗ trợ 3 tháng'], hot: true },
    { tier: 'Enterprise', price: 'Liên hệ', sub: '', desc: 'Hệ thống phức tạp, tích hợp API, custom logic theo yêu cầu doanh nghiệp.', items: ['Phân tích chuyên sâu', 'Kiến trúc hệ thống riêng', 'Tích hợp bên thứ 3', 'Bàn giao source code', 'Bảo trì dài hạn'], hot: false },
  ]

  const process = [
    { num: '01', title: 'Tư vấn & Phân tích yêu cầu', desc: 'Gặp gỡ, lắng nghe, phân tích mục tiêu kinh doanh và xác định scope dự án chi tiết.' },
    { num: '02', title: 'Thiết kế & Duyệt giao diện', desc: 'Wireframe → Mockup → Prototype. Duyệt 2 vòng cho đến khi bạn hoàn toàn hài lòng.' },
    { num: '03', title: 'Phát triển & Kiểm thử', desc: 'Lập trình, tích hợp API, test đa thiết bị, performance testing, security review.' },
    { num: '04', title: 'Bàn giao & Hỗ trợ', desc: 'Deploy, training sử dụng, bàn giao source code. Hỗ trợ 30 ngày sau khi live.' },
  ]

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Dịch vụ</div>
          <h1 className="ph-title">Giải pháp số <em>toàn diện</em></h1>
          <p className="ph-sub">Từ ý tưởng đến sản phẩm hoàn chỉnh — chúng tôi đồng hành cùng bạn ở mọi giai đoạn.</p>
        </div>
      </section>

      {/* MAIN SERVICES */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          {services.length > 0 ? (
            <>
              <div className="row g-4 mb-5">
                {services.slice(0, 2).map((svc, i) => (
                  <div key={svc.id} className="col-md-6">
                    <div className={`reveal${i === 1 ? ' reveal-d1' : ''}`} data-reveal style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
                      {svc.image && <img src={svc.image} alt={svc.name} style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} loading="lazy" />}
                      <div style={{ padding: '28px' }}>
                        <div className="svc-icon" style={{ marginBottom: '14px' }}>{svc.icon || '🌐'}</div>
                        <h3 className="svc-title">{svc.name}</h3>
                        <p className="svc-desc">{svc.description}</p>
                        <Link to="/lien-he" className="btn-accent" style={{ fontSize: '13px', padding: '10px 20px' }}>Tư vấn miễn phí →</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row g-3">
                {services.slice(2).map((svc, i) => (
                  <div key={svc.id} className="col-md-4">
                    <div className={`svc-card reveal${i === 1 ? ' reveal-d1' : i === 2 ? ' reveal-d2' : ''}`} data-reveal>
                      <div className="svc-icon">{svc.icon || '🌐'}</div>
                      <div className="svc-title">{svc.name}</div>
                      <div className="svc-desc">{svc.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center" style={{ padding: '48px', color: 'var(--text-3)' }}>Đang tải dịch vụ...</div>
          )}
        </div>
      </section>

      {/* PROCESS */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="row g-5 align-items-center">
            <div className="col-md-5 reveal" data-reveal>
              <div className="eyebrow">Quy trình</div>
              <h2 className="sec-title">Làm việc <em>minh bạch</em><br />từ đầu đến cuối</h2>
              <p className="sec-sub mb-0">Mỗi dự án đều có timeline rõ ràng, milestone được xác nhận, cập nhật tiến độ hàng ngày qua Zalo.</p>
            </div>
            <div className="col-md-7 reveal reveal-d1" data-reveal>
              {process.map(step => (
                <div key={step.num} style={{ display: 'flex', gap: '20px', padding: '24px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-light)', border: '1.5px solid var(--accent-mid)', fontSize: '12px', fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.num}</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)', marginBottom: '5px' }}>{step.title}</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.65 }}>{step.desc}</div>
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
          <div className="text-center mb-5 reveal" data-reveal>
            <div className="eyebrow">Bảng giá</div>
            <h2 className="sec-title">Phù hợp với <em>mọi ngân sách</em></h2>
            <p className="sec-sub">Giá cố định, không phát sinh. Liên hệ để nhận báo giá dự án cụ thể.</p>
          </div>
          <div className="row g-3">
            {pricing.map((pc, i) => (
              <div key={pc.tier} className="col-md-4">
                <div className={`reveal${i === 1 ? ' reveal-d1' : i === 2 ? ' reveal-d2' : ''}`} data-reveal style={{ background: pc.hot ? 'linear-gradient(160deg,var(--accent-light) 0%,#fff 60%)' : 'var(--surface)', border: `1px solid ${pc.hot ? 'var(--accent-mid)' : 'var(--border)'}`, borderRadius: '16px', padding: '28px', position: 'relative', height: '100%' }}>
                  {pc.hot && (
                    <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>✦ Phổ biến nhất</div>
                  )}
                  <div style={{ fontSize: '11px', fontWeight: 600, color: pc.hot ? 'var(--accent)' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: '10px' }}>{pc.tier}</div>
                  <div style={{ fontSize: 'clamp(24px,3vw,34px)', fontWeight: 600, color: 'var(--text)', letterSpacing: '-.8px', marginBottom: '6px', lineHeight: 1 }}>
                    {pc.price}{pc.sub && <sub style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text-2)' }}>{pc.sub}</sub>}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 300, color: 'var(--text-2)', marginBottom: '18px', lineHeight: 1.6 }}>{pc.desc}</div>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
                    {pc.items.map(item => (
                      <li key={item} style={{ fontSize: '13px', color: 'var(--text-2)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '11.5px', flexShrink: 0 }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => window.location.href = '/lien-he'} style={{ width: '100%', padding: '11px', borderRadius: '9px', fontSize: '13.5px', fontWeight: 500, cursor: 'pointer', transition: 'all .2s', border: `1px solid ${pc.hot ? 'var(--accent)' : 'var(--border)'}`, background: pc.hot ? 'var(--accent)' : 'transparent', color: pc.hot ? '#fff' : 'var(--text)', fontFamily: 'var(--sans)' }}>
                    {pc.tier === 'Enterprise' ? 'Liên hệ tư vấn' : 'Yêu cầu báo giá'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="wd-container" data-reveal>
          <h2 className="cta-title">Dự án của bạn bắt đầu từ đây</h2>
          <p className="cta-sub">Tư vấn miễn phí · Báo giá trong 24 giờ · Không ràng buộc</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <Link to="/lien-he" className="btn-white">Nhận báo giá ngay →</Link>
            <Link to="/du-an" className="btn-outline-white">Xem dự án đã làm</Link>
          </div>
        </div>
      </section>
    </>
  )
}
