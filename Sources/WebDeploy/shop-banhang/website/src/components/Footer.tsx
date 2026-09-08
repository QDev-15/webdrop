import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  return (
    <footer style={{ background: 'var(--dark)', color: '#fff', padding: '2rem', textAlign: 'center', marginTop: '3rem' }}>
      <p style={{ marginBottom: '0.5rem' }}>{settings.footer_copyright || '© 2026 POS Bán hàng. All rights reserved.'}</p>
      <p style={{ margin: 0, fontSize: '0.85rem' }}>
        <Link to="/chinh-sach-bao-mat" style={{ color: 'rgba(255,255,255,.7)' }}>Chính sách bảo mật</Link>
        &nbsp;·&nbsp;
        <Link to="/dieu-khoan" style={{ color: 'rgba(255,255,255,.7)' }}>Điều khoản sử dụng</Link>
      </p>
    </footer>
  )
}
