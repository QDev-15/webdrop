import { useState } from 'react'
import { Link } from 'react-router-dom'
import Contact from '../components/Contact'

const FAQS = [
  { q: 'Rau củ có thực sự không thuốc bảo vệ thực vật?', a: 'Có. Mọi lô hàng đều được xét nghiệm dư lượng thuốc bảo vệ thực vật tại phòng lab độc lập trước khi nhập kho, kết quả được lưu và có thể tra cứu qua mã QR trên bao bì.' },
  { q: 'Thời gian giao hàng là bao lâu?', a: 'Đơn hàng nội thành được giao trong 2–4 giờ bằng xe lạnh chuyên dụng. Khu vực ngoại thành và tỉnh lân cận giao trong 1–2 ngày.' },
  { q: 'Chính sách đổi trả như thế nào?', a: 'Nếu sản phẩm không đạt chất lượng như công bố, bạn có thể yêu cầu đổi trả hoặc hoàn tiền 100% trong vòng 24 giờ kể từ khi nhận hàng.' },
  { q: 'Có thể xem thông tin nông trại của từng sản phẩm không?', a: 'Có. Mỗi sản phẩm đều có mã QR truy xuất nguồn gốc, cho biết nông trại, ngày thu hoạch và kết quả kiểm định chất lượng.' },
]

export default function ContactPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <>
      <div className="tp-container" style={{ paddingTop: 128 }}>
        <div className="tp-breadcrumb" style={{ marginBottom: 24 }}>
          <Link to="/">Trang chủ</Link>
          <i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
          <span>Liên hệ</span>
        </div>
      </div>

      <Contact />

      <section className="tp-sec tp-faq-bg">
        <div className="tp-container">
          <div className="tp-sec-header tp-center" data-reveal>
            <div className="tp-eyebrow"><i className="bi bi-question-circle" /> Hỏi đáp</div>
            <h2 className="tp-sec-title">Câu hỏi <em>thường gặp</em></h2>
          </div>
          <div className="tp-faq-list" data-reveal>
            {FAQS.map((item, i) => (
              <div key={i} className={`tp-faq-item${openIdx === i ? ' open' : ''}`}>
                <button className="tp-faq-q" onClick={() => setOpenIdx(openIdx === i ? null : i)} aria-expanded={openIdx === i}>
                  {item.q}
                  <span className="tp-faq-icon"><i className="bi bi-plus" /></span>
                </button>
                <div className="tp-faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
