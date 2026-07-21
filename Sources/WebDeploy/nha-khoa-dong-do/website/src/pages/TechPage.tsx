import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TechPage() {
  useDocumentMeta({
    title: 'Công nghệ điều trị — Nha Khoa Đông Đô',
    description: 'Hệ thống trang thiết bị hiện đại chuẩn quốc tế tại Nha Khoa Đông Đô: CT Cone Beam 3D, scan nội nha CAD/CAM, laser nha khoa thế hệ mới — chẩn đoán chính xác, điều trị ít xâm lấn.',
  })

  return (
    <>
      <div className="dd-page-header">
        <div className="wd-container">
          <div className="dd-breadcrumb">
            <Link to="/">Trang chủ</Link> / <span>Công nghệ</span>
          </div>
          <h1 className="dd-page-title">Công nghệ <em>tiên tiến</em></h1>
          <p className="dd-page-sub">Hệ thống trang thiết bị hiện đại — chuẩn quốc tế — giúp chẩn đoán chính xác, điều trị ít xâm lấn, phục hồi nhanh chóng.</p>
        </div>
      </div>

      <section className="dd-section">
        <div className="wd-container">
          <div className="dd-strip" data-reveal>
            <div className="dd-strip-media">
              <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=78&auto=format&fit=crop" alt="Máy CT Cone Beam 3D" loading="lazy" />
            </div>
            <div className="dd-strip-text">
              <div className="dd-strip-num">01</div>
              <h3>CT Cone Beam 3D (CBCT)</h3>
              <p>Chụp cắt lớp vi tính kỹ thuật số cho phép quan sát cấu trúc xương hàm, vị trí thần kinh, mạch máu chi tiết trong không gian 3 chiều. Tối ưu cho lên kế hoạch implant, nhổ răng khôn phức tạp và chỉnh nha.</p>
              <ul className="dd-strip-list">
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Liều bức xạ thấp, an toàn cho mọi lứa tuổi
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Độ phân giải cao — thấy rõ từng chi tiết 0,1mm
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Kết quả ngay tại phòng khám trong 60 giây
                </li>
              </ul>
            </div>
          </div>

          <div className="dd-strip" data-reveal>
            <div className="dd-strip-media">
              <img src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=78&auto=format&fit=crop" alt="Máy scan nội nha kỹ thuật số" loading="lazy" />
            </div>
            <div className="dd-strip-text">
              <div className="dd-strip-num">02</div>
              <h3>Scan nội nha kỹ thuật số (CAD/CAM)</h3>
              <p>Thay thế hoàn toàn thao tác lấy dấu truyền thống bằng máy quét 3D nội miệng. Dữ liệu số chính xác được truyền trực tiếp đến máy phay CAD/CAM — phục hình sứ hoàn thiện ngay trong buổi khám.</p>
              <ul className="dd-strip-list">
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Không cần lấy dấu silicon khó chịu
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Bọc sứ, inlay/onlay hoàn thành trong 1 buổi
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Độ khít sát vượt trội — tuổi thọ phục hình lâu bền
                </li>
              </ul>
            </div>
          </div>

          <div className="dd-strip" data-reveal>
            <div className="dd-strip-media">
              <img src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=78&auto=format&fit=crop" alt="Điều trị laser nha khoa" loading="lazy" />
            </div>
            <div className="dd-strip-text">
              <div className="dd-strip-num">03</div>
              <h3>Laser nha khoa thế hệ mới</h3>
              <p>Laser Diode công suất cao ứng dụng trong điều trị nha chu, tẩy trắng răng chuyên sâu và phẫu thuật mô mềm. Ít đau, lành thương nhanh, không cần khâu.</p>
              <ul className="dd-strip-list">
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Tẩy trắng laser — hiệu quả tối đa, không ê buốt
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Điều trị nha chu không phẫu thuật hở
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Thời gian hồi phục rút ngắn đến 60%
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="dd-section dd-section-alt">
        <div className="wd-container">
          <div className="dd-sec-head">
            <div>
              <div className="dd-eyebrow" data-reveal>Tiêu chuẩn vô trùng</div>
              <h2 className="dd-sec-title" data-reveal="d1">Môi trường <em>an toàn tuyệt đối</em></h2>
            </div>
          </div>
          <div className="dd-feat-row">
            <div className="dd-feat-item" data-reveal>
              <div className="dd-feat-icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
              </div>
              <h4>Hấp tiệt trùng Autoclave</h4>
              <p>Toàn bộ dụng cụ tái sử dụng được hấp tiệt trùng chuẩn Class B — loại bỏ 100% vi khuẩn và bào tử.</p>
            </div>
            <div className="dd-feat-item" data-reveal="d1">
              <div className="dd-feat-icon">
                <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </div>
              <h4>Vật tư 1 lần</h4>
              <p>Kim, mũi khoan, ống hút đều là vật tư dùng 1 lần — mở gói trước mặt khách, không tái sử dụng.</p>
            </div>
            <div className="dd-feat-item" data-reveal="d2">
              <div className="dd-feat-icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
              </div>
              <h4>Phòng điều trị cách ly</h4>
              <p>Mỗi phòng được thiết kế cách âm, thông gió độc lập — đảm bảo riêng tư và kiểm soát nhiễm khuẩn chéo.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dd-cta-band">
        <div className="wd-container">
          <div className="dd-eyebrow">Trải nghiệm ngay</div>
          <h2>Đặt lịch thăm phòng khám <em>miễn phí</em></h2>
          <p>Ghé thăm và tận mắt trải nghiệm hệ thống công nghệ — không cam kết điều trị.</p>
          <div className="dd-hero-actions">
            <Link to="/dat-lich" className="dd-btn dd-btn-fill">
              Đặt lịch ngay
              <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link to="/lien-he" className="dd-btn">Liên hệ tư vấn</Link>
          </div>
        </div>
      </section>
    </>
  )
}
