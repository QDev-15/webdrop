import Contact from '../components/Contact'

const FAQS = [
  {
    q: 'Tôi có cần đặt lịch trước không?',
    a: 'Khuyến khích đặt lịch trước để đảm bảo có chỗ và tránh chờ đợi. Khách walk-in vẫn được phục vụ nếu còn slot trống.',
  },
  {
    q: 'Giá có phụ thuộc vào độ dài tóc không?',
    a: 'Có, đặc biệt với các dịch vụ hóa học (uốn, nhuộm, duỗi). Stylist sẽ kiểm tra và báo giá chính xác trước khi thực hiện.',
  },
  {
    q: 'Dịch vụ cạo râu có phù hợp cho người lần đầu thử không?',
    a: 'Hoàn toàn phù hợp! Barber của chúng tôi sẽ hỏi về da bạn và sử dụng sản phẩm phù hợp. Nhiều khách lần đầu đều thích ngay.',
  },
  {
    q: 'Các sản phẩm chăm sóc tóc có tốt không?',
    a: 'Chúng tôi sử dụng sản phẩm từ các thương hiệu uy tín — đảm bảo an toàn và hiệu quả.',
  },
  {
    q: 'Có thể mang ảnh tham khảo đến không?',
    a: 'Rất khuyến khích! Ảnh tham khảo giúp stylist hiểu chính xác phong cách bạn muốn. Gửi ảnh qua Zalo trước cũng được.',
  },
]

export default function LienHePage() {
  return (
    <>
      <section className="tb-page-hero">
        <div className="wd-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="tb-ph-tag">Liên hệ</div>
          <h1 className="tb-ph-title">Chúng tôi ở đây <em>cho bạn</em></h1>
          <p className="tb-ph-sub">Có câu hỏi về dịch vụ hay muốn tư vấn kiểu tóc? Nhắn Zalo — trả lời trong 5 phút.</p>
        </div>
      </section>

      <Contact />

      <section className="sec-pad" style={{ background: 'var(--bg-2)' }}>
        <div className="wd-container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-4" data-reveal>
              <div className="tb-eyebrow">FAQ</div>
              <h2 className="tb-title mb-2" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>Câu hỏi <em>thường gặp</em></h2>
              <p className="tb-sub">Không tìm thấy câu trả lời? Nhắn Zalo cho chúng tôi ngay.</p>
            </div>
            <div className="col-lg-8" data-reveal data-delay="1">
              <div style={{ borderTop: '1px solid rgba(255,255,255,.07)' }}>
                {FAQS.map((f, i) => (
                  <div className="tb-faq-item" style={{ padding: '22px 0', borderBottom: i === FAQS.length - 1 ? 'none' : '1px solid rgba(255,255,255,.07)' }} key={f.q}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{f.q}</div>
                    <p style={{ fontSize: 13.5, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, margin: 0 }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
