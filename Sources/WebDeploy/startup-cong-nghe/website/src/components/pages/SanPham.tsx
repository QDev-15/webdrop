import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import { usePageTitle } from '../../hooks/usePageTitle'

interface Feature { id: number; name: string; tag: string; icon: string; description: string; content: string }

export default function SanPham() {
  usePageTitle('Sản phẩm')
  const { settings } = useSite()
  const [features, setFeatures] = useState<Feature[]>([])

  useEffect(() => {
    api.get<Feature[]>('/public/features').then(setFeatures).catch(() => {})
    // Reveal
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [features])

  return (
    <>
      {/* PAGE HERO */}
      <section className="st-page-hero" aria-labelledby="sp-heading">
        <div className="wd-container">
          <div className="st-ph-inner">
            <div className="st-ph-badge"><span aria-hidden="true">⚙</span> Tính năng sản phẩm</div>
            <h1 className="st-ph-title" id="sp-heading">
              Tất cả những gì bạn cần<br />để <em>tăng tốc</em> doanh nghiệp
            </h1>
            <p className="st-ph-sub">
              {settings.site_name} cung cấp bộ công cụ toàn diện cho doanh nghiệp Việt Nam — từ tự động hóa, phân tích đến tích hợp liền mạch với hệ thống hiện có.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES — alternating sections */}
      {features.map((feature, i) => {
        const bullets = feature.content?.split('\n').filter(Boolean) ?? []
        const isReverse = i % 2 !== 0
        return (
          <section
            key={feature.id}
            className="sec-pad"
            style={{ background: isReverse ? 'var(--dark2)' : 'var(--bg)' }}
            aria-labelledby={`feat${feature.id}-heading`}
          >
            <div className="wd-container">
              <div className={`st-feature-detail${isReverse ? ' reverse' : ''}`} data-reveal>
                <div>
                  <div className="st-feature-tag">
                    <span aria-hidden="true">{feature.icon}</span> {feature.tag}
                  </div>
                  <h2 className="st-feature-heading" id={`feat${feature.id}-heading`}>{feature.name}</h2>
                  <p className="st-feature-para">{feature.description}</p>
                  {bullets.length > 0 && (
                    <ul className="st-feat-list">
                      {bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  )}
                </div>
                <div className="st-feature-visual-box" aria-hidden="true">
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>{feature.tag?.toUpperCase()}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200, fontSize: 64 }}>{feature.icon}</div>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* MORE FEATURES grid */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }} aria-labelledby="morefeat-heading">
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="st-section-badge"><span aria-hidden="true">✨</span> Tính năng khác</div>
            <h2 className="st-section-title" id="morefeat-heading">Và còn nhiều hơn thế nữa</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: '🤖', title: 'AI Assistant tích hợp',          desc: 'Gợi ý hành động thông minh dựa trên dữ liệu lịch sử. Trả lời câu hỏi bằng ngôn ngữ tự nhiên, không cần viết query phức tạp.' },
              { icon: '📱', title: 'Ứng dụng di động',               desc: 'Quản lý và theo dõi kinh doanh mọi lúc mọi nơi với app iOS và Android. Thông báo real-time về các sự kiện quan trọng.' },
              { icon: '🌐', title: 'Đa ngôn ngữ & Đa tiền tệ',       desc: 'Hỗ trợ tiếng Việt, tiếng Anh và nhiều ngôn ngữ khác. Xử lý đa tiền tệ tự động theo tỷ giá thực tế.' },
              { icon: '📋', title: 'Quản lý tác vụ & Dự án',          desc: 'Tích hợp kanban board, timeline và quản lý deadline ngay trong nền tảng. Không cần thêm phần mềm quản lý dự án riêng.' },
              { icon: '📬', title: 'Email & SMS Marketing',           desc: 'Công cụ email marketing tích hợp với template chuyên nghiệp, A/B testing và theo dõi tỷ lệ mở email theo thời gian thực.' },
              { icon: '🔧', title: 'Tùy chỉnh không giới hạn',       desc: 'Custom field, workflow, dashboard và báo cáo hoàn toàn theo nhu cầu. Mỗi doanh nghiệp có thể cấu hình nền tảng khác nhau.' },
            ].map((item, i) => (
              <div key={i} className="col-md-4" data-reveal>
                <div className="st-glass" style={{ height: '100%' }}>
                  <div className="st-feat-icon" aria-hidden="true">{item.icon}</div>
                  <div className="st-feat-title">{item.title}</div>
                  <div className="st-feat-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="st-cta-section sec-pad" aria-labelledby="sp-cta-heading">
        <div className="wd-container">
          <div className="st-cta-inner" data-reveal>
            <h2 className="st-cta-title" id="sp-cta-heading">
              Sẵn sàng trải nghiệm<br /><span className="st-grad-text">toàn bộ tính năng?</span>
            </h2>
            <p className="st-cta-sub">Dùng thử miễn phí 14 ngày — không cần thẻ tín dụng, không ràng buộc hợp đồng.</p>
            <div className="st-hero-ctas" style={{ justifyContent: 'center' }}>
              <Link to="/bang-gia" className="st-btn-primary">Bắt đầu miễn phí</Link>
              <Link to="/lien-he" className="st-btn-ghost">Đặt lịch demo</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
