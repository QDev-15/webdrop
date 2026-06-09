import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'

export default function ServicePage() {
  const { settings, services } = useSite()

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

  const displayServices = services.length > 0 ? services : [
    { id: 1, name: 'Thi Công Dân Dụng', description: 'Xây dựng nhà ở, biệt thự, chung cư, văn phòng. Thi công trọn gói từ móng đến hoàn thiện nội thất.', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80' },
    { id: 2, name: 'Thi Công Công Nghiệp', description: 'Xây dựng nhà xưởng, kho bãi, khu công nghiệp.', image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80' },
    { id: 3, name: 'Thiết Kế Kiến Trúc', description: 'Tư vấn và thiết kế kiến trúc, kết cấu, nội thất.', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80' },
    { id: 4, name: 'Tư Vấn Dự Án', description: 'Tư vấn lập dự án đầu tư, thẩm tra thiết kế, giám sát thi công.', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80' },
    { id: 5, name: 'Cải Tạo & Sửa Chữa', description: 'Cải tạo và nâng cấp công trình cũ, sửa chữa dân dụng và công nghiệp.', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80' },
  ]

  return (
    <>
      {/* Page Hero */}
      <div className="xd-page-hero">
        <div className="xd-page-hero-bg">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop" alt="" />
        </div>
        <div className="wd-container">
          <div className="xd-page-hero-content">
            <div className="xd-breadcrumb">
              <Link to="/" className="xd-breadcrumb-a" style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Trang chủ</Link>
              <span className="xd-breadcrumb-sep" style={{ fontSize: 12, color: 'rgba(255,255,255,.2)' }}>/</span>
              <span className="xd-breadcrumb-current" style={{ fontSize: 12, color: 'var(--accent)' }}>Dịch vụ</span>
            </div>
            <div className="xd-ph-eyebrow">Lĩnh vực chuyên môn</div>
            <h1 className="xd-ph-title">Dịch vụ xây dựng<br /><span style={{ color: 'var(--accent)' }}>toàn diện</span></h1>
            <p className="xd-ph-sub">Từ thiết kế đến thi công và bàn giao, chúng tôi cung cấp giải pháp xây dựng đồng bộ.</p>
          </div>
        </div>
      </div>

      {/* Danh sách dịch vụ */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="row g-4">
            {displayServices.map((svc, i) => (
              <div key={svc.id} className="col-12 col-md-6 col-lg-3" data-reveal data-delay={(i % 4).toString()}>
                <div className="xd-service-card">
                  <div className="xd-svc-icon-wrap">
                    <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.8" fill="none" /></svg>
                  </div>
                  <span className="xd-svc-num">0{i + 1}</span>
                  <h3 className="xd-svc-title">{svc.name}</h3>
                  <p className="xd-svc-body">{svc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--warm)', padding: 'clamp(48px,6vw,80px) 0' }}>
        <div className="wd-container text-center">
          <h2 className="xd-sec-title mb-3" data-reveal>Cần tư vấn dịch vụ?</h2>
          <p className="xd-sec-sub mx-auto mb-4" data-reveal data-delay="1">
            Liên hệ với chúng tôi để được tư vấn miễn phí và nhận báo giá chi tiết.
          </p>
          <Link to="/lien-he" className="xd-btn-solid" data-reveal data-delay="2">
            Nhận báo giá ngay
          </Link>
        </div>
      </section>

      {settings['social_zalo'] && (
        <a href={`https://zalo.me/${settings['social_zalo']}`} className="zalo-float" target="_blank" rel="noopener noreferrer">
          <div className="zalo-float-pulse" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" width="30" height="30" />
        </a>
      )}
    </>
  )
}
