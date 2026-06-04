import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import RevealObserver from '../RevealObserver'

interface Service {
  id: number; name: string; icon: string; description: string; slug: string
}
interface Project {
  id: number; title: string; category: string; industry: string; description: string; image: string; client: string
}
interface Testimonial {
  id: number; author_name: string; author_title: string; author_avatar: string; content: string; rating: number
}

const FALLBACK_SERVICES: Service[] = [
  { id: 1, name: 'Thiết kế Website',        icon: '🖥️', slug: 'thiet-ke-website',    description: 'Website responsive, tốc độ cao, SEO chuẩn. Từ landing page đơn giản đến portal phức tạp.' },
  { id: 2, name: 'Ứng dụng Di động',         icon: '📱', slug: 'ung-dung-di-dong',    description: 'App iOS và Android native hoặc cross-platform. UX mượt mà, trải nghiệm người dùng tối ưu.' },
  { id: 3, name: 'Marketing Số',             icon: '📈', slug: 'marketing-so',        description: 'SEO, Google Ads, Facebook Ads, Email Marketing — chiến lược đa kênh tối ưu ROI.' },
  { id: 4, name: 'Thiết kế Thương hiệu',    icon: '🎨', slug: 'thiet-ke-thuong-hieu', description: 'Logo, bộ nhận diện thương hiệu, brand guideline nhất quán trên mọi điểm chạm.' },
  { id: 5, name: 'Hệ thống Quản lý',        icon: '⚙️', slug: 'he-thong-quan-ly',    description: 'CRM, ERP, phần mềm nội bộ tuỳ chỉnh theo quy trình nghiệp vụ riêng của doanh nghiệp.' },
  { id: 6, name: 'Bảo trì & Hỗ trợ',       icon: '🛡️', slug: 'bao-tri-ho-tro',      description: 'Gói bảo trì hàng tháng, cập nhật nội dung, giám sát uptime, hỗ trợ kỹ thuật 24/7.' },
]

