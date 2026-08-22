import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const logoName = settings.nav_logo_name || 'KHOA'

  return (
    <footer className="ptk-footer">
      <div className="ptk-container">
        <div className="ptk-footer-brand" data-reveal>{logoName}<span>.</span>DESIGN</div>
        <div className="ptk-footer-cols">
          <div className="ptk-footer-col">
            <div className="ptk-footer-col-t">Studio</div>
            <p>{settings.footer_description}</p>
          </div>
          <div className="ptk-footer-col">
            <div className="ptk-footer-col-t">Điều hướng</div>
            <Link to="/">Trang chủ</Link>
            <Link to="/du-an">Dự án</Link>
            <Link to="/dich-vu">Dịch vụ</Link>
            <Link to="/ve-toi">Về tôi</Link>
          </div>
          <div className="ptk-footer-col">
            <div className="ptk-footer-col-t">Liên hệ</div>
            {settings.site_email && <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a>}
            {settings.site_phone && <a href={`tel:${settings.site_phone}`}>{settings.site_phone}</a>}
            {settings.footer_address && <p>{settings.footer_address}</p>}
          </div>
          <div className="ptk-footer-col">
            <div className="ptk-footer-col-t">Kết nối</div>
            <div className="ptk-footer-social">
              {settings.social_instagram && <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>}
              {settings.social_behance && <a href={settings.social_behance} target="_blank" rel="noopener noreferrer" aria-label="Behance">Be</a>}
              {settings.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">Fb</a>}
            </div>
          </div>
        </div>
        {settings.map_embed && (
          <div className="ptk-footer-maps" data-reveal>
            <iframe src={settings.map_embed} loading="lazy" title="Vị trí studio KHOA Design tại TP.HCM" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        )}
        <div className="ptk-footer-bottom">
          <span>{settings.footer_copyright}</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
