import { useEffect } from 'react'
import Reservation from '../components/Reservation'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Liên Hệ & Đặt Bàn — ${settings.site_name || 'Lá Xanh Chay Organic'}`,
    description: 'Đặt bàn tại nhà hàng chay organic — thông tin địa chỉ, số điện thoại, giờ mở cửa và form đặt bàn nhanh.',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [settings])

  const phone   = (settings.site_phone) || '0901 234 567'
  const address = (settings.site_address) || '123 Đường Lá Xanh, Quận 3, TP.HCM'
  const email   = (settings.site_email) || 'info@laxanhchay.vn'
  const mapEmbed = (settings.google_map_embed) || ''

  return (
    <main>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Liên hệ</div>
          <h1 className="ph-title">Đặt bàn & <em>Ghé thăm</em></h1>
          <p className="ph-sub">Hãy để chúng tôi chuẩn bị một bữa ăn chay ấm cúng và đầy dinh dưỡng cho bạn.</p>
        </div>
      </div>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-7 reveal">
              <Reservation />
            </div>
            <div className="col-lg-5 reveal reveal-d1">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '18px' }}>Thông tin liên hệ</div>
                {[
                  { icon: '📍', label: 'Địa chỉ', value: address },
                  { icon: '📱', label: 'Điện thoại', value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
                  { icon: '✉️', label: 'Email', value: email, href: `mailto:${email}` },
                  { icon: '🕐', label: 'Giờ mở cửa', value: 'Thứ 2 – Thứ 6: 10:00 – 21:00\nThứ 7 – CN: 9:00 – 21:30' },
                ].map(item => (
                  <div key={item.label} className="info-item">
                    <div className="info-icon">{item.icon}</div>
                    <div>
                      <div className="info-label">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="info-val" style={{ color: 'var(--accent)' }}>{item.value}</a>
                      ) : (
                        <div className="info-val" style={{ whiteSpace: 'pre-line' }}>{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--accent-light)', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px', marginTop: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>🌱 Lưu ý khi đặt bàn</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-2)', fontWeight: 300 }}>
                  <li>✓ Menu thực đơn thay đổi theo mùa và theo nguyên liệu có sẵn</li>
                  <li>✓ Vui lòng thông báo dị ứng thực phẩm khi đặt bàn</li>
                  <li>✓ Đặt bàn nhóm 7+ người: liên hệ trực tiếp</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      {mapEmbed && (
        <section style={{ background: 'var(--warm)', paddingBottom: '0' }}>
          <div style={{ width: '100%', height: '380px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: mapEmbed }} />
        </section>
      )}
    </main>
  )
}
