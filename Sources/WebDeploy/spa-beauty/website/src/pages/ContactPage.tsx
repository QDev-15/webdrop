import Contact from '../components/Contact'
import { useSite } from '../contexts/SiteContext'

export default function ContactPage() {
  const { settings: s } = useSite()
  const mapSrc = s.google_maps_embed || ''

  return (
    <main>
      {/* Page hero */}
      <section style={{ background: 'var(--dark2)', padding: 'clamp(40px,6vw,80px) 0', textAlign: 'center' }}>
        <div className="wd-container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#4ade80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
            <span style={{ width: 24, height: 1, background: '#4ade80', display: 'inline-block' }} />
            Liên hệ
          </div>
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 600, color: '#fff', marginBottom: 12, lineHeight: 1.25 }}>
            Kết nối với <em style={{ color: '#4ade80', fontStyle: 'italic' }}>chúng tôi</em>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', fontWeight: 300, maxWidth: 440, margin: '0 auto', lineHeight: 1.8 }}>
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn tìm ra dịch vụ phù hợp nhất.
          </p>
        </div>
      </section>

      {/* Contact form */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <Contact />
        </div>
      </section>

      {/* Google Maps */}
      {mapSrc && (
        <div style={{ width: '100%', height: 400, overflow: 'hidden' }}>
          <iframe
            src={mapSrc}
            width="100%" height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ Bella Spa"
          />
        </div>
      )}
    </main>
  )
}
