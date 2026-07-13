import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import Contact from '../components/Contact'

const FAQS = [
  {
    q: 'Thời gian giao hàng mất bao lâu?',
    a: 'Đơn hàng nội thành TP.HCM và Hà Nội: giao trong 1-2 ngày. Các tỉnh thành khác: 2-4 ngày làm việc. Đơn hàng đặt trước 12h trưa sẽ được xử lý trong ngày. Bạn sẽ nhận được mã theo dõi đơn hàng qua SMS/email.',
  },
  {
    q: 'Chính sách đổi trả như thế nào?',
    a: 'Chúng tôi chấp nhận đổi trả trong vòng 14 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên tag, chưa giặt và không có dấu hiệu sử dụng. Phí vận chuyển đổi trả do khách chịu, trừ trường hợp lỗi từ chúng tôi.',
  },
  {
    q: 'Làm sao để chọn đúng size?',
    a: 'Chúng tôi có bảng size chi tiết (số đo cụ thể theo cm) trên mỗi trang sản phẩm ở tab "Thông số". Bạn cũng có thể chat với chúng tôi qua Zalo để được tư vấn trực tiếp. Thông thường, nếu bạn nằm giữa 2 size thì chọn size lớn hơn để thoải mái hơn.',
  },
  {
    q: 'Có mua sỉ được không? Chiết khấu bao nhiêu?',
    a: 'Có! Chúng tôi hỗ trợ đặt hàng sỉ cho đại lý và nhà bán lẻ. Mức chiết khấu từ 20-40% tùy số lượng đặt hàng. Vui lòng liên hệ email hoặc gọi hotline để được báo giá chi tiết.',
  },
  {
    q: 'Phương thức thanh toán nào được chấp nhận?',
    a: 'Chúng tôi chấp nhận: Thanh toán khi nhận hàng (COD) và chuyển khoản ngân hàng qua SePay (quét mã QR, xác nhận tự động). Tất cả giao dịch online đều được bảo mật.',
  },
  {
    q: 'Làm sao để theo dõi đơn hàng?',
    a: 'Sau khi đơn hàng được xác nhận, bạn sẽ nhận được SMS/email chứa mã vận đơn. Dùng mã này để tra cứu trên website của đơn vị vận chuyển. Bạn cũng có thể inbox cho chúng tôi qua Zalo/Facebook để được hỗ trợ tra cứu.',
  },
]

export default function ContactPage() {
  const { settings } = useSite()
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <>
      <section className="st-page-hero" aria-label="Tiêu đề trang">
        <div className="st-container">
          <nav className="st-breadcrumb mb-3" aria-label="Điều hướng">
            <Link to="/">Trang chủ</Link>
            <span className="st-breadcrumb-sep">/</span>
            <span>Liên hệ</span>
          </nav>
          <h1 className="st-page-title">Liên Hệ<br />Với Chúng Tôi</h1>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 14, fontWeight: 600, maxWidth: 400, marginTop: 8 }}>
            {settings.contact_intro}
          </p>
        </div>
      </section>

      <Contact />

      <section className="st-sec" style={{ background: 'var(--surface)' }} aria-label="Câu hỏi thường gặp">
        <div className="st-container">
          <div className="row g-5">
            <div className="col-lg-4">
              <div data-reveal>
                <div className="st-eyebrow">FAQ</div>
                <h2 className="st-sec-title">Câu Hỏi<br />Thường Gặp</h2>
                <p className="st-sec-sub">Nếu không tìm thấy câu trả lời, hãy liên hệ trực tiếp với chúng tôi</p>
                {settings.zalo_number && (
                  <div className="mt-4">
                    <a href={`https://zalo.me/${settings.zalo_number}`} className="st-btn st-btn-dark" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-chat-dots" /> Chat Zalo ngay
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-8">
              <div data-reveal data-delay="1">
                {FAQS.map((item, i) => (
                  <div className={`st-faq-item ${openIdx === i ? 'open' : ''}`} key={i}>
                    <button className="st-faq-q" type="button" onClick={() => setOpenIdx(openIdx === i ? -1 : i)} aria-expanded={openIdx === i}>
                      {item.q}
                      <span className="st-faq-icon">+</span>
                    </button>
                    <div className="st-faq-a">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="st-newsletter" aria-label="Đăng ký nhận tin">
        <div className="st-container">
          <div className="st-newsletter-inner">
            <div>
              <h2 className="st-newsletter-heading">Đừng Bỏ Lỡ Ưu Đãi</h2>
              <p className="st-newsletter-sub">Nhận thông báo về sản phẩm mới và flash sale độc quyền</p>
            </div>
            <form className="st-newsletter-form" onSubmit={e => e.preventDefault()} noValidate>
              <input type="email" placeholder="Nhập email của bạn..." aria-label="Email đăng ký" />
              <button type="submit">Đăng Ký</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
