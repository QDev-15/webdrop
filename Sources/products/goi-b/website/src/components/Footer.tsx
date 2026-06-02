import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings, navPages } = useSite()
  const year    = new Date().getFullYear()
  const s       = settings
  const socials = [
    { key: 'social_facebook',  label: 'f',  icon: '𝕗' },
    { key: 'social_youtube',   label: 'yt', icon: '▶' },
    { key: 'social_instagram', label: 'ig', icon: '◎' },
    { key: 'social_tiktok',    label: 'tt', icon: '♪' },
    { key: 'social_zalo',      label: 'zl', icon: 'Z' },
  ].filter(x => !!s[x.key])

  const siteName = s.site_name || 'Website'

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="footer-logo">
              {siteName.includes(' ')
                ? <>{siteName.split(' ')[0]}<span> {siteName.split(' ').slice(1).join(' ')}</span></>
                : siteName
              }
            </div>
            {s.site_description && (
              <p className="footer-desc">{s.site_description}</p>
            )}
            {socials.length > 0 && (
              <div className="footer-social">
                {socials.map(x => (
                  <a key={x.key} href={s[x.key]} target="_blank" rel="noopener noreferrer" title={x.label}>
                    {x.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="col-6 col-md-3 offset-md-1">
            <div className="footer-heading">Trang</div>
            <Link to="/" className="footer-link">Trang chủ</Link>
            <Link to="/blog" className="footer-link">Tin tức</Link>
            {navPages.slice(0, 5).map(p => (
              <Link key={p.id} to={`/${p.slug}`} className="footer-link">{p.title}</Link>
            ))}
            <Link to="/lien-he" className="footer-link">Liên hệ</Link>
          </div>

          <div className="col-6 col-md-4">
            <div className="footer-heading">Liên hệ</div>
            {s.site_address && <div className="footer-link">📍 {s.site_address}</div>}
            {s.site_phone   && <a href={`tel:${s.site_phone}`} className="footer-link">📞 {s.site_phone}</a>}
            {s.site_email   && <a href={`mailto:${s.site_email}`} className="footer-link">✉ {s.site_email}</a>}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {siteName}. Bảo lưu mọi quyền.</span>
          {s.footer_copyright && <span>{s.footer_copyright}</span>}
        </div>
      </div>
    </footer>
  )
}
