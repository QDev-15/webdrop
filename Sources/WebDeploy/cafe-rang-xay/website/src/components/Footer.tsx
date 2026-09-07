import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const brandName = settings.site_name || 'Mộc Rang'
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <footer className="crx-footer" data-reveal>
      <div className="crx-container">
        <div className="crx-footer-main">
          <div>
            <div className="crx-footer-logo">🔥 {brandName} <span>Roastery</span></div>
            <p className="crx-footer-tagline">{settings.footer_description || ''}</p>
            <div className="crx-footer-social">
              <a href={settings.facebook || '#'} className="crx-social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">f</a>
              <a href={settings.instagram || '#'} className="crx-social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">ig</a>
              <a href={settings.tiktok || '#'} className="crx-social-link" aria-label="TikTok" target="_blank" rel="noopener noreferrer">tt</a>
            </div>
          </div>
          <div>
            <div className="crx-footer-col-title">Trang</div>
            <ul className="crx-footer-links">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/thuc-don">Thực đơn</Link></li>
              <li><Link to="/khong-gian">Không gian</Link></li>
              <li><Link to="/gioi-thieu">Giới thiệu</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <div className="crx-footer-col-title">Chính sách</div>
            <ul className="crx-footer-links">
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
              <li><Link to="/lien-he">Đặt sỉ / Bán buôn</Link></li>
            </ul>
          </div>
          <div>
            <div className="crx-footer-col-title">Nhận tin mẻ rang mới</div>
            <p style={{ fontSize: 13, fontWeight: 300, marginBottom: 14 }}>Đăng ký để nhận thông báo mẻ rang mới mỗi tuần.</p>
            <form className="crx-footer-newsletter" onSubmit={handleNewsletter}>
              <input type="email" placeholder="Email của bạn" aria-label="Email" required value={email} onChange={e => setEmail(e.target.value)} />
              <button type="submit">{sent ? '✓' : 'Gửi'}</button>
            </form>
          </div>
        </div>
        {settings.map_embed && (
          <div className="crx-footer-maps">
            <iframe src={settings.map_embed} loading="lazy" title="Bản đồ vị trí xưởng rang" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        )}
        <div className="crx-footer-bottom">
          <div>{settings.footer_copyright || ''}</div>
          <div>Thiết kế bởi webdrop.store</div>
        </div>
      </div>
    </footer>
  )
}
