import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="wd-container">
        <div className="row g-4 py-5">
          <div className="col-md-4" data-reveal>
            <div className="yw-ft-logo"><div className="yw-ft-logo-dot"></div>Yoga & Wellness</div>
            <p className="yw-ft-desc">Không gian yoga & wellness — nơi thân và tâm được nuôi dưỡng qua từng hơi thở.</p>
            <div className="yw-ft-socials">
              <a href="#" className="yw-ft-soc" rel="noopener noreferrer">fb</a>
              <a href="#" className="yw-ft-soc" rel="noopener noreferrer">ig</a>
              <a href="#" className="yw-ft-soc" rel="noopener noreferrer">yt</a>
              <a href="#" className="yw-ft-soc" rel="noopener noreferrer">zl</a>
            </div>
          </div>
          <div className="col rd1" data-reveal>
            <div className="yw-ft-col-title">Các lớp học</div>
            <div className="yw-ft-links">
              <Link to="/dich-vu">Hatha Yoga</Link>
              <Link to="/dich-vu">Vinyasa Flow</Link>
              <Link to="/dich-vu">Thiền Định</Link>
              <Link to="/dich-vu">Prenatal Yoga</Link>
            </div>
          </div>
          <div className="col rd2" data-reveal>
            <div className="yw-ft-col-title">Thông tin</div>
            <div className="yw-ft-links">
              <Link to="/dat-lich">Đăng ký lớp</Link>
              <Link to="/lien-he">Liên hệ</Link>
              <Link to="/">Gói thành viên</Link>
              <Link to="/">Lịch học tuần</Link>
            </div>
          </div>
          <div className="col rd3" data-reveal>
            <div className="yw-ft-col-title">Liên hệ</div>
            <div className="yw-ft-links">
              <a href="tel:0901234567">📱 0901 234 567</a>
              <a href="#">📍 Địa chỉ trung tâm</a>
              <a href="#">🌿 Mở cửa 6:00 – 21:00</a>
            </div>
          </div>
        </div>
      </div>
      <div className="yw-ft-bottom">
        <div className="wd-container">
          <div className="d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
            <div className="yw-ft-copy">© 2026 Yoga & Wellness · Yoga Alliance</div>
            <div className="yw-ft-copy">Chứng nhận RYT · Yoga Alliance</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
