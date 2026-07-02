import { Link } from 'react-router-dom'
import { ServicesTable } from '../components/Services'

export default function ServicesPage() {
  return (
    <main>
      {/* Page hero */}
      <section style={{ background: 'var(--dark2)', padding: 'clamp(56px,8vw,96px) 0', textAlign: 'center' }}>
        <div className="wd-container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#4ade80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
            <span style={{ width: 24, height: 1, background: '#4ade80', display: 'inline-block' }} />
            Dịch vụ của chúng tôi
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 600, color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>
            Trải nghiệm <em style={{ color: '#4ade80', fontStyle: 'italic' }}>đỉnh cao</em> thư giãn
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', fontWeight: 300, maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
            Danh mục dịch vụ đầy đủ với bảng giá minh bạch. Đặt lịch để được phục vụ tốt nhất.
          </p>
        </div>
      </section>

      {/* Services content */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <ServicesTable />

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <p style={{ fontSize: 14, color: 'var(--text-3)', fontWeight: 300, marginBottom: 16 }}>
              Không tìm thấy dịch vụ phù hợp? Hãy liên hệ để được tư vấn miễn phí.
            </p>
            <Link to="/dat-lich" className="sb-btn-accent" style={{ marginRight: 12 }}>Đặt lịch ngay →</Link>
            <Link to="/lien-he" className="sb-btn-ghost">Tư vấn miễn phí</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
