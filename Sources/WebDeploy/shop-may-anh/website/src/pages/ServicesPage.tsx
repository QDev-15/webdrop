import { Link } from 'react-router-dom'
import StatCounter from '../components/StatCounter'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

// Nội dung tĩnh (không quản lý qua admin) — theo đúng precedent đã dùng ở ServicesPage.tsx
// của shop-may-tinh (site shop cùng thế hệ, cùng cấu trúc trang Dịch vụ) — bản thân dich-vu.html
// gốc cũng không có phần nào biến đổi theo season/khuyến mãi nên không cần settings riêng.
const FEATURES = [
  { icon: 'wrench-adjustable', title: 'Sửa chữa & bảo trì', desc: 'Nhận sửa chữa mọi lỗi phần cứng, hiệu chỉnh lấy nét, thay thế linh kiện chính hãng tại chỗ.' },
  { icon: 'droplet-half', title: 'Vệ sinh cảm biến', desc: 'Dịch vụ vệ sinh cảm biến chuyên sâu, loại bỏ bụi bẩn ảnh hưởng đến chất lượng ảnh chụp.' },
  { icon: 'camera-video', title: 'Cho thuê thiết bị', desc: 'Cho thuê thân máy, ống kính, đèn flash theo ngày/tuần — phù hợp cho dự án ngắn hạn.' },
  { icon: 'credit-card-2-front', title: 'Trả góp 0% lãi suất', desc: 'Hỗ trợ trả góp qua thẻ tín dụng và công ty tài chính, duyệt hồ sơ nhanh trong ngày.' },
]

const PROCESS = [
  { icon: '1-circle', title: 'Đặt lịch', desc: 'Liên hệ hotline hoặc form đặt lịch, mô tả tình trạng thiết bị cần xử lý.' },
  { icon: '2-circle', title: 'Kiểm tra & báo giá', desc: 'Kỹ thuật viên kiểm tra, báo giá chi tiết trước khi tiến hành sửa chữa.' },
  { icon: '3-circle', title: 'Nhận máy', desc: 'Nhận lại thiết bị đã được xử lý, kèm phiếu bảo hành dịch vụ.' },
]

export default function ServicesPage() {
  useDocumentMeta({
    title: 'Dịch Vụ — PhotoPro Máy Ảnh & Thiết Bị Nhiếp Ảnh',
    description: 'Dịch vụ sửa chữa, vệ sinh cảm biến, cho thuê thiết bị và trả góp 0% tại PhotoPro.',
  })

  return (
    <>
      <section className="ma-page-hero">
        <div className="ma-container">
          <div className="ma-breadcrumb">
            <Link to="/">Trang chủ</Link><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /><span>Dịch vụ</span>
          </div>
          <h1 className="ma-page-title">Dịch Vụ</h1>
          <p className="ma-page-count">Đồng hành cùng người cầm máy — từ tư vấn đến bảo trì thiết bị</p>
        </div>
      </section>

      <main>
        <section className="ma-sec">
          <div className="ma-container">
            <div className="ma-feature-grid">
              {FEATURES.map((f, i) => (
                <div className="ma-feature" data-reveal data-delay={String(i + 1)} key={f.title}>
                  <div className="ma-feature-icon"><i className={`bi bi-${f.icon}`} /></div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ma-sec ma-sec-alt" aria-labelledby="process-heading">
          <div className="ma-container">
            <div className="ma-sec-header ma-center" data-reveal>
              <div className="ma-eyebrow"><i className="bi bi-signpost-split" /> Quy trình</div>
              <h2 className="ma-sec-title" id="process-heading">Đặt lịch <em>dịch vụ</em> dễ dàng</h2>
              <p className="ma-sec-sub">Chỉ 3 bước đơn giản để mang thiết bị của bạn đến với đội ngũ kỹ thuật viên chuyên sâu.</p>
            </div>
            <div className="ma-feature-grid">
              {PROCESS.map((p, i) => (
                <div className="ma-feature" data-reveal data-delay={String(i + 1)} key={p.title}>
                  <div className="ma-feature-icon"><i className={`bi bi-${p.icon}`} /></div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ma-stats" aria-label="Số liệu">
          <div className="ma-container">
            <div className="ma-stats-grid" data-reveal>
              <StatCounter target={8000} suffix="+" label="Thiết bị đã sửa chữa" />
              <StatCounter target={24} suffix="h" label="Thời gian phản hồi" />
              <StatCounter target={11} suffix=" năm" label="Kinh nghiệm kỹ thuật" />
              <StatCounter target={98} suffix="%" label="Khách hài lòng" />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
