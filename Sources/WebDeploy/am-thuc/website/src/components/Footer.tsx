import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const s = settings

  return (
    <>
      <footer>
        <div className="wd-container">
          <div className="row g-4 py-5">
            <div className="col-md-4 reveal">
              <div className="ft-logo">🍜 {s.site_name || 'Nhà Hàng'} <span>Ẩm Thực</span></div>
              <p className="ft-desc">{s.footer_description || 'Ẩm thực Việt Nam truyền thống, nấu từ tâm — ăn bằng cảm xúc.'}</p>
              {s.footer_show_social !== '0' && (
                <div className="ft-socials">
                  {s.social_facebook && s.social_facebook !== '#' && <a href={s.social_facebook} className="ft-soc" target="_blank" rel="noreferrer">fb</a>}
                  {s.social_instagram && s.social_instagram !== '#' && <a href={s.social_instagram} className="ft-soc" target="_blank" rel="noreferrer">ig</a>}
                  {s.social_zalo && s.social_zalo !== '#' && <a href={s.social_zalo} className="ft-soc" target="_blank" rel="noreferrer">zl</a>}
                  {s.social_youtube && s.social_youtube !== '#' && <a href={s.social_youtube} className="ft-soc" target="_blank" rel="noreferrer">yt</a>}
                </div>
              )}
            </div>
            <div className="col reveal reveal-d1">
              <div className="ft-col-title">Menu</div>
              <div className="ft-links">
                <Link to="/thuc-don">Món khai vị</Link>
                <Link to="/thuc-don">Món chính</Link>
                <Link to="/thuc-don">Canh & Lẩu</Link>
                <Link to="/thuc-don">Đồ uống</Link>
              </div>
            </div>
            <div className="col reveal reveal-d2">
              <div className="ft-col-title">Thông tin</div>
              <div className="ft-links">
                <Link to="/dat-ban">Đặt bàn</Link>
                <Link to="/lien-he">Liên hệ</Link>
              </div>
            </div>
            <div className="col reveal reveal-d3">
              <div className="ft-col-title">Liên hệ</div>
              <div className="ft-links">
                {s.site_phone && <a href={`tel:${s.site_phone}`}>📱 {s.site_phone}</a>}
                {s.site_address && <span>📍 {s.site_address}</span>}
                {s.working_hours && <span>🕐 {s.working_hours.split('|')[0]?.trim()}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="ft-bottom">
          <div className="wd-container">
            <div className="d-flex justify-content-between align-items-center py-3">
              <div className="ft-copy">{s.footer_copyright || '© 2026 Nhà Hàng Ẩm Thực · Made in Vietnam'}</div>
            </div>
          </div>
        </div>
      </footer>

      <div className="zf">
        <div className="zf-tip">Đặt bàn qua Zalo</div>
        <button className="zf-btn" onClick={() => { if (s.social_zalo) window.open(s.social_zalo, '_blank') }}>💬</button>
      </div>
    </>
  )
}
