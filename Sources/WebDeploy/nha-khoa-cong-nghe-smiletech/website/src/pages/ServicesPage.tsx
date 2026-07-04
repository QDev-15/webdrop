import Services from '../components/Services'

export default function ServicesPage() {
  return (
    <>
      <header className="st-page-header">
        <div className="wd-container">
          <div className="st-eyebrow st-center" data-reveal>Dịch vụ</div>
          <h1 className="st-sec-title st-center" data-reveal>
            Dịch vụ ứng dụng <span className="st-grad-text">công nghệ cao</span>
          </h1>
          <p className="st-sec-sub st-center" data-reveal data-reveal-delay="1">
            Mỗi liệu trình tại SmileTech đều được số hóa từ khâu chẩn đoán đến điều trị, đảm bảo độ chính xác và trải nghiệm tối ưu.
          </p>
          <div className="st-breadcrumb">
            <a href="/">Trang chủ</a> / <span>Dịch vụ</span>
          </div>
        </div>
      </header>
      <section className="st-sec-pad" style={{ paddingTop: 0 }}>
        <Services />
      </section>
      <section className="st-sec-pad" style={{ paddingTop: 0 }}>
        <div className="wd-container">
          <div className="st-cta" data-reveal>
            <div className="st-cta-inner">
              <h2>Chưa chắc dịch vụ nào <span className="st-grad-text">phù hợp?</span></h2>
              <p>Đặt lịch tư vấn miễn phí — bác sĩ sẽ scan 3D và đề xuất phác đồ điều trị phù hợp với bạn.</p>
              <div className="st-cta-actions">
                <a href="/dat-lich" className="st-btn st-btn-primary">Đặt lịch tư vấn miễn phí</a>
                <a href="/lien-he" className="st-btn st-btn-glass">Liên hệ ngay</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
