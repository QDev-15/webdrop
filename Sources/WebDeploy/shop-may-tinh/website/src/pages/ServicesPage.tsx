import { Link } from 'react-router-dom'
import StatCounter from '../components/StatCounter'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const FEATURES = [
  { icon: 'cpu-fill', title: 'Build PC theo yêu cầu', desc: 'Tư vấn và lắp ráp cấu hình PC theo nhu cầu — gaming, đồ họa, văn phòng — tối ưu hiệu năng/chi phí.' },
  { icon: 'credit-card-2-front-fill', title: 'Trả góp 0% lãi suất', desc: 'Hỗ trợ trả góp qua thẻ tín dụng và công ty tài chính, duyệt hồ sơ nhanh trong ngày.' },
  { icon: 'tools', title: 'Sửa chữa & nâng cấp', desc: 'Nhận sửa chữa, vệ sinh, nâng cấp RAM/SSD cho laptop và PC mọi thương hiệu.' },
  { icon: 'shield-check', title: 'Bảo hành chính hãng', desc: 'Bảo hành chính hãng lên đến 36 tháng, hỗ trợ 1 đổi 1 trong 30 ngày đầu nếu lỗi nhà sản xuất.' },
]

const PROCESS = [
  { icon: '1-circle-fill', title: 'Liên hệ tư vấn', desc: 'Gọi hotline hoặc gửi yêu cầu qua form, mô tả nhu cầu hoặc tình trạng thiết bị.' },
  { icon: '2-circle-fill', title: 'Báo giá chi tiết', desc: 'Kỹ thuật viên kiểm tra, báo giá minh bạch trước khi tiến hành.' },
  { icon: '3-circle-fill', title: 'Nhận máy & bảo hành', desc: 'Nhận lại thiết bị hoàn thiện, kèm phiếu bảo hành dịch vụ rõ ràng.' },
]

export default function ServicesPage() {
  useDocumentMeta({
    title: 'Dịch vụ — NovaTech',
    description: 'Build PC theo yêu cầu, trả góp 0% lãi suất, sửa chữa & nâng cấp, bảo hành chính hãng — dịch vụ trọn gói tại NovaTech.',
  })

  return (
    <>
      <div className="mt-page-header" style={{ paddingBottom: 52 }}>
        <div className="mt-container">
          <nav className="mt-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Dịch vụ</span>
          </nav>
          <h1 className="mt-page-title">Dịch Vụ</h1>
          <p className="mt-page-count" style={{ fontSize: 16 }}>Đồng hành cùng bạn từ khâu chọn cấu hình đến bảo hành sau bán hàng</p>
        </div>
      </div>

      <main>
        <section className="mt-sec">
          <div className="mt-container">
            <div className="mt-feature-row">
              {FEATURES.map((f, i) => (
                <div className="mt-feature-item" data-reveal data-delay={String(i + 1)} key={f.title}>
                  <div className="mt-feature-icon"><i className={`bi bi-${f.icon}`} /></div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-sec" style={{ background: 'rgba(109,94,248,.04)' }} aria-labelledby="process-heading">
          <div className="mt-container">
            <div className="mt-eyebrow" data-reveal>Quy trình</div>
            <h2 className="mt-sec-title" id="process-heading" data-reveal data-delay="1">Đặt lịch <strong>dịch vụ</strong> dễ dàng</h2>
            <div className="mt-feature-row" style={{ marginTop: 32 }}>
              {PROCESS.map((p, i) => (
                <div className="mt-feature-item" data-reveal data-delay={String(i + 1)} key={p.title}>
                  <div className="mt-feature-icon"><i className={`bi bi-${p.icon}`} /></div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-stats" aria-label="Số liệu thành tựu">
          <div className="mt-container">
            <div className="mt-stats-grid">
              <StatCounter target={6000} suffix="+" label="PC đã build" />
              <StatCounter target={24} suffix="h" label="Thời gian phản hồi" />
              <StatCounter target={8} suffix=" năm" label="Kinh nghiệm kỹ thuật" />
              <StatCounter target={97} suffix="%" label="Khách hài lòng" />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
