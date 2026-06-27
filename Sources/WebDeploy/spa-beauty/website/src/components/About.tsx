import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function About() {
  const { settings: s } = useSite()

  // Re-observe after settings load — Rule 26
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
    }, { threshold: 0.1 })
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [s])

  const features = [
    { icon: s.feature1_icon || '🌿', title: s.feature1_title || 'Chuyên viên tận tâm',  desc: s.feature1_desc || 'Đào tạo chuyên sâu, 5+ năm kinh nghiệm' },
    { icon: s.feature2_icon || '✨', title: s.feature2_title || 'Sản phẩm cao cấp',     desc: s.feature2_desc || 'Thương hiệu organic nhập khẩu, an toàn' },
    { icon: s.feature3_icon || '🧼', title: s.feature3_title || 'Không gian thư giãn',  desc: s.feature3_desc || 'Thiết kế đẳng cấp, âm nhạc nhẹ nhàng' },
    { icon: s.feature4_icon || '📱', title: s.feature4_title || 'Đặt lịch dễ dàng',    desc: s.feature4_desc || 'Online hoặc qua Zalo, xác nhận trong 15 phút' },
  ]

  const aboutImg = s.about_image || 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80&auto=format&fit=crop'

  return (
    <section className="sec-pad" style={{ background: 'var(--surface)' }}>
      <div className="wd-container">
        <div className="row g-5 align-items-center">
          <div className="col-md-6" data-reveal>
            <div className="sb-about-img">
              <img src={aboutImg} alt="Spa interior" style={{ width: '100%', borderRadius: 20, display: 'block' }} loading="lazy" />
              <div className="sb-about-badge">
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>Đang phục vụ</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Khách hàng VIP</div>
                <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 4, fontWeight: 300 }}>Gói Premium — Đặt trước 3 ngày</div>
              </div>
            </div>
          </div>

          <div className="col-md-6" data-reveal style={{ transitionDelay: '.12s' }}>
            <div className="sb-eyebrow">Về chúng tôi</div>
            <h2 className="sb-title">
              {s.about_title ? (
                <>Không gian <em>thiên đường</em><br />giữa lòng thành phố</>
              ) : (
                <>Không gian <em>thiên đường</em><br />giữa lòng thành phố</>
              )}
            </h2>
            <p style={{ fontSize: 15, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 28 }}>
              {s.about_sub || 'Bella Spa được thành lập với triết lý rằng mọi người đều xứng đáng được chăm sóc và thư giãn đích thực.'}
            </p>

            <div style={{ marginBottom: 28 }}>
              {features.map((f, i) => (
                <div key={i} className="sb-feature-item">
                  <div className="sb-feature-icon">{f.icon}</div>
                  <div>
                    <div className="sb-feature-title">{f.title}</div>
                    <div className="sb-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/dat-lich" className="sb-btn-accent">Đặt lịch ngay</Link>
              <Link to="/dich-vu" className="sb-btn-ghost">Khám phá dịch vụ</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
