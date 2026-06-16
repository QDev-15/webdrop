import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName = (settings.site_name) || 'Lá Xanh Chay Organic'
  const phone    = (settings.site_phone) || '0901 234 567'
  const address  = (settings.site_address) || '123 Đường Lá Xanh, Quận 3, TP.HCM'
  const hours    = (settings.working_hours) || '07:00 – 21:00 hàng ngày'
  const copyright = (settings.footer_copyright) || `© ${new Date().getFullYear()} ${siteName}`
  const description = (settings.footer_description) || 'Ẩm thực chay organic, nấu từ tâm — mỗi bữa ăn là một lựa chọn yêu thương.'
  const facebook = settings.social_facebook || ''
  const instagram = settings.social_instagram || ''
  const youtube  = settings.social_youtube || ''
  const zalo     = settings.social_zalo || ''

  return (
    <footer>
      <div className="wd-container">
        <div className="row g-4 py-5">
          <div className="col-md-4 reveal">
            <div className="ft-logo">🌿 {siteName.replace(' Chay Organic', '')} <span>Chay</span></div>
            <p className="ft-desc">{description}</p>
            <div className="ft-socials">
              {facebook && <a href={facebook} className="ft-soc" target="_blank" rel="noopener" aria-label="Facebook">fb</a>}
              {instagram && <a href={instagram} className="ft-soc" target="_blank" rel="noopener" aria-label="Instagram">ig</a>}
              {zalo && <a href={`https://zalo.me/${zalo}`} className="ft-soc" target="_blank" rel="noopener" aria-label="Zalo">zl</a>}
              {youtube && <a href={youtube} className="ft-soc" target="_blank" rel="noopener" aria-label="YouTube">yt</a>}
            </div>
          </div>
          <div className="col reveal reveal-d1">
            <div className="ft-col-title">Thực đơn</div>
            <div className="ft-links">
              <Link to="/thuc-don">Khai vị &amp; Salad</Link>
              <Link to="/thuc-don">Món chính</Link>
              <Link to="/thuc-don">Tráng miệng</Link>
              <Link to="/thuc-don">Đồ uống &amp; Trà</Link>
            </div>
          </div>
          <div className="col reveal reveal-d2">
            <div className="ft-col-title">Về chúng tôi</div>
            <div className="ft-links">
              <Link to="/ve-chung-toi">Câu chuyện</Link>
              <Link to="/ve-chung-toi">Đội ngũ</Link>
              <Link to="/ve-chung-toi">Chứng nhận</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>
          <div className="col reveal reveal-d3">
            <div className="ft-col-title">Liên hệ</div>
            <div className="ft-links">
              <a href={`tel:${phone.replace(/\s/g, '')}`}>📱 {phone}</a>
              <a href="#">📍 {address}</a>
              <a href="#">🕐 {hours.split('|')[0]?.trim() || hours}</a>
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
