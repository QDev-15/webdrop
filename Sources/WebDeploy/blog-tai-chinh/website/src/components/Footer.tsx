import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings, categories } = useSite()
  const zalo = (settings.social_zalo || '').replace(/\D/g, '')

  return (
    <>
      <footer className="btc-footer">
        <div className="wd-container">
          <div className="btc-footer-grid">
            <div>
              <div className="btc-footer-logo">
                <span className="btc-logo-mark">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/></svg>
                </span>
                {settings.nav_logo_prefix || 'La Bàn'} <span style={{ color: 'var(--accent-mid)' }}>{settings.nav_logo_accent || 'Tài Chính'}</span>
              </div>
              <p className="btc-footer-desc">{settings.footer_description}</p>
              <div className="btc-footer-social">
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>
                  </a>
                )}
                {settings.social_youtube && (
                  <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.6-.5-5.3c-.3-1-1-1.7-2-2C18.8 4.2 12 4.2 12 4.2s-6.8 0-8.5.5c-1 .3-1.7 1-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3c.3 1 1 1.7 2 2 1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5c1-.3 1.7-1 2-2 .5-1.7.5-5.3.5-5.3zM9.8 15.3V8.7l6 3.3-6 3.3z"/></svg>
                  </a>
                )}
                {settings.social_tiktok && (
                  <a href={settings.social_tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.1c-1-.9-1.6-2.1-1.6-3.5h-3.3v14.2c0 1.6-1.3 2.9-2.9 2.9s-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9c.3 0 .6 0 .9.1V9.6c-.3 0-.6-.1-.9-.1-3.4 0-6.2 2.8-6.2 6.2S6.4 22 9.8 22s6.2-2.8 6.2-6.2V8.9c1.3 1 3 1.5 4.7 1.5V7.1c-1.4 0-2.7-.5-3.7-1.4-.1-.2-.3-.4-.4-.6z"/></svg>
                  </a>
                )}
              </div>
            </div>
            <div>
              <div className="btc-footer-title">Chuyên mục</div>
              <div className="btc-footer-links">
                {categories.filter(c => c.slug !== 'tong-quan').map(c => (
                  <Link key={c.id} to={`/chuyen-muc?cat=${c.slug}`}>{c.name}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="btc-footer-title">Trang</div>
              <div className="btc-footer-links">
                <Link to="/">Trang chủ</Link>
                <Link to="/chuyen-muc">Chuyên mục</Link>
                <Link to="/cong-cu-tinh-toan">Công cụ tính toán</Link>
                <Link to="/ve-toi">Về tôi</Link>
                <Link to="/lien-he">Liên hệ</Link>
              </div>
            </div>
            <div>
              <div className="btc-footer-title">Liên hệ</div>
              <div className="btc-footer-links">
                {settings.site_email && <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a>}
                {settings.site_phone && <span>{settings.site_phone}</span>}
                {settings.site_address && <span>{settings.site_address}</span>}
              </div>
            </div>
          </div>
          {settings.map_embed && (
            <div className="btc-footer-maps">
              <iframe src={settings.map_embed} loading="lazy" title="Bản đồ vị trí La Bàn Tài Chính" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          )}
          <div className="btc-footer-bottom">
            <span>{settings.footer_copyright}</span>
            <div className="btc-footer-bottom-links">
              <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
            </div>
          </div>
        </div>
      </footer>
      {zalo && (
        <a href={`https://zalo.me/${zalo}`} className="btc-zalo-float" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">💬</a>
      )}
    </>
  )
}
