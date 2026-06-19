import { NavLink } from 'react-router-dom'
import { useSite } from '../App'

export default function Footer() {
  const { settings } = useSite()
  const name = settings.site_name ?? 'La Douceur Patisserie'
  const year = new Date().getFullYear()

  const socials: { key: string; icon: string; label: string }[] = [
    { key: 'social_facebook', icon: 'f', label: 'Facebook' },
    { key: 'social_instagram', icon: '◉', label: 'Instagram' },
    { key: 'social_tiktok', icon: '♪', label: 'TikTok' },
    { key: 'social_youtube', icon: '▷', label: 'YouTube' },
    { key: 'social_zalo', icon: 'Z', label: 'Zalo' },
  ]

  return (
    <footer>
      <div className="wd-container">
        <div className="row g-5 py-5">
          <div className="col-lg-4">
            <div className="ft-logo">✦ <span>{name}</span></div>
            <p className="ft-desc">
              {settings.footer_description ?? 'Tiệm bánh thủ công cao cấp tại TP.HCM. Mỗi chiếc bánh là một tác phẩm làm từ tình yêu.'}
            </p>
            <div className="ft-socials">
              {socials.map(s => {
                const href = settings[s.key as keyof typeof settings] as string
                if (!href) return null
                return (
                  <a key={s.key} href={href} className="ft-soc" target="_blank" rel="noopener noreferrer" title={s.label}>
                    {s.icon}
                  </a>
                )
              })}
            </div>
          </div>

          <div className="col-lg-2 col-6">
            <div className="ft-col-title">Điều hướng</div>
            <nav className="ft-links">
              <NavLink to="/">Trang chủ</NavLink>
              <NavLink to="/san-pham">Sản phẩm</NavLink>
              <NavLink to="/dat-hang">Đặt bánh</NavLink>
              <NavLink to="/lien-he">Liên hệ</NavLink>
            </nav>
          </div>

          <div className="col-lg-3 col-6">
            <div className="ft-col-title">Sản phẩm</div>
            <div className="ft-links">
              <span>Bánh kem sinh nhật</span>
              <span>Macaron Pháp</span>
              <span>Croissant & Pastry</span>
              <span>Tart & Muffin</span>
              <span>Bánh kem đặc biệt</span>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="ft-col-title">Liên hệ</div>
            <div className="ft-links">
              {settings.site_address && <span>📍 {settings.site_address}</span>}
              {settings.site_phone && <a href={`tel:${settings.site_phone}`}>📞 {settings.site_phone}</a>}
              {settings.site_email && <a href={`mailto:${settings.site_email}`}>✉ {settings.site_email}</a>}
              {settings.working_hours && <span>🕐 {settings.working_hours}</span>}
            </div>
          </div>
        </div>

        <div className="ft-bottom py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="ft-copy">
            {settings.footer_copyright ?? `© ${year} ${name}. All rights reserved.`}
          </span>
          <span className="ft-copy">Powered by webdrop.vn</span>
        </div>
      </div>
    </footer>
  )
}
