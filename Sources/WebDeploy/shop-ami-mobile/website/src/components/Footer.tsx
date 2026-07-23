import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

function splitLogo(siteName: string): [string, string] {
  const parts = siteName.trim().split(/\s+/)
  if (parts.length < 2) return [siteName || 'AMI', 'MOBILE']
  return [parts[0], parts.slice(1).join(' ')]
}

export default function Footer() {
  const { settings, categories } = useSite()
  const [logoPre, logoEm] = splitLogo(settings.site_name || 'AMI Mobile')
  const zaloNumber = settings.zalo_number || ''
  const phoneDigits = (settings.site_phone || '').replace(/\D/g, '')

  const socials = [
    { key: 'facebook', url: settings.facebook, label: 'Facebook', icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /> },
    { key: 'instagram', url: settings.instagram, label: 'Instagram', stroke: true },
    { key: 'youtube', url: settings.youtube, label: 'YouTube', stroke: true },
  ]

  return (
    <>
      <footer className="mb-footer">
        <div className="mb-container">
          <div className="mb-footer-grid">
            <div>
              <div className="mb-footer-logo">{logoPre}<em>{logoEm}</em></div>
              <p className="mb-footer-about">{settings.site_address ? `${settings.site_address} — ` : ''}{settings.footer_about || 'Chuyên cung cấp điện thoại, tai nghe và phụ kiện chính hãng.'}</p>
              <div className="mb-footer-socials">
                {socials.map(s => (
                  <a
                    key={s.key}
                    href={s.url || '#'}
                    className="mb-footer-social"
                    aria-label={s.label}
                    target={s.url ? '_blank' : undefined}
                    rel={s.url ? 'noopener noreferrer' : undefined}
                  >
                    {s.stroke ? (
                      s.key === 'instagram' ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
                      )
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
            <div className="mb-footer-col">
              <h4>Sản phẩm</h4>
              <ul>
                {categories.map(c => (
                  <li key={c.id}><Link to={`/san-pham?category=${c.slug}`}>{c.name}</Link></li>
                ))}
                <li><Link to="/san-pham?theme=giam-gia">Đang giảm giá</Link></li>
              </ul>
            </div>
            <div className="mb-footer-col">
              <h4>Hỗ trợ</h4>
              <ul>
                <li><Link to="/ve-chung-toi">Về chúng tôi</Link></li>
                <li><Link to="/lien-he">Liên hệ</Link></li>
                <li><Link to="/khuyen-mai">Khuyến mãi</Link></li>
                <li><Link to="/gio-hang">Giỏ hàng</Link></li>
              </ul>
            </div>
            <div className="mb-footer-col">
              <h4>Chính sách</h4>
              <ul>
                <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
                <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
              </ul>
              {settings.site_phone && (
                <div style={{ marginTop: 18 }}>
                  <div className="mb-label" style={{ marginBottom: 8 }}>Hotline</div>
                  <a href={`tel:${phoneDigits}`} style={{ color: 'var(--mustard)', fontWeight: 700, fontSize: 16 }}>{settings.site_phone}</a>
                </div>
              )}
            </div>
          </div>
          <div className="mb-footer-bottom">
            <p className="mb-footer-copy">&copy; {new Date().getFullYear()} {settings.site_name || 'AMI Mobile'}. Bảo lưu mọi quyền.</p>
            <div className="mb-footer-legal">
              <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link to="/dieu-khoan">Điều khoản</Link>
            </div>
          </div>
        </div>
      </footer>

      {zaloNumber && (
        <a href={`https://zalo.me/${zaloNumber}`} className="mb-zalo-float" target="_blank" rel="noopener noreferrer" aria-label="Chat qua Zalo">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="20" fill="#0068FF" />
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">Zalo</text>
          </svg>
        </a>
      )}
    </>
  )
}
