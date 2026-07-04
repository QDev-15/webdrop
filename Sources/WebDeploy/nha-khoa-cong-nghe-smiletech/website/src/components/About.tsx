const features = [
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'AI Diagnostic Scan',
    desc: 'Thuật toán học sâu phân tích X-quang, phát hiện sớm tổn thương với độ chính xác 99.2%.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'Scan 3D Intraoral',
    desc: 'Lấy dấu răng không đau, mô hình hóa 3D toàn bộ khuôn hàm chỉ trong vài phút.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: 'Hồ sơ số đám mây',
    desc: 'Lưu trữ lịch sử điều trị trên nền tảng mã hóa đầu-cuối, truy xuất tức thì mọi lần tái khám.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    title: 'Cloud Booking',
    desc: 'Đặt lịch trực tuyến theo thời gian thực, hệ thống nhắc lịch tự động qua SMS.',
  },
]

const stats = [
  { num: '12.500+', label: 'Bệnh nhân đã điều trị' },
  { num: '99.2%', label: 'Độ chính xác AI' },
  { num: '8+', label: 'Năm kinh nghiệm' },
  { num: '15+', label: 'Công nghệ tiên tiến' },
]

export default function About() {
  return (
    <>
      {/* Features row */}
      <section className="st-sec-pad" style={{ paddingBottom: 0 }}>
        <div className="wd-container">
          <div className="st-sec-header st-center" data-reveal style={{ maxWidth: 580 }}>
            <div className="st-eyebrow">Vì sao SmileTech</div>
            <h2 className="st-sec-title">Hệ sinh thái công nghệ <span className="st-grad-text">toàn diện</span></h2>
            <p className="st-sec-sub">Mỗi công nghệ được tích hợp liền mạch, từ chẩn đoán đến điều trị và theo dõi sau liệu trình.</p>
          </div>
          <div className="st-features" style={{ marginTop: 50 }}>
            {features.map((f, i) => (
              <div key={f.title} className="st-feature-item" data-reveal data-reveal-delay={i > 0 ? String(i) : undefined}>
                <div className="st-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="st-sec-pad">
        <div className="wd-container">
          <div className="st-stats-wrap" data-reveal>
            <div className="st-stats">
              {stats.map(s => (
                <div key={s.label} className="st-stat-item">
                  <div className="st-stat-num">{s.num}</div>
                  <div className="st-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech preview bleed */}
      <section className="st-tech-bleed">
        <div className="wd-container">
          <div className="st-tech-bleed-grid">
            <div className="st-tech-visual" data-reveal>
              <img
                src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&q=80&auto=format&fit=crop"
                alt="Công nghệ SmileTech"
                loading="lazy"
              />
            </div>
            <div data-reveal data-reveal-delay="1">
              <div className="st-eyebrow">Công nghệ</div>
              <h2 className="st-sec-title">Quy trình số hóa <span className="st-grad-text">từ đầu đến cuối</span></h2>
              <p style={{ color: 'var(--text-2)', fontSize: 15, lineHeight: 1.75, marginBottom: 0 }}>
                AI Diagnostic Scan phân tích X-quang trong 30 giây, Intraoral Scanner ghi lại mô hình 3D chính xác đến 20µm, tất cả được đồng bộ vào hồ sơ bệnh nhân số trên đám mây.
              </p>
              <div className="st-tech-list">
                {[
                  { num: '01', title: 'AI Chẩn đoán', desc: 'Phát hiện sâu răng, viêm nha chu sớm hơn 30% so với mắt thường.' },
                  { num: '02', title: 'Scan & Mô phỏng', desc: 'Xem trước kết quả điều trị trên mô hình 3D trước khi bắt đầu.' },
                  { num: '03', title: 'Hồ sơ số đám mây', desc: 'Bệnh nhân tự xem lịch sử điều trị và theo dõi qua ứng dụng.' },
                ].map(item => (
                  <div key={item.num} className="st-tech-list-item">
                    <span className="num">{item.num}</span>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
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
