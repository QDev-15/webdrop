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
  footer_copyright?: string
  facebook?: string
  instagram?: string
  zalo?: string
}

export default function Footer() {
  const [s, setS] = useState<Settings>({})

  useEffect(() => {
    api.get<Settings>('/public/settings').then(setS).catch(() => {})
  }, [])

  const siteName = s.site_name || 'Nha Khoa An Tâm'
  const desc = s.footer_desc || 'Phòng khám nha khoa tổng quát với không gian tối giản, yên tĩnh — nơi mọi lo âu được lắng nghe trước khi điều trị.'
  const copyright = s.footer_copyright || `© ${new Date().getFullYear()} ${siteName}. Mọi quyền được bảo lưu.`

  return (
    <footer className="at-footer" role="contentinfo">
      <div className="wd-container">
        <div className="at-ft-top">
          {/* Brand column */}
          <div>
            <div className="at-ft-logo">
              Nha Khoa <em>An Tâm</em>
            </div>
            <p className="at-ft-desc">{desc}</p>
            {/* Social */}
            <div style={{ display: 'flex', gap: 20 }}>
              {s.facebook && (
                <a href={s.facebook} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'var(--text-inv-2)', fontWeight: 300, letterSpacing: '.5px', transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-mid)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-inv-2)')}
                >
                  Facebook
                </a>
              )}
              {s.instagram && (
                <a href={s.instagram} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'var(--text-inv-2)', fontWeight: 300, letterSpacing: '.5px', transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-mid)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-inv-2)')}
                >
                  Instagram
                </a>
              )}
              {s.zalo && (
                <a href={s.zalo} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'var(--text-inv-2)', fontWeight: 300, letterSpacing: '.5px', transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-mid)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-inv-2)')}
                >
                  Zalo
                </a>
              )}
            </div>
          </div>

          {/* Links columns */}
          <div className="at-ft-links-grid">
            <div>
              <div className="at-ft-col-title">Dịch vụ</div>
              <div className="at-ft-links">
                <Link to="/dich-vu">Khám tổng quát</Link>
                <Link to="/dich-vu">Điều trị răng</Link>
                <Link to="/dich-vu">Thẩm mỹ răng</Link>
                <Link to="/dat-lich">Đặt lịch khám</Link>
              </div>
            </div>
            <div>
              <div className="at-ft-col-title">Thông tin</div>
              <div className="at-ft-links">
                {s.site_address && <span>{s.site_address}</span>}
                {s.site_phone && (
                  <a href={`tel:${s.site_phone?.replace(/\s/g, '')}`}>{s.site_phone}</a>
                )}
                {s.site_email && (
                  <a href={`mailto:${s.site_email}`}>{s.site_email}</a>
                )}
                {s.working_hours && <span>{s.working_hours}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="at-ft-bottom">
          <span className="at-ft-copy">{copyright}</span>
          <span className="at-ft-line" aria-hidden="true" />
        </div>
      </div>
    </footer>
  )
}
