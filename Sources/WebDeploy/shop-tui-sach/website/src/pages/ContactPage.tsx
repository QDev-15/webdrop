import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import Contact from '../components/Contact'

const FAQS = [
  { q: 'Sản phẩm có được bảo hành không?', a: 'Tất cả sản phẩm tại Maison Cuir được bảo hành trọn đời — bao gồm sửa chữa khóa, chỉ may và đánh bóng da miễn phí trong suốt vòng đời sản phẩm.' },
  { q: 'Thời gian giao hàng mất bao lâu?', a: 'Đơn hàng nội thành giao trong 1-2 ngày, các tỉnh thành khác từ 2-4 ngày làm việc kể từ khi xác nhận đơn.' },
  { q: 'Tôi có thể đổi trả sản phẩm không?', a: 'Có, bạn có thể đổi trả trong vòng 30 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên tem mác và chưa qua sử dụng.' },
  { q: 'Da sử dụng có phải da thật 100% không?', a: 'Đúng vậy, toàn bộ sản phẩm được làm từ da bò thật nguyên miếng, nhập khẩu và thuộc theo tiêu chuẩn Ý.' },
  { q: 'Có hỗ trợ trả góp không?', a: 'Có, chúng tôi hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng cho đơn hàng từ 3.000.000đ trở lên.' },
]

export default function ContactPage() {
  const { settings } = useSite()
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <>
      <section className="ts-page-header">
        <div className="ts-container">
          <h1>Liên hệ với chúng tôi</h1>
          <div className="ts-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span className="current">Liên hệ</span>
          </div>
        </div>
      </section>

      <section className="ts-quick-contact">
        <div className="ts-container">
          <div className="ts-quick-contact-row">
            <div className="ts-quick-contact-item">
              <i className="bi bi-telephone" />
              <div><strong>Hotline</strong><span>{settings.site_phone}</span></div>
            </div>
            <div className="ts-quick-contact-item">
              <i className="bi bi-envelope" />
              <div><strong>Email</strong><span>{settings.site_email}</span></div>
            </div>
            <div className="ts-quick-contact-item">
              <i className="bi bi-clock" />
              <div><strong>Giờ làm việc</strong><span>{settings.working_hours}</span></div>
            </div>
          </div>
        </div>
      </section>

      <Contact />

      <section className="sec-pad" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="ts-container" style={{ maxWidth: 820 }}>
          <div className="ts-sec-head center" data-reveal>
            <div className="ts-eyebrow">Câu hỏi thường gặp</div>
            <h2 className="ts-sec-title">Giải đáp <em>thắc mắc</em></h2>
          </div>

          <div data-reveal>
            {FAQS.map((item, i) => (
              <div className={`ts-faq-item${openIdx === i ? ' open' : ''}`} key={item.q}>
                <button className="ts-faq-q" onClick={() => setOpenIdx(openIdx === i ? null : i)} aria-expanded={openIdx === i}>
                  <span>{item.q}</span>
                  <i className="bi bi-plus" />
                </button>
                <div className="ts-faq-a"><p>{item.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ts-cta-section sec-pad">
        <div className="ts-container">
          <div className="ts-cta-row">
            <div className="ts-cta-text" data-reveal>
              <div className="ts-eyebrow">Ghé thăm chúng tôi</div>
              <h2>Trải nghiệm sản phẩm <em>trực tiếp</em> tại showroom</h2>
              <p>Đến showroom để được tư vấn trực tiếp, trải nghiệm chất liệu da thật và thử form dáng phù hợp với phong cách của bạn.</p>
              <a href={`tel:${(settings.site_phone || '').replace(/\s/g, '')}`} className="ts-btn solid">Gọi ngay {settings.site_phone}</a>
            </div>
            <div className="ts-cta-img-grid" data-reveal data-reveal-d1>
              <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80" alt="Không gian showroom trưng bày túi da cao cấp" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1591084728795-1149f32d9866?w=500&auto=format&fit=crop&q=80" alt="Nghệ nhân đang chế tác túi da thủ công" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=80" alt="Chi tiết đường may túi da cao cấp" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
