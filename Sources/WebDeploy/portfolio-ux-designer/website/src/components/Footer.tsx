import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  return (
    <footer className="pux-footer" data-reveal>
      <div className="wd-container">
        <div className="row g-5">
          <div className="col-lg-4">
            <Link to="/" className="pux-footer-brand" style={{ color: '#fff' }}>
              <span className="dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gradient-1)', display: 'inline-block' }}></span>
              {settings.site_name || 'Đỗ Khánh Linh'}
            </Link>
            <p className="pux-footer-desc">{settings.footer_description}</p>
            <div className="pux-footer-social mt-4">
              {settings.social_linkedin && <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="pux-social-link">in</a>}
              {settings.social_behance && <a href={settings.social_behance} target="_blank" rel="noopener noreferrer" className="pux-social-link">be</a>}
              {settings.social_dribbble && <a href={settings.social_dribbble} target="_blank" rel="noopener noreferrer" className="pux-social-link">dr</a>}
              {settings.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="pux-social-link">fb</a>}
            </div>
          </div>
          <div className="col-lg-2 col-6">
            <div className="pux-footer-head">Điều hướng</div>
            <ul className="pux-footer-links">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/du-an">Dự án</Link></li>
              <li><Link to="/dich-vu">Dịch vụ</Link></li>
              <li><Link to="/ve-toi">Về tôi</Link></li>
            </ul>
          </div>
          <div className="col-lg-2 col-6">
            <div className="pux-footer-head">Pháp lý</div>
            <ul className="pux-footer-links">
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <div className="pux-footer-head">Liên hệ</div>
            <ul className="pux-footer-links">
              <li>{settings.site_email}</li>
              <li>{settings.site_phone}</li>
              <li>{settings.site_address}</li>
            </ul>
          </div>
        </div>
        {settings.map_embed && (
          <div className="pux-footer-maps">
            <iframe src={settings.map_embed} loading="lazy" title="Vị trí studio" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        )}
        <div className="pux-footer-bottom">
          <div className="pux-footer-copy">{settings.footer_copyright}</div>
          <div className="pux-footer-copy">{settings.footer_tagline}</div>
        </div>
      </div>
    </footer>
  )
}
