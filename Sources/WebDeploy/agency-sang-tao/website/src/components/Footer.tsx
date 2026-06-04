import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'NOVA.'
  const logoText = siteName.replace('.', '')

  return (
    <footer className="ag-footer">
      <div className="wd-container">
        <div className="ag-footer-main">
          <div className="ag-footer-brand">
            <Link to="/" className="ag-footer-logo">{logoText}<span>.</span></Link>
            <p className="ag-footer-tagline">
              {settings.footer_description || 'Agency sáng tạo chuyên branding, thiết kế và digital marketing. Chúng tôi tạo ra những thương hiệu đáng nhớ.'}
            </p>
            <div className="ag-footer-social">
              {settings.social_facebook && (
                <a href={settings.social_facebook} className="ag-social-link" target="_blank" rel="noopener noreferrer">Facebook</a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} className="ag-social-link" target="_blank" rel="noopener noreferrer">Instagram</a>
              )}
              {settings.social_behance && (
                <a href={settings.social_behance} className="ag-social-link" target="_blank" rel="noopener noreferrer">Behance</a>
              )}
              {settings.social_linkedin && (
                <a href={settings.social_linkedin} className="ag-social-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              )}
              {!settings.social_facebook && !settings.social_instagram && !settings.social_behance && !settings.social_linkedin && (
                <>
                  <a href="#" className="ag-social-link">Facebook</a>
                  <a href="#" className="ag-social-link">Instagram</a>
                  <a href="#" className="ag-social-link">Behance</a>
                  <a href="#" className="ag-social-link">LinkedIn</a>
                </>
              )}
            </div>
          </div>

          <div className="ag-footer-col">
            <div className="ag-footer-col-title">Dịch vụ</div>
            <ul className="ag-footer-links">
              <li><Link to="/dich-vu">Brand Identity</Link></li>
              <li><Link to="/dich-vu">Digital Design</Link></li>
              <li><Link to="/dich-vu">Campaign</Link></li>
              <li><Link to="/dich-vu">Content Strategy</Link></li>
            </ul>
          </div>

          <div className="ag-footer-col">
            <div className="ag-footer-col-title">Công ty</div>
            <ul className="ag-footer-links">
              <li><Link to="/ve-chung-toi">Về chúng tôi</Link></li>
              <li><Link to="/du-an">Dự án</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>

          <div className="ag-footer-col">
            <div className="ag-footer-col-title">Liên hệ</div>
            <ul className="ag-footer-links">
              {settings.site_email && (
                <li><a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></li>
              )}
              {settings.site_phone && (
                <li><a href={`tel:${settings.site_phone.replace(/\s/g, '')}`}>{settings.site_phone}</a></li>
              )}
              {settings.site_address && (
                <li><a href="#">{settings.site_address}</a></li>
              )}
            </ul>
          </div>
        </div>

        <div className="ag-footer-bottom">
          <span className="ag-footer-copy">
            {settings.footer_copyright || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
          </span>
          <span className="ag-footer-made">Made with <span>&#9733;</span> in Vietnam</span>
        </div>
      </div>
    </footer>
  )
}
