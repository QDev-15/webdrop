import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName = settings.site_name || 'Green Valley Residence'
  const footerDesc = settings.footer_description || ''
  const hotline = settings.site_phone || '1900 6868'
  const address = settings.site_address || ''
  const email = settings.site_email || ''
  const copyright = settings.footer_copyright || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`
  const lat = settings.contact_map_lat || '10.8046'
  const lng = settings.contact_map_lng || '106.7350'
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&hl=vi&z=15&output=embed`

  return (
    <footer className="gvr-footer" data-reveal>
      <div className="wd-container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="gvr-footer-brand">
              <span className="mark" style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--gradient-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>GV</span>
              {siteName}
            </div>
            <p className="gvr-footer-desc">{footerDesc}</p>
            <div className="gvr-footer-social" style={{ marginTop: 20 }}>
              {settings.social_facebook && <a href={settings.social_facebook} className="gvr-social-link" target="_blank" rel="noopener noreferrer">f</a>}
              {settings.social_linkedin && <a href={settings.social_linkedin} className="gvr-social-link" target="_blank" rel="noopener noreferrer">in</a>}
              {settings.social_youtube && <a href={settings.social_youtube} className="gvr-social-link" target="_blank" rel="noopener noreferrer">yt</a>}
            </div>
          </div>

          <div className="col-lg-2 col-6">
            <div className="gvr-footer-head">Dự án</div>
            <ul className="gvr-footer-links">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/ve-chu-dau-tu">Tổng quan dự án</Link></li>
              <li><Link to="/bang-gia">Bảng giá & Mặt bằng</Link></li>
              <li><Link to="/tien-ich">Tiện ích</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-6">
            <div className="gvr-footer-head">Chính sách</div>
            <ul className="gvr-footer-links">
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          <div className="col-lg-4">
            <div className="gvr-footer-head">Liên hệ nhanh</div>
            <div className="gvr-footer-hotline"><span>☎</span><b>{hotline}</b></div>
            <p className="gvr-footer-desc">{address}{address && email ? <br /> : null}{email}</p>
          </div>
        </div>

        <div className="gvr-footer-maps">
          <iframe src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Vị trí ${siteName}`}></iframe>
        </div>

        <div className="gvr-footer-bottom">
          <div className="gvr-footer-copy">{copyright}</div>
          <div className="gvr-footer-copy">Thiết kế bởi webdrop.store</div>
        </div>
      </div>
    </footer>
  )
}
