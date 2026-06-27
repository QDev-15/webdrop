import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Settings {
  site_name?: string
  site_phone?: string
  site_email?: string
  site_address?: string
  working_hours?: string
  footer_desc?: string
  social_facebook?: string
  social_instagram?: string
  social_youtube?: string
  social_zalo?: string
  [key: string]: string | undefined
}

const SERVICE_LINKS = [
  { to: '/dich-vu', label: 'Chăm sóc toàn thân' },
  { to: '/dich-vu', label: 'Chăm sóc da mặt' },
  { to: '/dich-vu', label: 'Detox & Wellness' },
  { to: '/dich-vu', label: 'Gói nghỉ dưỡng' },
  { to: '/dich-vu', label: 'Gói đôi lãng mạn' },
]

const SPACE_LINKS = [
  { to: '/dich-vu', label: 'Hồ bơi vô cực' },
  { to: '/dich-vu', label: 'Sauna đá muối' },
  { to: '/dich-vu', label: 'Steam Room' },
  { to: '/dich-vu', label: 'Garden Lounge' },
  { to: '/dich-vu', label: 'Phòng liệu trình VIP' },
]

export default function Footer() {
  const [settings, setSettings] = useState<Settings>({})

  useEffect(() => {
    api.get<Settings>('/public/settings')
      .then(setSettings)
      .catch(() => {})
  }, [])

  const siteName    = settings.site_name    || 'Luxury Spa Resort'
  const phone       = settings.site_phone   || '0901 234 567'
  const email       = settings.site_email   || 'info@luxuryspa.vn'
  const address     = settings.site_address || '123 Đường Resort, Quận 2, TP.HCM'
  const hours       = settings.working_hours || 'Thứ 2 – Chủ nhật: 7:00 – 22:00'
  const desc        = settings.footer_desc   || 'Resort Spa 5 sao — nơi thư giãn đỉnh cao giữa thiên nhiên tĩnh lặng.'
  const facebook    = settings.social_facebook
  const instagram   = settings.social_instagram
  const youtube     = settings.social_youtube
  const zaloNum     = settings.social_zalo

  const year = new Date().getFullYear()

  return (
    <footer className="sl-footer">
      <div className="sl-container">
        <div className="sl-footer-grid">
          {/* Brand column */}
          <div>
            <Link to="/" className="sl-footer-logo">
              <span className="sl-footer-logo-dot" />
              {siteName}
            </Link>
            <p className="sl-footer-desc">{desc}</p>

            {/* Social icons */}
            <div className="sl-social-links">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="sl-social-link" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="sl-social-link" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
                </a>
              )}
              {youtube && (
                <a href={youtube} target="_blank" rel="noopener noreferrer" className="sl-social-link" aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--dark)"/></svg>
                </a>
              )}
              {zaloNum && (
                <a href={`https://zalo.me/${zaloNum}`} target="_blank" rel="noopener noreferrer" className="sl-social-link" aria-label="Zalo">
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0068FF', lineHeight: 1 }}>Zalo</span>
                </a>
              )}
            </div>
          </div>

          {/* Dịch vụ */}
          <div>
            <p className="sl-footer-col-title">Dịch vụ</p>
            <ul className="sl-footer-links">
              {SERVICE_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Không gian */}
          <div>
            <p className="sl-footer-col-title">Không gian</p>
            <ul className="sl-footer-links">
              {SPACE_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <p className="sl-footer-col-title">Thông tin liên hệ</p>

            <div className="sl-footer-contact-item">
              <span className="sl-footer-contact-icon">📍</span>
              <span>{address}</span>
            </div>

            <div className="sl-footer-contact-item">
              <span className="sl-footer-contact-icon">📞</span>
              <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'var(--text-3)', transition: 'color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                {phone}
              </a>
            </div>

            <div className="sl-footer-contact-item">
              <span className="sl-footer-contact-icon">✉️</span>
              <a href={`mailto:${email}`} style={{ color: 'var(--text-3)', transition: 'color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                {email}
              </a>
            </div>

            <div className="sl-footer-contact-item">
              <span className="sl-footer-contact-icon">🕐</span>
              <span>{hours}</span>
            </div>
          </div>
        </div>

        <div className="sl-footer-bottom">
          <p className="sl-footer-copy">
            © {year} {siteName}. Bảo lưu mọi quyền.
          </p>
          <p className="sl-footer-tagline">Resort Spa 5 Sao — Thư giãn đỉnh cao</p>
        </div>
      </div>
    </footer>
  )
}
