import { useSite } from '../contexts/SiteContext'

// USP section — the 4 feature icons below the hero
export default function About() {
  const { settings } = useSite()

  const statCases = settings.stat_cases    || '4.500+'
  const statDocs  = settings.stat_doctors  || '6 bác sĩ'
  const statYears = settings.stat_years    || '12 năm'
  const statSat   = settings.stat_satisfaction || '98%'

  return (
    <>
      {/* USP row */}
      <section className="cn-usp sec-pad-sm">
        <div className="wd-container">
          <div className="cn-usp-row">
            <div className="cn-usp-item" data-reveal>
              <div className="cn-usp-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7h-9M14 17H5M17 3v8M7 13v8"/><circle cx="17" cy="7" r="3"/><circle cx="7" cy="17" r="3"/></svg>
              </div>
              <div className="cn-usp-title">Scan 3D không đau</div>
              <p className="cn-usp-text">Thay thế lấy dấu truyền thống, cho kết quả tức thì, chính xác tuyệt đối.</p>
            </div>
            <div className="cn-usp-item" data-reveal data-delay="1">
              <div className="cn-usp-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l9 4.5v9L12 20l-9-4.5v-9L12 2z"/><path d="M12 22V12M21 6.5L12 12 3 6.5"/></svg>
              </div>
              <div className="cn-usp-title">Kế hoạch điều trị 3D</div>
              <p className="cn-usp-text">Mô phỏng lộ trình dịch chuyển răng trước khi bắt đầu, xem trước kết quả cuối.</p>
            </div>
            <div className="cn-usp-item" data-reveal data-delay="2">
              <div className="cn-usp-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20l9-16H3l9 16z"/><path d="M12 4v16"/></svg>
              </div>
              <div className="cn-usp-title">Bác sĩ chuyên khoa</div>
              <p className="cn-usp-text">Đội ngũ tốt nghiệp chuyên khoa Chỉnh nha, cập nhật kỹ thuật quốc tế.</p>
            </div>
            <div className="cn-usp-item" data-reveal data-delay="3">
              <div className="cn-usp-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="1"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              </div>
              <div className="cn-usp-title">Tái khám đúng hẹn</div>
              <p className="cn-usp-text">Lịch chỉnh lực định kỳ, nhắc lịch tự động, theo sát tiến độ điều trị.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stat bar */}
      <section className="cn-stats">
        <div className="wd-container">
          <div className="cn-stats-row">
            <div className="cn-stat-item" data-reveal>
              <div className="cn-stat-num">{statCases}</div>
              <div className="cn-stat-lbl">Ca niềng răng thành công</div>
            </div>
            <div className="cn-stat-item" data-reveal data-delay="1">
              <div className="cn-stat-num">{statYears}</div>
              <div className="cn-stat-lbl">Kinh nghiệm chuyên khoa</div>
            </div>
            <div className="cn-stat-item" data-reveal data-delay="2">
              <div className="cn-stat-num">{statSat}</div>
              <div className="cn-stat-lbl">Khách hàng hài lòng</div>
            </div>
            <div className="cn-stat-item" data-reveal data-delay="3">
              <div className="cn-stat-num">{statDocs}</div>
              <div className="cn-stat-lbl">Bác sĩ chuyên khoa</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
