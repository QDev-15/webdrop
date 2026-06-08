import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const siteName    = settings.site_name || 'Agency Sáng Tạo'
  const description = settings.footer_description || settings.site_description || 'Agency sáng tạo chuyên branding, thiết kế và digital marketing.'
  const copyright   = settings.footer_copyright || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`
  const email       = settings.site_email || ''
  const phone       = settings.site_phone || ''
  const address     = settings.site_address || ''
  const facebook    = settings.social_facebook || ''
  const instagram   = settings.social_instagram || ''
  const behance     = settings.social_behance || ''
  const linkedin    = settings.social_linkedin || ''

  return (
    <footer className="ag-footer">
      <div className="wd-container">
        <div className="ag-footer-main">
          <div className="ag-footer-brand">
            <Link to="/" className="ag-footer-logo">{siteName}<span>.</span></Link>
            <p className="ag-footer-tagline">{description}</p>
            <div className="ag-footer-social">
              {facebook && <a href={facebook} className="ag-social-link" target="_blank" rel="noopener noreferrer">Facebook</a>}
              {instagram && <a href={instagram} className="ag-social-link" target="_blank" rel="noopener noreferrer">Instagram</a>}
              {behance && <a href={behance} className="ag-social-link" target="_blank" rel="noopener noreferrer">Behance</a>}
              {linkedin && <a href={linkedin} className="ag-social-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>}
              {!facebook && !instagram && !behance && !linkedin && (
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
              {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
              {phone && <li><a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a></li>}
              {address && <li><span style={{ color: 'rgba(255,255,255,.45)' }}>{address}</span></li>}
            </ul>
          </div>
        </div>

        <div className="ag-footer-bottom">
          <span className="ag-footer-copy">{copyright}</span>
          <span className="ag-footer-made">Made with <span>&#9733;</span> in Vietnam</span>
        </div>
      </div>
    </footer>
  )
}
