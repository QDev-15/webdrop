export default function TechPage() {
  return (
    <>
      <header className="st-page-header">
        <div className="wd-container">
          <div className="st-eyebrow st-center" data-reveal>Công nghệ</div>
          <h1 className="st-sec-title st-center" data-reveal>
            Hệ sinh thái <span className="st-grad-text">công nghệ SmileTech</span>
          </h1>
          <p className="st-sec-sub st-center" data-reveal data-reveal-delay="1">
            AI chẩn đoán, scan 3D không đau và hồ sơ số hóa toàn diện — nền tảng cho mọi quyết định điều trị chính xác.
          </p>
          <div className="st-breadcrumb">
            <a href="/">Trang chủ</a> / <span>Công nghệ</span>
          </div>
        </div>
      </header>

      <section className="st-sec-pad" style={{ paddingTop: 0 }}>
        <div className="wd-container">
          <div className="st-strip" data-reveal>
            <div className="st-strip-media">
              <img src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&q=80&auto=format&fit=crop" alt="AI chẩn đoán X-quang" loading="lazy" />
            </div>
            <div className="st-strip-text">
              <div className="st-eyebrow">01 · Chẩn đoán</div>
              <h3>AI Diagnostic Scan</h3>
              <p>Thuật toán học sâu phân tích ảnh X-quang và ảnh trong miệng, khoanh vùng sâu răng, viêm nha chu và tổn thương xương hàm — phát hiện sớm hơn 30% so với mắt thường.</p>
              <ul className="st-strip-list">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                  Độ chính xác chẩn đoán 99.2%
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                  Báo cáo trực quan trong 30 giây
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                  Đối chiếu dữ liệu điều trị trước đó
                </li>
              </ul>
            </div>
          </div>

          <div className="st-strip rev" data-reveal>
            <div className="st-strip-media">
              <img src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80&auto=format&fit=crop" alt="Scan 3D intraoral" loading="lazy" />
            </div>
            <div className="st-strip-text">
              <div className="st-eyebrow">02 · Lấy dấu</div>
              <h3>Scan 3D Intraoral</h3>
              <p>Thay thế hoàn toàn lấy dấu răng bằng khay silicon truyền thống. Đầu scan nhỏ gọn ghi lại toàn bộ khuôn hàm trong vài phút, hiển thị mô hình 3D ngay trên màn hình.</p>
              <ul className="st-strip-list">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                  Không gây phản xạ buồn nôn
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                  Mô phỏng kết quả trước điều trị
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                  Dữ liệu lưu trữ vĩnh viễn trên cloud
                </li>
              </ul>
            </div>
          </div>

          <div className="st-strip" data-reveal>
            <div className="st-strip-media">
              <img src="https://images.unsplash.com/photo-1581093458791-9d42cc6b2f6c?w=800&q=80&auto=format&fit=crop" alt="Hồ sơ số đám mây" loading="lazy" />
            </div>
            <div className="st-strip-text">
              <div className="st-eyebrow">03 · Quản lý</div>
              <h3>Digital Patient Records</h3>
              <p>Toàn bộ lịch sử điều trị, ảnh chụp, kết quả scan và phác đồ được lưu trữ trên nền tảng đám mây mã hóa đầu-cuối, giúp bác sĩ truy xuất tức thì ở bất kỳ lần tái khám nào.</p>
              <ul className="st-strip-list">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                  Mã hóa dữ liệu chuẩn quốc tế
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                  Bệnh nhân tự xem hồ sơ qua ứng dụng
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                  Đồng bộ giữa các chi nhánh
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="st-tech-bleed">
        <div className="wd-container">
          <div className="st-sec-header st-center" data-reveal style={{ maxWidth: 600, marginBottom: 60 }}>
            <div className="st-eyebrow">Quy trình</div>
            <h2 className="st-sec-title">Hành trình điều trị <span className="st-grad-text">số hóa từng bước</span></h2>
          </div>
          <div className="st-timeline">
            {[
              { n: '1', title: 'Đặt lịch online', desc: 'Chọn khung giờ trống theo thời gian thực qua hệ thống Cloud Booking.' },
              { n: '2', title: 'Scan & chẩn đoán AI', desc: 'Scan 3D intraoral kết hợp phân tích AI, ra kết quả chẩn đoán trực quan.' },
              { n: '3', title: 'Tư vấn phác đồ', desc: 'Bác sĩ cùng bạn xem mô phỏng 3D kết quả điều trị trước khi quyết định.' },
              { n: '4', title: 'Điều trị công nghệ cao', desc: 'Laser, CAD/CAM, định vị AI — giảm thiểu xâm lấn, tối ưu thời gian.' },
              { n: '5', title: 'Theo dõi sau điều trị', desc: 'Nhắc lịch tái khám và theo dõi tiến trình hồi phục qua ứng dụng.' },
            ].map((step, i) => (
              <div key={step.n} className="st-tl-item" data-reveal data-reveal-delay={String(i > 0 ? i : undefined)}>
                {i % 2 === 0 ? (
                  <>
                    <div className="st-tl-content"><h4>{step.title}</h4><p>{step.desc}</p></div>
                    <div className="st-tl-dot">{step.n}</div>
                    <div></div>
                  </>
                ) : (
                  <>
                    <div></div>
                    <div className="st-tl-dot">{step.n}</div>
                    <div className="st-tl-content"><h4>{step.title}</h4><p>{step.desc}</p></div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="st-sec-pad" style={{ paddingTop: 0 }}>
        <div className="wd-container">
          <div className="st-cta" data-reveal>
            <div className="st-cta-inner">
              <h2>Trải nghiệm công nghệ <span className="st-grad-text">tận mắt</span></h2>
              <p>Đặt lịch khám để tận mắt trải nghiệm quy trình chẩn đoán AI và scan 3D không đau tại SmileTech.</p>
              <div className="st-cta-actions">
                <a href="/dat-lich" className="st-btn st-btn-primary">Đặt lịch khám ngay</a>
                <a href="/dich-vu" className="st-btn st-btn-glass">Xem dịch vụ</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
