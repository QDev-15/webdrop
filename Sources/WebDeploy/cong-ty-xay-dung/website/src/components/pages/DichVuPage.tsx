import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  number: string
  description: string
  icon_svg: string
  image: string
  anchor_id: string
  featured: number
}

function useReveal() {
  useEffect(() => {
    const ro = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('[data-reveal]').forEach(el => ro.observe(el))
    return () => ro.disconnect()
  })
}

export default function DichVuPage() {
  const { settings } = useSite()
  const [services, setServices] = useState<Service[]>([])
  useReveal()

  useEffect(() => {
    api.get<Service[]>('/public/services').then(setServices).catch(() => {})
    window.scrollTo(0, 0)
  }, [])

  const siteName = settings.site_name || 'Công Ty'
  const phone    = settings.site_phone || ''

  const processSteps = [
    { num: '01', title: 'Tiếp nhận yêu cầu', body: 'Khách hàng liên hệ qua hotline hoặc form. Chúng tôi phản hồi trong 2 giờ làm việc, đặt lịch tư vấn trực tiếp.' },
    { num: '02', title: 'Khảo sát & Báo giá', body: 'Kỹ sư khảo sát thực địa. Lập dự toán chi tiết và báo giá minh bạch trong 24–48 giờ sau khảo sát.' },
    { num: '03', title: 'Ký hợp đồng & Thi công', body: 'Ký hợp đồng rõ ràng về phạm vi, tiến độ, chất lượng và thanh toán. Triển khai thi công đúng kế hoạch.' },
    { num: '04', title: 'Nghiệm thu & Bảo hành', body: 'Nghiệm thu từng hạng mục, bàn giao hồ sơ hoàn công. Bảo hành công trình theo hợp đồng.' },
  ]

  return (
    <main>
      <section className="xd-page-hero" aria-label="Dịch vụ xây dựng">
        <div className="xd-page-hero-bg" aria-hidden="true">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop" alt="" loading="eager" />
        </div>
        <div className="wd-container xd-page-hero-content">
          <div className="xd-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="xd-breadcrumb-sep" aria-hidden="true">/</span>
            <span className="xd-breadcrumb-current">Dịch vụ</span>
          </div>
          <div className="xd-ph-eyebrow">Lĩnh vực chuyên môn</div>
          <h1 className="xd-ph-title">Dịch vụ xây dựng<br /><span style={{ color: 'var(--accent)' }}>toàn diện</span></h1>
          <p className="xd-ph-sub">Từ tư vấn thiết kế đến thi công và bàn giao, chúng tôi là đối tác tin cậy cho mọi công trình.</p>
        </div>
      </section>

      {/* Services Detail */}
      {services.map((svc, i) => (
        <section
          key={svc.id}
          className="sec-pad"
          id={svc.anchor_id || `dv-${svc.id}`}
          style={i % 2 === 1 ? { background: 'var(--dark2)' } : {}}
        >
          <div className="wd-container">
            <div className={`row g-5 align-items-center ${i % 2 === 1 ? 'flex-md-row-reverse' : ''}`}>
              <div className="col-md-6" data-reveal>
                <div style={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                  <img
                    src={svc.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop'}
                    alt={svc.name}
                    style={{ width: '100%', height: 420, objectFit: 'cover', opacity: i % 2 === 1 ? 0.7 : 1 }}
                    loading="lazy"
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--accent)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" style={{ fill: 'rgba(255,255,255,.7)', flexShrink: 0 }} aria-hidden="true">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                      {siteName} — {svc.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6" data-reveal data-delay="1">
                <div className={i % 2 === 0 ? 'xd-sec-line' : ''}>
                  <span className="xd-tag-inline" style={{ marginBottom: 16, display: 'inline-block', ...(i % 2 === 1 ? { background: 'rgba(244,81,30,.15)', color: 'var(--accent)' } : {}) }}>
                    DV {svc.number || String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="xd-sec-title" style={i % 2 === 1 ? { color: '#fff' } : {}}>
                    {svc.name.split(' ').length > 2
                      ? <>{svc.name.split(' ').slice(0, 2).join(' ')}<br /><span style={{ color: 'var(--accent)' }}>{svc.name.split(' ').slice(2).join(' ')}</span></>
                      : <>{svc.name}</>
                    }
                  </h2>
                  <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.75, marginBottom: 28, maxWidth: 520, color: i % 2 === 1 ? 'rgba(255,255,255,.5)' : 'var(--text-2)' }}>
                    {svc.description}
                  </p>
                </div>
                <Link to="/lien-he" className="xd-btn-solid">Yêu cầu báo giá</Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Bảng giá tham khảo */}
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
            <div className="col-12 col-md-4" data-reveal>
              <div className="xd-pkg-card">
                <div className="xd-pkg-name">Gói Cơ Bản</div>
                <p className="xd-pkg-price">Từ <strong>Liên hệ</strong></p>
                <ul className="xd-pkg-list">
                  <li>Thi công phần thô (móng, cột, dầm, sàn, mái)</li>
                  <li>Xây tường, trát, láng nền cơ bản</li>
                  <li>Hệ thống điện âm tường đơn giản</li>
                  <li>Cấp thoát nước cơ bản</li>
                  <li>Bàn giao thô để khách tự hoàn thiện</li>
                </ul>
                <Link to="/lien-he" className="xd-btn-solid" style={{ display: 'block', textAlign: 'center' }}>Nhận báo giá</Link>
              </div>
            </div>

            <div className="col-12 col-md-4" data-reveal data-delay="1">
              <div className="xd-pkg-card hot">
                <div className="xd-pkg-label">Phổ biến nhất</div>
                <div className="xd-pkg-name">Gói Tiêu Chuẩn</div>
                <p className="xd-pkg-price">Từ <strong>Liên hệ</strong></p>
                <ul className="xd-pkg-list">
                  <li>Tất cả hạng mục gói Cơ Bản</li>
                  <li>Hoàn thiện sơn nước, ốp lát gạch tiêu chuẩn</li>
                  <li>Cửa nhôm kính, cửa nhựa lõi thép</li>
                  <li>Điện, nước đầy đủ theo tiêu chuẩn</li>
                  <li>Bàn giao hoàn thiện, dọn vào ở được</li>
                  <li>Bảo hành công trình 3 năm</li>
                </ul>
                <Link to="/lien-he" className="xd-btn-solid" style={{ display: 'block', textAlign: 'center' }}>Nhận báo giá</Link>
              </div>
            </div>

            <div className="col-12 col-md-4" data-reveal data-delay="2">
              <div className="xd-pkg-card">
                <div className="xd-pkg-name">Gói Cao Cấp</div>
                <p className="xd-pkg-price">Từ <strong>Liên hệ</strong></p>
                <ul className="xd-pkg-list">
                  <li>Tất cả hạng mục gói Tiêu Chuẩn</li>
                  <li>Vật liệu cao cấp: gạch nhập, sơn Dulux/Jotun</li>
                  <li>Cửa nhôm xingfa, cửa gỗ tự nhiên</li>
                  <li>Thiết kế nội thất theo yêu cầu</li>
                  <li>Smart home cơ bản: đèn, điều hòa, camera</li>
                  <li>Bảo hành công trình 5 năm + bảo trì định kỳ</li>
                </ul>
                <Link to="/lien-he" className="xd-btn-solid" style={{ display: 'block', textAlign: 'center' }}>Nhận báo giá</Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-4" data-reveal>
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
              * Giá trên là tham khảo, chưa bao gồm VAT và chi phí thiết kế. Báo giá chính thức sau khi khảo sát thực tế.
            </p>
          </div>
        </div>
      </section>

      {/* Quy trình */}
      <section className="sec-pad" style={{ background: 'var(--dark)' }} aria-labelledby="process-title">
        <div className="wd-container">
          <div className="text-center mb-5">
            <div className="xd-eyebrow" style={{ color: 'var(--accent-mid)' }} data-reveal>Quy trình hợp tác</div>
            <h2 className="xd-sec-title" id="process-title" data-reveal data-delay="1" style={{ color: '#fff' }}>
              Từ ký hợp đồng<br />đến <span style={{ color: 'var(--accent)' }}>bàn giao</span>
            </h2>
          </div>
          <div className="row g-4">
            {processSteps.map((step, i) => (
              <div className="col-12 col-md-6 col-lg-3" data-reveal data-delay={String(i)} key={step.num}>
                <div style={{ textAlign: 'center', padding: '32px 24px', border: `1px solid ${i === 2 ? 'var(--accent)' : 'rgba(255,255,255,.07)'}`, borderRadius: 2, height: '100%' }}>
                  <div style={{ width: 52, height: 52, background: 'var(--accent)', borderRadius: 2, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{parseInt(step.num)}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '-.3px' }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--accent)', padding: '56px 0' }}>
        <div className="wd-container">
          <div className="row align-items-center gy-4">
            <div className="col-md-8" data-reveal>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Bắt đầu ngay hôm nay</div>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: '#fff', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>
                Liên hệ để nhận tư vấn<br />và báo giá miễn phí.
              </h2>
            </div>
            <div className="col-md-4 text-md-end d-flex gap-3 justify-content-md-end flex-wrap" data-reveal data-delay="1">
              <Link to="/lien-he" style={{ display: 'inline-block', background: '#fff', color: 'var(--accent)', padding: '14px 28px', borderRadius: 2, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Báo giá ngay</Link>
              {phone && (
                <a href={`tel:${phone}`} style={{ display: 'inline-block', background: 'transparent', color: '#fff', padding: '14px 28px', borderRadius: 2, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', border: '2px solid rgba(255,255,255,.4)' }}>{phone}</a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
