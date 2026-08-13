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
              <a href="/dich-vu">Hatha Yoga</a>
              <a href="/dich-vu">Vinyasa Flow</a>
              <a href="/dich-vu">Thiền Định</a>
              <a href="/dich-vu">Prenatal Yoga</a>
            </div>
          </div>
          <div className="col rd2" data-reveal>
            <div className="yw-ft-col-title">Thông tin</div>
            <div className="yw-ft-links">
              <a href="/dat-lich">Đăng ký lớp</a>
              <a href="/lien-he">Liên hệ</a>
              <a href="/">Gói thành viên</a>
              <a href="/">Lịch học tuần</a>
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
