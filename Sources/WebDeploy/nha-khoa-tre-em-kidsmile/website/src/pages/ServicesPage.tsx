import { Link } from 'react-router-dom'
import Services from '../components/Services'

export default function ServicesPage() {
  return (
    <>
      {/* Page header */}
      <div className="ks-page-head">
        <div className="wd-container">
          <div className="ks-crumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            Dịch vụ
          </div>
          <h1 className="ks-title" style={{ fontSize: 'clamp(30px,4.5vw,50px)' }}>
            Dịch vụ <strong>nha khoa</strong> cho bé
          </h1>
          <p className="ks-sub ks-mx-auto" style={{ textAlign: 'center', marginTop: 12 }}>
            Đội ngũ bác sĩ chuyên khoa Nhi với đầy đủ dịch vụ — khám định kỳ đến điều trị chuyên sâu, tất cả nhẹ nhàng và an toàn.
          </p>
        </div>
      </div>

      <section className="ks-sec-pad" aria-label="Danh sách dịch vụ">
        <div className="wd-container">
          <Services showHeader showViewAll={false} />
        </div>
      </section>
    </>
  )
}
