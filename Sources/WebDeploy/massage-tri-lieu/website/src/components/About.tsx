import { useSite } from '../contexts/SiteContext'

export default function About() {
  const { settings } = useSite()

  const stat1Num = settings.about_stat1_num || '1.200'
  const stat1Sub = settings.about_stat1_sub || '+'
  const stat1Desc = settings.about_stat1_desc || 'Khách hàng đã phục vụ'
  const stat2Num = settings.about_stat2_num || '8'
  const stat2Sub = settings.about_stat2_sub || '+'
  const stat2Desc = settings.about_stat2_desc || 'Năm kinh nghiệm hoạt động'
  const stat3Num = settings.about_stat3_num || '12'
  const stat3Sub = settings.about_stat3_sub || ''
  const stat3Desc = settings.about_stat3_desc || 'Chuyên viên trị liệu'
  const stat4Num = settings.about_stat4_num || '98'
  const stat4Sub = settings.about_stat4_sub || '%'
  const stat4Desc = settings.about_stat4_desc || 'Khách hàng hài lòng'

  const step1Title = settings.process_step1_title || 'Tiếp nhận & Tư vấn'
  const step1Desc = settings.process_step1_desc || 'Chuyên viên lắng nghe tình trạng sức khỏe, mục tiêu thư giãn và tư vấn liệu trình phù hợp nhất.'
  const step2Title = settings.process_step2_title || 'Chuẩn bị & Thư giãn'
  const step2Desc = settings.process_step2_desc || 'Phòng trị liệu được chuẩn bị ấm áp, hương thơm thiên nhiên, âm nhạc nhẹ nhàng tạo không gian yên tĩnh tuyệt vời.'
  const step3Title = settings.process_step3_title || 'Thực hiện liệu trình'
  const step3Desc = settings.process_step3_desc || 'Chuyên viên áp dụng kỹ thuật bài bản — từ massage cổ và vai, dọc sống lưng đến toàn thân với áp lực phù hợp.'
  const step4Title = settings.process_step4_title || 'Chăm sóc sau liệu trình'
  const step4Desc = settings.process_step4_desc || 'Uống nước thảo mộc ấm, nghỉ ngơi 10-15 phút trước khi rời. Chuyên viên tư vấn lịch trở lại tối ưu.'

  return (
    <>
      {/* Stat bar */}
      <div className="mrt-stat-bar">
        <div className="wd-container">
          <div className="mrt-stat-grid">
            <div className="mrt-stat-box" data-reveal>
              <div className="mrt-big-num">{stat1Num}<sub>{stat1Sub}</sub></div>
              <div className="mrt-stat-desc">{stat1Desc}</div>
            </div>
            <div className="mrt-stat-box" data-reveal>
              <div className="mrt-big-num">{stat2Num}<sub>{stat2Sub}</sub></div>
              <div className="mrt-stat-desc">{stat2Desc}</div>
            </div>
            <div className="mrt-stat-box" data-reveal>
              <div className="mrt-big-num">{stat3Num}<sub>{stat3Sub}</sub></div>
              <div className="mrt-stat-desc">{stat3Desc}</div>
            </div>
            <div className="mrt-stat-box" data-reveal>
              <div className="mrt-big-num">{stat4Num}<sub>{stat4Sub}</sub></div>
              <div className="mrt-stat-desc">{stat4Desc}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Process steps */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5" data-reveal>
              <div className="mrt-label">
                <span className="mrt-label-line" />
                Quy trình
              </div>
              <h2 className="mrt-heading">4 bước <em>chăm sóc</em> chuyên nghiệp</h2>
              <p className="mrt-subtext">
                Mỗi buổi trị liệu là một hành trình phục hồi trọn vẹn — từ phút đầu tiên bước vào đến khi bạn rời đi với cơ thể nhẹ nhàng, tinh thần thư thái.
              </p>
            </div>
            <div className="col-lg-7" data-reveal>
              <div className="mrt-step-list">
                {[
                  { num: '01', title: step1Title, desc: step1Desc },
                  { num: '02', title: step2Title, desc: step2Desc },
                  { num: '03', title: step3Title, desc: step3Desc },
                  { num: '04', title: step4Title, desc: step4Desc },
                ].map(step => (
                  <div key={step.num} className="mrt-step-item">
                    <div className="mrt-step-num">{step.num}</div>
                    <div>
                      <div className="mrt-step-title">{step.title}</div>
                      <div className="mrt-step-desc">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
