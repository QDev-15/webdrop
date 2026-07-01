import { useSite } from '../contexts/SiteContext'

const TECH = [
  { icon: '⬡', name: 'Công nghệ Laser thế hệ mới', desc: 'Hệ thống laser tiên tiến từ châu Âu, điều trị chính xác, không xâm lấn, phục hồi nhanh.' },
  { icon: '✦', name: 'Robot phẫu thuật AI', desc: 'Tích hợp trí tuệ nhân tạo hỗ trợ bác sĩ lên kế hoạch phẫu thuật tối ưu, giảm thiểu rủi ro.' },
  { icon: '◇', name: 'Phòng mổ vô khuẩn ISO 14644', desc: 'Tiêu chuẩn phòng sạch quốc tế, đảm bảo môi trường vô trùng tuyệt đối trong mọi ca phẫu thuật.' },
  { icon: '○', name: 'Mô phỏng 3D trước phẫu thuật', desc: 'Khách hàng xem kết quả dự kiến bằng công nghệ 3D trước khi quyết định — minh bạch, an tâm.' },
]

export default function About() {
  const { settings } = useSite()
  const cases      = settings.stat_cases         || '15,000+'
  const doctors    = settings.stat_doctors       || '25+'
  const years      = settings.stat_years         || '15+'
  const sat        = settings.stat_satisfaction  || '99%'

  return (
    <>
      {/* Stat bar */}
      <section className="tmv-stat-bar">
        <div className="wd-container">
          <div className="row g-0 text-center">
            {[
              { num: cases,   label: 'Ca thực hiện thành công' },
              { num: doctors, label: 'Bác sĩ chuyên khoa' },
              { num: years,   label: 'Năm kinh nghiệm' },
              { num: sat,     label: 'Khách hàng hài lòng' },
            ].map((s, i) => (
              <div key={i} className="col-6 col-md-3" style={{ padding: '0 20px' }}>
                <div className="tmv-stat" data-reveal data-delay={String(i + 1) as '1' | '2' | '3' | '4'}>
                  <div className="tmv-stat-num">{s.num}</div>
                  <div className="tmv-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology section */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="tmv-label">Công nghệ</div>
            <h2 className="tmv-h2">Trang thiết bị <em>đỉnh cao</em></h2>
            <p className="tmv-lead center">Đầu tư vào công nghệ là đầu tư vào sự an toàn và kết quả tốt nhất cho khách hàng.</p>
          </div>
          <div className="row g-3">
            {TECH.map((t, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-3">
                <div className="tmv-tech-card h-100" data-reveal data-delay={String(i + 1) as '1' | '2' | '3' | '4'}>
                  <div className="tmv-tech-icon" style={{ fontSize: 22 }}>{t.icon}</div>
                  <div className="tmv-tech-name">{t.name}</div>
                  <div className="tmv-tech-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
