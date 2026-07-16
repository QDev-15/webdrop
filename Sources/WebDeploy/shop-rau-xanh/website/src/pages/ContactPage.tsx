import { useState } from 'react'
import { Link } from 'react-router-dom'
import Contact from '../components/Contact'

const FAQS = [
  { q: 'Rau có được giao trong ngày không?', a: 'Có. Nếu bạn đặt hàng trước 10:00 sáng, đơn hàng sẽ được giao ngay trong chiều cùng ngày ở khu vực nội thành. Đơn đặt sau 10:00 sẽ được giao vào sáng hôm sau.' },
  { q: 'Làm sao để biết rau thật sự hữu cơ?', a: 'Mỗi nông trại liên kết với Vườn Xanh đều có chứng nhận VietGAP và được kiểm nghiệm dư lượng thuốc bảo vệ thực vật định kỳ tại phòng lab độc lập. Bạn có thể xem mã lô hàng in trên bao bì để tra cứu nguồn gốc.' },
  { q: 'Nếu rau không tươi thì đổi trả thế nào?', a: 'Bạn chỉ cần chụp ảnh sản phẩm và liên hệ trong vòng 24h sau khi nhận hàng. Vườn Xanh sẽ hoàn tiền hoặc giao lại sản phẩm mới miễn phí, tùy theo yêu cầu của bạn.' },
  { q: 'Có thể đặt rau theo mùa số lượng lớn không?', a: 'Có. Với đơn hàng số lượng lớn cho nhà hàng, quán ăn hoặc sự kiện, vui lòng liên hệ hotline để được báo giá riêng và lên lịch giao phù hợp.' },
]

export default function ContactPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <main>
      <div className="rx-container rx-contact-section" style={{ paddingBottom: 0 }}>
        <nav className="rx-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Liên hệ</span>
        </nav>
      </div>

      <Contact />

      <div className="rx-container">
        <div className="rx-faq">
          <div className="rx-eyebrow" data-reveal>Giải đáp nhanh</div>
          <h2 className="rx-sec-title" data-reveal data-delay="1">Câu hỏi <strong>thường gặp</strong></h2>

          <div style={{ maxWidth: 760, marginTop: 24 }}>
            {FAQS.map((item, i) => (
              <div key={i} className={`rx-faq-item${openIdx === i ? ' open' : ''}`}>
                <button className="rx-faq-q" onClick={() => setOpenIdx(openIdx === i ? null : i)} aria-expanded={openIdx === i}>
                  {item.q}
                  <span className="rx-faq-icon">+</span>
                </button>
                <div className="rx-faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
