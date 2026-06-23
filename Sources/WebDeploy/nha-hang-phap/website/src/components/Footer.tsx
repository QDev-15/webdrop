import { useSite } from '../App'

export default function Footer() {
  const { settings } = useSite()

  const siteName = settings['site_name'] || 'Le Bistro'
  const tagline  = settings['footer_tagline'] || 'Nghệ thuật ẩm thực Pháp — mỗi buổi tối là một kỷ niệm.'
  const copyright = settings['footer_copyright'] || `© ${new Date().getFullYear()} Le Bistro Français · La cuisine française au Việt Nam`
  const phone    = settings['site_phone'] || '0901 234 567'
  const address  = settings['site_address'] || ''
  const hours    = 'Thứ Ba – CN · 18:00 – 22:30'
  const email    = settings['site_email'] || ''
  const fb       = settings['facebook'] || '#'
  const ig       = settings['instagram'] || '#'
  const zalo     = settings['zalo'] || '#'

  return (
    <footer>
      <div className="wd-container">
        <div className="row g-4 py-5">
          <div className="col-md-4 reveal">
            <div className="ft-logo">{siteName} <span>Bistro</span></div>
            <p className="ft-desc">{tagline}</p>
            <div className="ft-socials">
              {fb && fb !== '#' && <a href={fb} className="ft-soc" aria-label="Facebook" target="_blank" rel="noopener noreferrer">fb</a>}
              {ig && ig !== '#' && <a href={ig} className="ft-soc" aria-label="Instagram" target="_blank" rel="noopener noreferrer">ig</a>}
              {zalo && zalo !== '#' && <a href={zalo} className="ft-soc" aria-label="Zalo" target="_blank" rel="noopener noreferrer">zl</a>}
            </div>
          </div>
          <div className="col reveal reveal-d1">
            <div className="ft-col-title">Menu</div>
            <div className="ft-links">
              <a href="/menu">Entrées · Khai vị</a>
              <a href="/menu">Plats · Món chính</a>
              <a href="/menu">Desserts · Tráng miệng</a>
              <a href="/menu">Vins · Rượu vang</a>
            </div>
          </div>
          <div className="col reveal reveal-d2">
            <div className="ft-col-title">Le Restaurant</div>
            <div className="ft-links">
              <a href="/reservation">Réservation</a>
              <a href="/lien-he">Contact</a>
            </div>
          </div>
          <div className="col reveal reveal-d3">
            <div className="ft-col-title">Contact</div>
            <div className="ft-links">
              {phone && <a href={`tel:${phone.replace(/\s/g,'')}`}>📱 {phone}</a>}
              {address && <a href="#">📍 {address}</a>}
              <a href="#">🕐 {hours}</a>
              {email && <a href={`mailto:${email}`}>✉️ {email}</a>}
            </div>
          </div>
        </div>
      </div>
      <div className="ft-bottom">
        <div className="wd-container">
          <div className="d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
            <div className="ft-copy">{copyright}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
