import Team from '../components/Team'

export default function TeamPage() {
  return (
    <>
      <header className="st-page-header">
        <div className="wd-container">
          <div className="st-eyebrow st-center" data-reveal>Đội ngũ</div>
          <h1 className="st-sec-title st-center" data-reveal>
            Bác sĩ am hiểu <span className="st-grad-text">công nghệ số</span>
          </h1>
          <p className="st-sec-sub st-center" data-reveal data-reveal-delay="1">
            Đội ngũ bác sĩ SmileTech được đào tạo chuyên sâu để làm chủ hệ sinh thái công nghệ AI, scan 3D và phần mềm mô phỏng điều trị.
          </p>
          <div className="st-breadcrumb">
            <a href="/">Trang chủ</a> / <span>Bác sĩ</span>
          </div>
        </div>
      </header>
      <section className="st-sec-pad" style={{ paddingTop: 0 }}>
        <Team />
      </section>
      <section className="st-tech-bleed">
        <div className="wd-container">
          <div className="st-sec-header st-center" data-reveal style={{ maxWidth: 600, marginBottom: 50 }}>
            <div className="st-eyebrow">Cam kết</div>
            <h2 className="st-sec-title">Vì sao chọn <span className="st-grad-text">đội ngũ SmileTech</span></h2>
          </div>
          <div className="st-features">
            {[
              { icon: '🏅', title: 'Chứng chỉ quốc tế', desc: '100% bác sĩ được đào tạo và cấp chứng chỉ vận hành hệ thống công nghệ nha khoa số.' },
              { icon: '🔄', title: 'Cập nhật liên tục', desc: 'Đào tạo định kỳ hàng quý về công nghệ nha khoa mới nhất từ các đối tác quốc tế.' },
              { icon: '👥', title: 'Hội chẩn đa chuyên khoa', desc: 'Các ca điều trị phức tạp được hội chẩn qua hồ sơ số với nhiều chuyên khoa cùng lúc.' },
              { icon: '💬', title: 'Tận tâm minh bạch', desc: 'Giải thích rõ ràng phác đồ trên hình ảnh 3D trước khi bệnh nhân quyết định điều trị.' },
            ].map((f, i) => (
              <div key={f.title} className="st-feature-item" data-reveal data-reveal-delay={String(i > 0 ? i : undefined)}>
                <div className="st-feature-icon" style={{ fontSize: 24 }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="st-sec-pad">
        <div className="wd-container">
          <div className="st-cta" data-reveal>
            <div className="st-cta-inner">
              <h2>Gặp gỡ bác sĩ <span className="st-grad-text">phù hợp với bạn</span></h2>
              <p>Đặt lịch khám để được tư vấn trực tiếp bởi bác sĩ chuyên khoa cùng hỗ trợ công nghệ AI.</p>
              <div className="st-cta-actions">
                <a href="/dat-lich" className="st-btn st-btn-primary">Đặt lịch khám ngay</a>
                <a href="/lien-he" className="st-btn st-btn-glass">Liên hệ tư vấn</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
