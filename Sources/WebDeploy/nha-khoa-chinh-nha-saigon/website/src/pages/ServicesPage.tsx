import { Link } from 'react-router-dom'
import Services from '../components/Services'

export default function ServicesPage() {
  return (
    <>
      {/* Page hero */}
      <section className="cn-page-hero">
        <div className="cn-page-hero-shape" aria-hidden="true" />
        <div className="wd-container">
          <div className="cn-ph-inner" data-reveal>
            <div className="cn-breadcrumb">
              <Link to="/">Trang chủ</Link> / <span>Dịch vụ</span>
            </div>
            <h1 className="cn-ph-title">Dịch vụ <em>chỉnh nha</em></h1>
            <p className="cn-ph-sub">Đầy đủ giải pháp niềng răng từ mắc cài kim loại, mắc cài sứ đến Invisalign cao cấp — chúng tôi tư vấn phương pháp phù hợp nhất cho từng tình trạng.</p>
          </div>
        </div>
      </section>

      {/* Bento grid services */}
      <section className="cn-services sec-pad">
        <div className="wd-container">
          <div className="cn-section-head" data-reveal>
            <div>
              <div className="cn-eyebrow">Danh mục dịch vụ</div>
              <h2 className="cn-title">Giải pháp phù hợp với <em>từng nhu cầu</em></h2>
            </div>
          </div>
          <Services />
        </div>
      </section>

      {/* Compare table */}
      <section className="cn-services sec-pad" style={{ background: 'var(--bg-2)', paddingTop: 0 }}>
        <div className="wd-container">
          <div className="cn-section-head" data-reveal>
            <div>
              <div className="cn-eyebrow">So sánh phương pháp</div>
              <h2 className="cn-title">Chọn phương pháp <em>phù hợp</em></h2>
            </div>
          </div>
          <div className="cn-compare-wrap" data-reveal>
            <table className="cn-compare-table">
              <thead>
                <tr>
                  <th>Tiêu chí</th>
                  <th>Mắc cài kim loại</th>
                  <th>Mắc cài sứ</th>
                  <th>Invisalign</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Tính thẩm mỹ</td><td>Có thể thấy</td><td>Ít lộ hơn</td><td className="cn-check">Gần như vô hình</td></tr>
                <tr><td>Hiệu quả</td><td className="cn-check">Cao</td><td className="cn-check">Cao</td><td className="cn-check">Cao</td></tr>
                <tr><td>Tháo lắp</td><td className="cn-cross">Không</td><td className="cn-cross">Không</td><td className="cn-check">Được</td></tr>
                <tr><td>Chi phí</td><td className="cn-check">Hợp lý nhất</td><td>Trung bình</td><td>Cao hơn</td></tr>
                <tr><td>Thời gian</td><td>12–24 tháng</td><td>12–24 tháng</td><td>12–18 tháng</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cn-cta sec-pad">
        <div className="cn-cta-shape" aria-hidden="true" />
        <div className="cn-cta-shape b" aria-hidden="true" />
        <div className="wd-container">
          <div className="cn-cta-inner" data-reveal>
            <div>
              <h2 className="cn-cta-title">Chưa biết phương pháp nào <em>phù hợp?</em></h2>
              <p className="cn-cta-sub">Đặt lịch tư vấn miễn phí — bác sĩ sẽ đánh giá tình trạng răng và đề xuất giải pháp tối ưu nhất cho bạn.</p>
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