const FALLBACK_PROJECTS: Project[] = [
  { id: 1, title: 'Hệ thống Website BĐS — VinGroup',   category: 'web',   industry: 'Bất động sản',  description: 'Portal bất động sản với hơn 10.000 sản phẩm, tích hợp bản đồ, tìm kiếm nâng cao.',          image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&q=80&auto=format&fit=crop', client: 'VinGroup' },
  { id: 2, title: 'App đặt bàn & delivery — Nhà hàng Sen', category: 'app', industry: 'F&B',          description: 'App iOS & Android với tính năng đặt bàn online, gọi món, tracking đơn hàng.',              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop', client: 'Nhà hàng Sen' },
  { id: 3, title: 'Website Spa Lavender',                category: 'web',   industry: 'Beauty & Spa', description: 'Landing page đặt lịch online, gallery dịch vụ, tích hợp Zalo OA.',                          image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80&auto=format&fit=crop', client: 'Spa Lavender' },
]

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: 1, author_name: 'Trần Minh Hoàng', author_title: 'CEO · Công ty BĐS Minh Phát',      author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Đội ngũ chuyên nghiệp, hiểu sâu về yêu cầu kinh doanh. Website mới tăng 40% tỷ lệ chuyển đổi sau 3 tháng.', rating: 5 },
  { id: 2, author_name: 'Nguyễn Lan Anh',  author_title: 'Giám đốc Marketing · FoodChain VN', author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Bàn giao đúng hạn, không phát sinh chi phí. Tiến độ minh bạch, luôn cập nhật qua Zalo mỗi ngày.',           rating: 5 },
  { id: 3, author_name: 'Phạm Đức Toàn',   author_title: 'CTO · StartupX',                    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face', content: 'App iOS chạy mượt, UI đẹp. User review 4.8★ trên App Store ngay tháng đầu ra mắt. Rất ấn tượng.',          rating: 5 },
]

export default function HomePage() {
  const { settings, slides } = useSite()
  const [services, setServices]         = useState<Service[]>([])
  const [projects, setProjects]         = useState<Project[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Service[]>('/public/services').then(s => setServices(s.slice(0, 6))).catch(() => {})
    api.get<Project[]>('/public/projects').then(p => setProjects(p.slice(0, 3))).catch(() => {})
    api.get<Testimonial[]>('/public/testimonials').then(t => setTestimonials(t.slice(0, 3))).catch(() => {})
  }, [])

  const slide = slides[0]
  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

  const displayServices     = services.length     > 0 ? services     : FALLBACK_SERVICES
  const displayProjects     = projects.length     > 0 ? projects     : FALLBACK_PROJECTS
  const displayTestimonials = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS

  return (
    <>
      {/* HERO */}
      <section className="hero-section">
        {slide?.image && (
          <div className="hero-bg" style={{ backgroundImage: `url(${slide.image})` }} />
        )}
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="wd-container w-100 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="hero-badge">
                <span className="hero-dot" />
                {slide?.badge_text || 'Đối tác chiến lược của doanh nghiệp'}
              </div>
              <h1
                className="hero-title"
                dangerouslySetInnerHTML={{
                  __html: slide?.title || 'Chúng tôi tạo ra<br><em>kết quả</em> thực sự.'
                }}
              />
              <p className="hero-sub">
                {slide?.subtitle || settings.site_description || 'Từ chiến lược đến thực thi — đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số toàn diện, bền vững.'}
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to={slide?.button_link || '/dich-vu'} className="btn-white">
                  {slide?.button_text || 'Khám phá dịch vụ →'}
                </Link>
                <Link to={slide?.button2_link || '/du-an'} className="btn-outline-white">
                  {slide?.button2_text || 'Xem dự án'}
                </Link>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hs-num">{slide?.stat1_num || settings.stats_projects || '120+'}</div>
                  <div className="hs-label">{slide?.stat1_label || 'Dự án hoàn thành'}</div>
                </div>
                <div>
                  <div className="hs-num">{slide?.stat2_num || settings.stats_years || '8 năm'}</div>
                  <div className="hs-label">{slide?.stat2_label || 'Kinh nghiệm'}</div>
                </div>
                <div>
                  <div className="hs-num">{slide?.stat3_num || '98%'}</div>
                  <div className="hs-label">{slide?.stat3_label || 'Khách hàng hài lòng'}</div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)', aspectRatio: '4/5', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&auto=format&fit=crop"
                  alt="Team"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: .85 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(26,107,82,.2) 0%,transparent 50%)' }} />
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '14px 16px', border: '1px solid rgba(255,255,255,.08)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}>Dự án mới nhất</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.4)', fontWeight: 300 }}>Hoàn thành hôm nay · Website bất động sản</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTS STRIP */}
      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '28px 0' }}>
        <div className="wd-container">
          <p className="text-center mb-4 reveal" style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Tin tưởng bởi</p>
          <div className="d-flex gap-5 justify-content-center align-items-center flex-wrap reveal" style={{ opacity: .35, filter: 'grayscale(100%)' }}>
            <svg width="90" height="28" viewBox="0 0 90 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Viettel"><rect x="0" y="8" width="4" height="12" rx="2" fill="currentColor"/><rect x="7" y="4" width="4" height="20" rx="2" fill="currentColor"/><rect x="14" y="8" width="4" height="12" rx="2" fill="currentColor"/><text x="24" y="19" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="13" fill="currentColor">VIETTEL</text></svg>
            <svg width="80" height="28" viewBox="0 0 80 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Vingroup"><circle cx="10" cy="14" r="8" fill="currentColor"/><text x="22" y="19" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="12" fill="currentColor">VINGROUP</text></svg>
            <svg width="64" height="28" viewBox="0 0 64 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="FPT"><rect x="0" y="4" width="12" height="20" rx="3" fill="currentColor"/><rect x="2" y="10" width="8" height="2.5" rx="1" fill="white"/><text x="16" y="19" fontFamily="DM Sans,sans-serif" fontWeight="800" fontSize="14" fill="currentColor">FPT</text></svg>
            <svg width="96" height="28" viewBox="0 0 96 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Masan Group"><polygon points="6,4 12,14 6,24 0,14" fill="currentColor"/><text x="16" y="19" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="12" fill="currentColor">MASAN GRP</text></svg>
            <svg width="84" height="28" viewBox="0 0 84 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="VNG Corp"><rect x="0" y="6" width="10" height="10" rx="2" fill="currentColor"/><rect x="2" y="14" width="10" height="10" rx="2" fill="currentColor"/><text x="16" y="19" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="13" fill="currentColor">VNG CORP</text></svg>
            <svg width="78" height="28" viewBox="0 0 78 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Techcombank"><path d="M6 4 L12 14 L6 24 L0 14Z" fill="currentColor"/><path d="M10 4 L16 14 L10 24 L4 14Z" fill="currentColor" opacity=".5"/><text x="20" y="19" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="11" fill="currentColor">TECHCOM</text></svg>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Dịch vụ</div>
            <h2 className="sec-title">Giải pháp toàn diện<br />cho <em>doanh nghiệp</em></h2>
            <p className="sec-sub">Từ thiết kế đến triển khai, chúng tôi cung cấp đầy đủ dịch vụ số cho doanh nghiệp hiện đại.</p>
          </div>
          <div className="row g-3">
            {displayServices.map((s, i) => (
              <div key={s.id} className="col-md-4">
                <div className={`svc-card reveal${i % 3 === 1 ? ' reveal-d1' : i % 3 === 2 ? ' reveal-d2' : ''}`}>
                  <div className="svc-icon">{s.icon}</div>
                  <div className="svc-title">{s.name}</div>
                  <div className="svc-desc">{s.description}</div>
                  <Link to="/dich-vu" className="svc-link">Xem thêm →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-5 reveal">
            <div>
              <div className="eyebrow">Dự án nổi bật</div>
              <h2 className="sec-title mb-0">Công việc chúng tôi <em>tự hào</em></h2>
            </div>
            <Link to="/du-an" className="btn-ghost">Xem tất cả →</Link>
          </div>
          <div className="row g-3">
            {displayProjects[0] && (
              <div className="col-md-7">
                <div className="pf-card reveal">
                  <img className="pf-img" src={displayProjects[0].image} alt={displayProjects[0].title} loading="lazy" />
                  <div className="pf-overlay" />
                  <div className="pf-info">
                    <div className="pf-cat">{displayProjects[0].industry}</div>
                    <div className="pf-name">{displayProjects[0].title}</div>
                  </div>
                </div>
              </div>
            )}
            <div className="col-md-5">
              {displayProjects[1] && (
                <div className="pf-card mb-3 reveal reveal-d1">
                  <img className="pf-img" src={displayProjects[1].image} alt={displayProjects[1].title} loading="lazy" />
                  <div className="pf-overlay" />
                  <div className="pf-info">
                    <div className="pf-cat">{displayProjects[1].industry}</div>
                    <div className="pf-name">{displayProjects[1].title}</div>
                  </div>
                </div>
              )}
              {displayProjects[2] && (
                <div className="pf-card reveal reveal-d2">
                  <img className="pf-img" src={displayProjects[2].image} alt={displayProjects[2].title} loading="lazy" />
                  <div className="pf-overlay" />
                  <div className="pf-info">
                    <div className="pf-cat">{displayProjects[2].industry}</div>
                    <div className="pf-name">{displayProjects[2].title}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="sec-pad" style={{ background: 'var(--dark2)' }}>
        <div className="wd-container">
          <div className="row g-4 text-center">
            {[
              { num: settings.stats_projects || '120+', label: 'Dự án hoàn thành' },
              { num: settings.stats_clients  || '50+',  label: 'Khách hàng dài hạn' },
              { num: settings.stats_years    || '8 năm', label: 'Kinh nghiệm thực chiến' },
              { num: settings.stats_rating   || '4.9 ★', label: 'Đánh giá trung bình' },
            ].map((s, i) => (
              <div key={i} className={`col-md-3 col-6 reveal${i > 0 ? ` reveal-d${i}` : ''}`}>
                <div className="stat-num" style={{ color: '#fff' }}>{s.num}</div>
                <div className="stat-label" style={{ color: 'rgba(255,255,255,.35)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Khách hàng nói gì</div>
            <h2 className="sec-title">Niềm tin từ <em>thực tế</em></h2>
          </div>
          <div className="row g-3">
            {displayTestimonials.map((t, i) => (
              <div key={t.id} className="col-md-4">
                <div className={`rv reveal${i > 0 ? ` reveal-d${i}` : ''}`}>
                  <div className="rv-stars">{stars(t.rating)}</div>
                  <div className="rv-text">"{t.content}"</div>
                  <div className="rv-foot">
                    {t.author_avatar
                      ? <img className="rv-av" src={t.author_avatar} alt={t.author_name} />
                      : <div className="rv-av" style={{ background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--accent)' }}>{t.author_name[0]}</div>
                    }
                    <div>
                      <div className="rv-name">{t.author_name}</div>
                      <div className="rv-role">{t.author_title}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="wd-container reveal">
          <h2 className="cta-title">{settings.cta_title || 'Bắt đầu dự án của bạn'}</h2>
          <p className="cta-sub">{settings.cta_subtitle || 'Tư vấn miễn phí. Báo giá trong 24 giờ. Không ràng buộc.'}</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <Link to="/lien-he" className="btn-white">Liên hệ tư vấn →</Link>
            <Link to="/du-an" className="btn-outline-white">Xem portfolio</Link>
          </div>
        </div>
      </section>

      <RevealObserver />
    </>
  )
}
