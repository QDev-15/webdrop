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
  youtube?: string
  zalo?: string
  zalo_number?: string
}

export default function Footer() {
  const [s, setS] = useState<Settings>({})

  useEffect(() => {
    api.get<Settings>('/public/settings').then(setS).catch(() => {})
  }, [])

  const desc = s.footer_desc || 'Nha khoa chuyên biệt cho trẻ em — nơi mỗi buổi khám răng là một trải nghiệm vui vẻ, an toàn và không đáng sợ.'
  const copyright = s.footer_copyright || `© ${new Date().getFullYear()} KidSmile — Nha Khoa Trẻ Em. Mọi quyền được bảo lưu.`
  const phone = s.site_phone || ''
  const zaloHref = s.zalo || (s.zalo_number ? `https://zalo.me/${s.zalo_number.replace(/\s/g, '')}` : 'https://zalo.me/0281234567')

  return (
    <footer className="ks-footer" role="contentinfo">
      <div className="wd-container">
        <div className="ks-ft-grid">
          {/* Brand column */}
          <div>
            <div className="ks-ft-logo">
              <span className="ks-logo-mark" aria-hidden="true">🦷</span>
              Kid<em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>Smile</em>
            </div>
            <p className="ks-ft-desc">{desc}</p>
            <div className="ks-ft-socials">
              {s.facebook && (
                <a href={s.facebook} target="_blank" rel="noopener noreferrer" className="ks-ft-soc fb" aria-label="Facebook">f</a>
              )}
              {s.instagram && (
                <a href={s.instagram} target="_blank" rel="noopener noreferrer" className="ks-ft-soc ig" aria-label="Instagram">ig</a>
              )}
              {s.youtube && (
                <a href={s.youtube} target="_blank" rel="noopener noreferrer" className="ks-ft-soc yt" aria-label="YouTube">▶</a>
              )}
              <a href={zaloHref} target="_blank" rel="noopener noreferrer" className="ks-ft-soc zl" aria-label="Zalo">Za</a>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="ks-ft-col-title">Dịch vụ</div>
            <div className="ks-ft-links">
              <Link to="/dich-vu">Khám định kỳ</Link>
              <Link to="/dich-vu">Trám răng sữa</Link>
              <Link to="/dich-vu">Nhổ răng sữa</Link>
              <Link to="/dich-vu">Sealant</Link>
              <Link to="/dich-vu">Chỉnh nha sớm</Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="ks-ft-col-title">Liên kết</div>
            <div className="ks-ft-links">
              <Link to="/cam-nang-cha-me">Cẩm nang cha mẹ</Link>
              <Link to="/bac-si">Đội ngũ bác sĩ</Link>
              <Link to="/dat-lich">Đặt lịch khám</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="ks-ft-col-title">Liên hệ</div>
            <div className="ks-ft-links">
              {s.site_address && <span>{s.site_address}</span>}
              {phone && <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>}
              {s.site_email && <a href={`mailto:${s.site_email}`}>{s.site_email}</a>}
              {s.working_hours && <span>{s.working_hours}</span>}
            </div>
          </div>
        </div>

        <div className="ks-ft-bottom">
          <span className="ks-ft-copy">{copyright}</span>
          <span className="ks-ft-made">Made with 💜 for happy smiles</span>
        </div>
      </div>
    </footer>
  )
}
