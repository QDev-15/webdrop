import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

interface PricingPlan {
  id: number; name: string; price: string; description: string; features: string
  is_featured: number; cta_text: string; cta_link: string
}
interface Faq { id: number; question: string; answer: string }

function parseFeatures(raw: string): string[] {
  return (raw || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
}

export default function ServicePage() {
  const { settings, services } = useSite()
  const [pricing, setPricing] = useState<PricingPlan[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])

  useDocumentMeta({
    title: 'Dịch vụ — Công Ty Xây Dựng Hoàng Gia',
    description: 'Các dịch vụ xây dựng của Công Ty Xây Dựng Hoàng Gia: thi công dân dụng, công nghiệp, thiết kế kiến trúc, tư vấn dự án, cải tạo sửa chữa.',
  })

  useEffect(() => {
    api.get<PricingPlan[]>('/public/pricing-plans').then(setPricing).catch(console.error)
    api.get<Faq[]>('/public/faqs?page=dich-vu').then(setFaqs).catch(console.error)
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
  }, [services, pricing, faqs])

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

      {/* BẢNG GIÁ DỊCH VỤ */}
      <section className="sec-pad" aria-labelledby="price-title">
        <div className="wd-container">
          <div className="text-center mb-5">
            <div className="xd-eyebrow" data-reveal>Gói dịch vụ</div>
            <h2 className="xd-sec-title" id="price-title" data-reveal data-delay="1">
              Chi phí <span className="xd-accent">tham khảo</span>
            </h2>
            <p className="xd-sec-sub mx-auto" data-reveal data-delay="2">
              Giá xây dựng phụ thuộc vào vật liệu, quy mô và khu vực. Liên hệ nhận báo giá chính xác miễn phí.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {pricing.map((pc, i) => (
              <div key={pc.id} className="col-12 col-md-4" data-reveal data-delay={(i % 3).toString()}>
                <div className={`xd-pkg-card${pc.is_featured ? ' hot' : ''}`}>
                  {pc.is_featured === 1 && <div className="xd-pkg-label">Phổ biến nhất</div>}
                  <div className="xd-pkg-name">{pc.name}</div>
                  <p className="xd-pkg-price"><strong>{pc.price}</strong></p>
                  {pc.description && <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: -16, marginBottom: 20 }}>{pc.description}</p>}
                  <ul className="xd-pkg-list">
                    {parseFeatures(pc.features).map(item => <li key={item}>{item}</li>)}
                  </ul>
                  <Link to={pc.cta_link || '/lien-he'} className="xd-btn-solid" style={{ display: 'block', textAlign: 'center' }}>
                    {pc.cta_text || 'Nhận báo giá'}
                  </Link>
                </div>
              </div>
            ))}
            {pricing.length === 0 && (
              <div className="text-center" style={{ padding: 48, color: 'var(--text-3)', width: '100%' }}>Đang tải bảng giá...</div>
            )}
          </div>

          <div className="text-center mt-4" data-reveal>
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
              * Giá trên là tham khảo, chưa bao gồm VAT và chi phí thiết kế. Báo giá chính thức sau khi khảo sát thực tế.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ — Accordion thật (details/summary, không cần JS) */}
      {faqs.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--bg)' }} id="faq" aria-labelledby="faq-title">
          <div className="wd-container">
            <div className="row g-5">
              <div className="col-lg-4" data-reveal>
                <div className="xd-eyebrow">Câu hỏi thường gặp</div>
                <h2 className="xd-sec-title" id="faq-title">Giải đáp<br /><span className="xd-accent">thắc mắc</span></h2>
                <p className="xd-sec-sub" style={{ marginTop: 8 }}>
                  Không tìm thấy câu trả lời bạn cần? <Link to="/lien-he" style={{ color: 'var(--accent)', fontWeight: 600 }}>Liên hệ trực tiếp</Link> — đội ngũ kỹ sư của chúng tôi luôn sẵn sàng tư vấn.
                </p>
              </div>
              <div className="col-lg-8" data-reveal data-delay="1">
                {faqs.map(f => (
                  <details className="xd-faq-item" key={f.id}>
                    <summary>{f.question} <span className="xd-faq-icon">+</span></summary>
                    <p className="xd-faq-a">{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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
