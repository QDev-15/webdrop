import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Testimonial } from '../contexts/SiteContext'
import HeroSlider from '../components/HeroSlider'
import ProductsPage from './ProductsPage'

const FAQS = [
  { q: 'Sản phẩm có kiểm định an toàn không?', a: 'Có. 100% sản phẩm tại Pet Haus đều có tem nguồn gốc/kiểm định trước khi lên kệ, ưu tiên các thương hiệu được bác sĩ thú y khuyên dùng.' },
  { q: 'Thời gian giao hàng mất bao lâu?', a: 'Nội thành các thành phố lớn: 1-2 ngày. Các tỉnh khác: 2-4 ngày làm việc. Đơn từ 400.000₫ được miễn phí vận chuyển.' },
  { q: 'Tôi có thể đổi trả nếu bé cưng không hợp sản phẩm không?', a: 'Được. Đổi trả miễn phí trong 7 ngày với sản phẩm còn nguyên tem, chưa qua sử dụng (riêng thức ăn đã mở gói không áp dụng đổi trả vì lý do vệ sinh).' },
  { q: 'Hình thức thanh toán nào được hỗ trợ?', a: 'Thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, hoặc ví điện tử. Thông tin chi tiết hiển thị ở bước thanh toán.' },
  { q: 'Làm sao chọn đúng kích cỡ phụ kiện/chuồng cho thú cưng?', a: 'Mỗi sản phẩm đều có bảng thông số kích cỡ trong phần "Thông số" ở trang chi tiết. Nếu chưa chắc chắn, hãy nhắn Zalo cho đội ngũ tư vấn để được hỗ trợ đo & chọn size phù hợp.' },
  { q: 'Pet Haus có bán sỉ/đại lý không?', a: 'Có chương trình hợp tác đại lý & bán sỉ cho các cửa hàng thú cưng, phòng khám thú y. Vui lòng liên hệ qua trang Liên hệ để được báo giá riêng.' },
]

export default function HomePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqOpen, setFaqOpen] = useState(0)

  useDocumentMeta({
    title: 'Pet Haus — Cửa hàng thú cưng chính hãng cho chó & mèo',
    description: 'Pet Haus — 42 sản phẩm thú cưng chính hãng: thức ăn, phụ kiện, đồ chơi, chuồng nhà & chăm sóc cho chó mèo. Nguồn gốc rõ ràng, giao hàng toàn quốc.',
  })

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setTestimonials).catch(() => {})
  }, [])

  return (
    <>
      <HeroSlider />

      <ProductsPage />

      {/* FEATURE-ICON-ROW */}
      <section className="tc-sec tc-sec-alt">
        <div className="tc-container">
          <div className="tc-sec-header tc-center" data-reveal>
            <div className="tc-eyebrow" style={{ color: 'var(--accent-h)' }}>Vì sao chọn Pet Haus</div>
            <h2 className="tc-sec-title">An tâm chăm sóc <em>bé cưng</em> mỗi ngày</h2>
            <p className="tc-sec-sub">Từng sản phẩm đều được kiểm định nguồn gốc và tư vấn bởi đội ngũ am hiểu thú cưng.</p>
          </div>
          <div className="tc-feature-grid">
            <div className="tc-feature" data-reveal data-delay="1">
              <div className="tc-feature-icon">🚚</div>
              <h3>Giao hàng toàn quốc</h3>
              <p>Miễn phí vận chuyển cho đơn từ 400.000₫, giao nhanh 1-3 ngày.</p>
            </div>
            <div className="tc-feature" data-reveal data-delay="2">
              <div className="tc-feature-icon">🩺</div>
              <h3>Nguồn gốc rõ ràng</h3>
              <p>100% sản phẩm có tem kiểm định, ưu tiên thương hiệu được bác sĩ thú y khuyên dùng.</p>
            </div>
            <div className="tc-feature" data-reveal data-delay="3">
              <div className="tc-feature-icon">↩️</div>
              <h3>Đổi trả dễ dàng</h3>
              <p>Đổi trả trong 7 ngày nếu sản phẩm lỗi hoặc bé cưng không hợp.</p>
            </div>
            <div className="tc-feature" data-reveal data-delay="4">
              <div className="tc-feature-icon">💬</div>
              <h3>Tư vấn tận tâm</h3>
              <p>Đội ngũ hỗ trợ hiểu về dinh dưỡng & chăm sóc thú cưng, phản hồi nhanh trong ngày.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LIST-ELEGANT — Testimonials */}
      <section className="tc-sec">
        <div className="tc-container">
          <div className="tc-sec-header tc-center" data-reveal>
            <div className="tc-eyebrow">Khách hàng nói gì</div>
            <h2 className="tc-sec-title">Hàng nghìn <em>&quot;con sen&quot;</em> tin tưởng</h2>
          </div>
          <div className="tc-list-elegant" style={{ maxWidth: 820, margin: '0 auto' }} data-reveal>
            {testimonials.map(t => (
              <div className="tc-list-item" key={t.id}>
                <img className="tc-list-avatar" src={t.author_avatar} alt={`Chân dung ${t.author_name}`} loading="lazy" />
                <div>
                  <p className="tc-list-quote">{t.content}</p>
                  <div className="tc-list-name">{t.author_name}</div>
                  <div className="tc-list-role">{t.author_role}</div>
                </div>
                <div className="tc-list-stars">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="tc-sec tc-sec-alt">
        <div className="tc-container">
          <div className="tc-sec-header tc-center" data-reveal>
            <div className="tc-eyebrow">Giải đáp thắc mắc</div>
            <h2 className="tc-sec-title">Câu hỏi <em>thường gặp</em></h2>
          </div>
          <div className="tc-faq" data-reveal>
            {FAQS.map((item, i) => (
              <div className={'tc-faq-item' + (faqOpen === i ? ' open' : '')} key={item.q}>
                <button className="tc-faq-q" onClick={() => setFaqOpen(o => o === i ? -1 : i)}>{item.q} <span className="tc-faq-icon">+</span></button>
                <div className="tc-faq-a"><div className="tc-faq-a-inner">{item.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
