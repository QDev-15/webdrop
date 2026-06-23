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
            <div className="col-md-4">
              <div className="ft-logo">🔥 {s.site_name || 'BBQ Lửa Hồng'}</div>
              <p className="ft-desc">{s.footer_desc || 'Thịt nướng than hoa tươi ngon, không gian sôi động, ẩm thực BBQ đích thực.'}</p>
              <div className="ft-socials">
                {s.facebook && <a href={s.facebook} className="ft-soc" target="_blank" rel="noopener noreferrer" aria-label="Facebook">fb</a>}
                {s.instagram && <a href={s.instagram} className="ft-soc" target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>}
                {s.zalo && <a href={s.zalo} className="ft-soc" target="_blank" rel="noopener noreferrer" aria-label="Zalo">zl</a>}
                {s.tiktok && <a href={s.tiktok} className="ft-soc" target="_blank" rel="noopener noreferrer" aria-label="TikTok">tt</a>}
              </div>
            </div>
            <div className="col">
              <div className="ft-col-title">Thực đơn</div>
              <div className="ft-links">
                <Link to="/thuc-don">Thịt bò & cừu</Link>
                <Link to="/thuc-don">Thịt heo & gà</Link>
                <Link to="/thuc-don">Hải sản tươi</Link>
                <Link to="/thuc-don">Combo set</Link>
              </div>
            </div>
            <div className="col">
              <div className="ft-col-title">Thông tin</div>
              <div className="ft-links">
                <Link to="/khong-gian">Không gian & bàn</Link>
                <Link to="/dat-ban">Đặt bàn</Link>
                <Link to="/lien-he">Liên hệ</Link>
              </div>
            </div>
            <div className="col">
              <div className="ft-col-title">Liên hệ</div>
              <div className="ft-links">
                {s.site_phone && <a href={`tel:${s.site_phone.replace(/\s/g,'')}`}>📱 {s.site_phone}</a>}
                {s.site_address && <a href="#">📍 {s.site_address}</a>}
                <a href="#">🕐 {s.working_hours || '17:00 – 23:00 hàng ngày'}</a>
              </div>
            </div>
          </div>
        </div>
        <div className="ft-bottom">
          <div className="wd-container">
            <div className="d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
              <div className="ft-copy">{s.footer_copy || `© 2026 ${s.site_name || 'BBQ Lửa Hồng'} · Made in Vietnam 🇻🇳`}</div>
            </div>
          </div>
        </div>
      </footer>

      <div className="zf">
        <div className="zf-tip">Đặt bàn qua Zalo</div>
        <a
          href={`https://zalo.me/${s.zalo_number || '0901234567'}`}
          className="zf-btn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo"
        >
          💬
        </a>
      </div>
    </>
  )
}
