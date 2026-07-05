import { useSite } from '../contexts/SiteContext'

export default function About() {
  const { settings } = useSite()

  const statYears  = settings.stat_years        || '15'
  const statCases  = settings.stat_cases        || '12000'
  const statDocs   = settings.stat_doctors      || '8'
  const statSat    = settings.stat_satisfaction || '98'

  const casesDisplay = parseInt(statCases) >= 1000
    ? (parseInt(statCases) / 1000).toFixed(0) + 'K+'
    : statCases + '+'

  return (
    <>
      {/* Stats bar */}
      <section className="dd-stats">
        <div className="wd-container">
          <div className="dd-stats-grid">
            <div className="dd-stat-item" data-reveal>
              <div className="dd-stat-num">{statYears}+</div>
              <div className="dd-stat-label">Năm kinh nghiệm</div>
            </div>
            <div className="dd-stat-item" data-reveal="d1">
              <div className="dd-stat-num">{casesDisplay}</div>
              <div className="dd-stat-label">Ca điều trị</div>
            </div>
            <div className="dd-stat-item" data-reveal="d2">
              <div className="dd-stat-num">{statDocs}+</div>
              <div className="dd-stat-label">Chuyên gia</div>
            </div>
            <div className="dd-stat-item" data-reveal="d3">
              <div className="dd-stat-num">{statSat}%</div>
              <div className="dd-stat-label">Hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* USP — Giá trị cốt lõi */}
      <section className="dd-section">
        <div className="wd-container">
          <div className="dd-sec-head">
            <div>
              <div className="dd-eyebrow">Tại sao chọn chúng tôi</div>
              <h2 className="dd-sec-title">Tiêu chuẩn <em>quốc tế</em>, cảm nhận <em>cá nhân</em></h2>
            </div>
          </div>
          <div className="dd-feat-row">
            <div className="dd-feat-item" data-reveal>
              <div className="dd-feat-icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
              </div>
              <h4>Chuyên gia hàng đầu</h4>
              <p>Đội ngũ bác sĩ được đào tạo tại các cơ sở uy tín quốc tế, nhiều năm kinh nghiệm chuyên sâu trong từng lĩnh vực nha khoa.</p>
            </div>
            <div className="dd-feat-item" data-reveal="d1">
              <div className="dd-feat-icon">
                <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </div>
              <h4>Công nghệ tiên tiến</h4>
              <p>Trang bị hệ thống máy móc hiện đại nhất — CT 3D Cone Beam, máy scan nội nha kỹ thuật số, thiết bị điều trị laser thế hệ mới.</p>
            </div>
            <div className="dd-feat-item" data-reveal="d2">
              <div className="dd-feat-icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.6"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.6"/></svg>
              </div>
              <h4>Dịch vụ trọn gói</h4>
              <p>Từ thăm khám, lập kế hoạch điều trị đến tái khám định kỳ — mọi bước được đồng hành bởi chuyên gia tư vấn cá nhân.</p>
            </div>
            <div className="dd-feat-item" data-reveal="d3">
              <div className="dd-feat-icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
              </div>
              <h4>An toàn & vô trùng</h4>
              <p>Quy trình khử khuẩn đạt chuẩn Bộ Y tế, vật tư tiêu hao sử dụng một lần, môi trường phòng khám an toàn tuyệt đối.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
