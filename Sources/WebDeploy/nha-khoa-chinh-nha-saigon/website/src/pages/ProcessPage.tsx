import { Link } from 'react-router-dom'

const STEPS = [
  {
    num: '01',
    phase: 'Bước 01',
    title: 'Thăm khám & chụp phim kỹ thuật số',
    desc: 'Bác sĩ kiểm tra tổng quát tình trạng răng, nướu, khớp cắn. Chụp phim X-quang toàn cảnh (Panorex) và Cephalo để đánh giá cấu trúc xương hàm.',
    odd: true,
  },
  {
    num: '02',
    phase: 'Bước 02',
    title: 'Scan 3D & lấy dấu răng kỹ thuật số',
    desc: 'Thay thế lấy dấu bằng thạch cao truyền thống, máy scan 3D ghi lại chính xác toàn bộ cấu trúc hàm răng trong vài phút, không gây khó chịu.',
    odd: false,
  },
  {
    num: '03',
    phase: 'Bước 03',
    title: 'Tư vấn & lập kế hoạch điều trị 3D',
    desc: 'Phần mềm mô phỏng lộ trình dịch chuyển từng chiếc răng theo từng giai đoạn — khách hàng xem trước kết quả dự kiến trước khi quyết định điều trị.',
    odd: true,
  },
  {
    num: '04',
    phase: 'Bước 04',
    title: 'Gắn mắc cài / giao khay niềng',
    desc: 'Thực hiện bởi bác sĩ chuyên khoa chỉnh nha. Với khay trong suốt, khách hàng nhận trọn bộ khay theo lộ trình đã lập kế hoạch từ bước 3.',
    odd: false,
  },
  {
    num: '05',
    phase: 'Bước 05',
    title: 'Tái khám định kỳ & chỉnh lực',
    desc: 'Lịch tái khám mỗi 4–6 tuần để điều chỉnh lực kéo, thay dây cung hoặc khay mới. Tiến độ được đối chiếu với kế hoạch 3D ban đầu.',
    odd: true,
  },
  {
    num: '06',
    phase: 'Bước 06',
    title: 'Tháo niềng & đeo hàm duy trì',
    desc: 'Khi đạt kết quả mong muốn, bác sĩ tháo mắc cài và chỉ định hàm duy trì (retainer) để giữ ổn định vị trí răng lâu dài.',
    odd: false,
  },
]

const FAQS = [
  { q: 'Niềng răng có đau không?', a: 'Ê nhẹ 2–3 ngày đầu' },
  { q: 'Bao lâu tái khám một lần?', a: 'Mỗi 4–6 tuần' },
  { q: 'Có cần nhổ răng không?', a: 'Tùy tình trạng khớp cắn' },
  { q: 'Sau tháo niềng có tái phát?', a: 'Không nếu đeo hàm duy trì đúng chỉ định' },
]

export default function ProcessPage() {
  return (
    <>
      <section className="cn-page-hero">
        <div className="cn-page-hero-shape" aria-hidden="true" />
        <div className="wd-container">
          <div className="cn-ph-inner" data-reveal>
            <div className="cn-breadcrumb">
              <Link to="/">Trang chủ</Link> / <span>Quy trình niềng</span>
            </div>
            <h1 className="cn-ph-title">6 bước đến <em>nụ cười hoàn hảo</em></h1>
            <p className="cn-ph-sub">Mỗi ca chỉnh nha đều được số hóa và theo dõi minh bạch — từ buổi thăm khám đầu tiên đến khi tháo niềng và duy trì kết quả lâu dài.</p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="cn-services sec-pad">
        <div className="wd-container">
          <div className="cn-timeline">
            {STEPS.map((s, i) => (
              <div key={s.num} className="cn-tl-item" data-reveal data-delay={String(i % 2 + 1)}>
                {s.odd ? (
                  <>
                    <div className="cn-tl-content">
                      <div className="cn-tl-card">
                        <div className="cn-tl-phase">{s.phase}</div>
                        <h3 className="cn-tl-title">{s.title}</h3>
                        <p className="cn-tl-text">{s.desc}</p>
                      </div>
                    </div>
                    <div className="cn-tl-dot"><span>{s.num}</span></div>
                    <div className="cn-tl-spacer" />
                  </>
                ) : (
                  <>
                    <div className="cn-tl-spacer" />
                    <div className="cn-tl-dot"><span>{s.num}</span></div>
                    <div className="cn-tl-content">
                      <div className="cn-tl-card">
                        <div className="cn-tl-phase">{s.phase}</div>
                        <h3 className="cn-tl-title">{s.title}</h3>
                        <p className="cn-tl-text">{s.desc}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stat bar */}
      <section className="cn-stats">
        <div className="wd-container">
          <div className="cn-stats-row">
            <div className="cn-stat-item" data-reveal><div className="cn-stat-num">6 bước</div><div className="cn-stat-lbl">Quy trình chuẩn hóa</div></div>
            <div className="cn-stat-item" data-reveal data-delay="1"><div className="cn-stat-num">4 tuần</div><div className="cn-stat-lbl">Chu kỳ tái khám</div></div>
            <div className="cn-stat-item" data-reveal data-delay="2"><div className="cn-stat-num">0.1mm</div><div className="cn-stat-lbl">Độ chính xác đo lường</div></div>
            <div className="cn-stat-item" data-reveal data-delay="3"><div className="cn-stat-num">98%</div><div className="cn-stat-lbl">Khách hàng hài lòng</div></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="cn-services sec-pad">
        <div className="wd-container" style={{ maxWidth: '760px' }}>
          <div className="cn-text-center" data-reveal style={{ marginBottom: '40px' }}>
            <div className="cn-eyebrow" style={{ justifyContent: 'center' }}>Câu hỏi thường gặp</div>
            <h2 className="cn-title">Về quy trình <em>chỉnh nha</em></h2>
          </div>
          <ul className="cn-hours-list" data-reveal data-delay="1">
            {FAQS.map(f => (
              <li key={f.q}>
                <span className="cn-hours-day">{f.q}</span>
                <span className="cn-hours-time">{f.a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="cn-cta sec-pad">
        <div className="cn-cta-shape" aria-hidden="true" />
        <div className="cn-cta-shape b" aria-hidden="true" />
        <div className="wd-container">
          <div className="cn-cta-inner" data-reveal>
            <div>
              <h2 className="cn-cta-title">Bắt đầu hành trình <em>từ hôm nay</em></h2>
              <p className="cn-cta-sub">Đặt lịch thăm khám và scan 3D miễn phí để biết chính xác lộ trình điều trị dành riêng cho bạn.</p>
            </div>
            <div className="cn-cta-actions">
              <Link to="/dat-lich" className="cn-btn cn-btn-primary">Đặt lịch tư vấn</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
