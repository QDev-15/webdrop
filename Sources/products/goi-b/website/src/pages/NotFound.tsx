import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function NotFound() {
  const { settings } = useSite()
  return (
    <div style={{ paddingTop: 62, minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="site-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 80, fontWeight: 700, color: 'var(--accent-light)', lineHeight: 1, marginBottom: 12 }}>404</div>
        <h1 style={{ fontSize: 'clamp(20px,3vw,32px)', fontWeight: 600, marginBottom: 12 }}>Trang không tìm thấy</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 15, marginBottom: 28 }}>
          Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link to="/" className="btn-hero-primary" style={{ display: 'inline-block' }}>
          ← Về trang chủ
        </Link>
        {settings.site_name && (
          <p style={{ marginTop: 24, fontSize: 13, color: 'var(--text-3)' }}>
            {settings.site_name}
          </p>
        )}
      </div>
    </div>
  )
}
