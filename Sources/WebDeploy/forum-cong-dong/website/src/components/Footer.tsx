import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Forum Cong Dong'
  const copyright = settings.footer_copyright || `© 2025 ${siteName}. Cong dong Viet Nam.`
  const desc = settings.footer_description || 'Cong dong danh cho nhung nguoi dam me cong nghe, thiet ke va kinh doanh tai Viet Nam.'
  const showSocial = settings.footer_show_social !== '0'

  return (
    <footer style={{ padding: 'clamp(36px,5vw,56px) 0 0' }}>
      <div className="wd-container">
        <div className="row g-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <div className="col-lg-4">
            <div className="ft-logo">{siteName}<span>.</span></div>
            <p className="ft-desc">{desc}</p>
            {showSocial && (
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noreferrer"
                    style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.5)', fontSize: 14, textDecoration: 'none' }}>f</a>
                )}
                {settings.social_youtube && (
                  <a href={settings.social_youtube} target="_blank" rel="noreferrer"
                    style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.5)', fontSize: 14, textDecoration: 'none' }}>▶</a>
                )}
              </div>
            )}
          </div>
          <div className="col-6 col-lg-2">
            <div className="ft-col-title">Danh muc</div>
            <div className="ft-links">
              <a href="/">Lap trinh</a>
              <a href="/">Design</a>
              <a href="/">Startup</a>
              <a href="/">Hoc tap</a>
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <div className="ft-col-title">Thong tin</div>
            <div className="ft-links">
              <a href="/">Ve dien dan</a>
              <a href="/">Quy tac</a>
              <a href="/contact">Lien he</a>
              <a href="/contact">Quang cao</a>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="ft-col-title">Tham gia cong dong</div>
            <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,.3)', lineHeight: 1.65, marginBottom: 14 }}>
              Dang ky tai khoan de tham gia thao luan va ket noi voi 12,000+ thanh vien.
            </p>
            <a href="/contact" style={{ display: 'inline-block', fontSize: 13, fontWeight: 500, background: 'var(--accent)', color: '#fff', padding: '9px 22px', borderRadius: 8, textDecoration: 'none' }}>
              Dang ky mien phi →
            </a>
          </div>
        </div>
      </div>
      <div className="ft-bottom py-3">
        <div className="wd-container">
          <p className="ft-copy">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
