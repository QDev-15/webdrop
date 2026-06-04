import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

export default function Footer() {
  const { settings } = useSite()
  const [email, setEmail]   = useState('')
  const [subMsg, setSubMsg] = useState('')

  const handleNewsletter = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/public/contact', { name: 'Newsletter', email, message: 'Đăng ký nhận tin' })
      setSubMsg('Cảm ơn bạn đã đăng ký!')
      setEmail('')
    } catch { setSubMsg('Đã có lỗi xảy ra') }
  }

  const showSocial = settings.footer_show_social === '1'

  return (
    <footer className="st-footer" role="contentinfo">
      <div className="wd-container">
        <div className="st-footer-grid">
          <div className="st-footer-brand">
            <Link to="/" className="st-logo">
              <span className="logo-dot" aria-hidden="true"></span>
              {settings.site_name}
            </Link>
            <p className="st-footer-tagline">{settings.footer_description || settings.site_tagline}</p>
            {showSocial && (
              <div className="st-social-row" aria-label="Mạng xã hội">
                {settings.social_facebook && <a href={settings.social_facebook} className="st-social-icon" aria-label="Facebook" rel="noopener noreferrer" target="_blank">f</a>}
                {settings.social_linkedin && <a href={settings.social_linkedin} className="st-social-icon" aria-label="LinkedIn" rel="noopener noreferrer" target="_blank">in</a>}
                {settings.social_twitter  && <a href={settings.social_twitter}  className="st-social-icon" aria-label="Twitter" rel="noopener noreferrer" target="_blank">𝕏</a>}
                {settings.social_youtube  && <a href={settings.social_youtube}  className="st-social-icon" aria-label="YouTube" rel="noopener noreferrer" target="_blank">▶</a>}
              </div>
            )}
          </div>

          <div>
            <div className="st-footer-col-title">Sản phẩm</div>
            <ul className="st-footer-links">
              <li><Link to="/san-pham">Tính năng</Link></li>
              <li><Link to="/bang-gia">Bảng giá</Link></li>
              <li><Link to="/lien-he">Demo</Link></li>
            </ul>
          </div>

          <div>
            <div className="st-footer-col-title">Công ty</div>
            <ul className="st-footer-links">
              <li><Link to="/">Về chúng tôi</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/bang-gia">Bảng giá</Link></li>
            </ul>
          </div>

          <div className="st-footer-newsletter">
            <div className="st-footer-col-title">Cập nhật mới nhất</div>
            <p className="st-newsletter-desc">Nhận thông báo về tính năng mới và mẹo sử dụng hàng tuần.</p>
            {subMsg ? (
              <p style={{ fontSize: 13, color: '#4ade80' }}>{subMsg}</p>
            ) : (
              <form className="st-newsletter-form" onSubmit={handleNewsletter}>
                <input type="email" className="st-newsletter-input" placeholder="Email của bạn" value={email} onChange={e => setEmail(e.target.value)} required />
                <button type="submit" className="st-newsletter-btn">Đăng ký</button>
              </form>
            )}
          </div>
        </div>

        <div className="st-footer-bottom">
          <span className="st-footer-copy">{settings.footer_copyright}</span>
          <nav className="st-footer-legal" aria-label="Pháp lý">
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Chính sách bảo mật</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
