import { useEffect } from 'react'
import { useSite } from '../contexts/SiteContext'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  const { settings } = useSite()
  const s = settings

  useEffect(() => {
    document.title = `Liên hệ — ${s.site_name || 'Website'}`
  }, [s.site_name])

  return (
    <div style={{ paddingTop: 62 }}>
      <div style={{ background: 'var(--dark2)', padding: 'clamp(40px,6vw,70px) 0 clamp(30px,4vw,50px)', textAlign: 'center' }}>
        <div className="site-container">
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>Liên hệ</div>
          <h1 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: '#fff', letterSpacing: '-1px', lineHeight: 1.15, margin: 0 }}>
            Chúng tôi <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>luôn lắng nghe</em>
          </h1>
        </div>
      </div>

      <section className="site-section bg-surface">
        <div className="site-container">
          <div className="row g-4 justify-content-center">
            {/* Contact info */}
            {(s.site_address || s.site_phone || s.site_email) && (
              <div className="col-md-4">
                <div style={{ padding: '24px', background: 'var(--warm)', borderRadius: 14 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Thông tin liên hệ</h3>
                  {s.site_address && (
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>📍</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>Địa chỉ</div>
                        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{s.site_address}</div>
                      </div>
                    </div>
                  )}
                  {s.site_phone && (
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>📞</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>Điện thoại</div>
                        <a href={`tel:${s.site_phone}`} style={{ fontSize: 13.5, color: 'var(--accent)', textDecoration: 'none' }}>{s.site_phone}</a>
                      </div>
                    </div>
                  )}
                  {s.site_email && (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>✉</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>Email</div>
                        <a href={`mailto:${s.site_email}`} style={{ fontSize: 13.5, color: 'var(--accent)', textDecoration: 'none' }}>{s.site_email}</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Form */}
            <div className={s.site_address || s.site_phone || s.site_email ? 'col-md-7' : 'col-md-8'}>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
