import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const TIMELINE = [
  { year: '2011', text: 'Xưởng chế tác bạc VIOLETTE thành lập tại TP.HCM với 4 thợ kim hoàn lành nghề, chuyên trang sức bạc 925.' },
  { year: '2015', text: 'Ra mắt dòng sản phẩm vàng 18K đính đá CZ cao cấp, mở rộng cửa hàng trưng bày đầu tiên.' },
  { year: '2019', text: 'Đạt cột mốc 20.000 khách hàng, ra mắt bộ sưu tập đá quý tự nhiên có giấy kiểm định độc lập.' },
  { year: '2023', text: 'Mở rộng lên 3 cửa hàng trưng bày tại TP.HCM, Hà Nội và Đà Nẵng, ra mắt kênh bán hàng trực tuyến toàn quốc.' },
  { year: '2026', text: 'Vượt mốc 48.000 khách hàng tin dùng, giới thiệu chính sách bảo hành trọn đời cho toàn bộ khung trang sức.' },
]

const FAQS = [
  { q: 'Trang sức VIOLETTE có mức giá dao động như thế nào?', a: 'Giá sản phẩm dao động từ 290.000₫ (bông tai đính đá CZ cơ bản) đến 32.000.000₫ (bộ trang sức vàng 24K cao cấp), tùy chất liệu, trọng lượng và loại đá quý sử dụng. Mỗi sản phẩm đều niêm yết giá công khai, không phát sinh chi phí ẩn.' },
  { q: 'Làm sao để biết trang sức có phải đá quý thật hay không?', a: 'Toàn bộ sản phẩm gắn đá quý tự nhiên (thạch anh, ngọc bích, ruby, sapphire, opal...) đều đi kèm giấy kiểm định độc lập từ trung tâm giám định uy tín. Sản phẩm đính đá CZ (Cubic Zirconia) được ghi rõ trong mô tả, không nhầm lẫn với đá quý tự nhiên.' },
  { q: 'Chính sách bảo hành và đổi trả như thế nào?', a: 'VIOLETTE bảo hành trọn đời cho khung trang sức (lỗi kỹ thuật, bung khớp, xỉn màu do lỗi nhà sản xuất), đổi size hoặc đổi sản phẩm khác miễn phí trong 30 ngày kể từ ngày mua nếu còn nguyên tem, hóa đơn.' },
  { q: 'Thời gian giao hàng mất bao lâu?', a: 'Đơn hàng nội thành TP.HCM và Hà Nội giao trong 1-2 ngày làm việc. Các tỉnh thành khác giao trong 3-5 ngày làm việc. Sản phẩm khắc tên/chữ cái theo yêu cầu cần thêm 1-2 ngày chế tác.' },
  { q: 'Tôi có thể thanh toán bằng những hình thức nào?', a: 'VIOLETTE hỗ trợ thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay) và quẹt thẻ trực tiếp tại cửa hàng trưng bày. Hóa đơn VAT được xuất theo yêu cầu.' },
  { q: 'Sau khi mua hàng, tôi có được hỗ trợ bảo dưỡng không?', a: 'Khách hàng được đánh bóng, làm mới sản phẩm miễn phí 1 lần/năm tại bất kỳ cửa hàng trưng bày nào của VIOLETTE. Vui lòng mang theo hóa đơn mua hàng hoặc thông tin đơn hàng để được hỗ trợ nhanh chóng.' },
  { q: 'VIOLETTE có nhận thiết kế trang sức theo yêu cầu không?', a: 'Có. Với các đơn hàng từ 5.000.000₫ trở lên, đội ngũ thiết kế của VIOLETTE có thể tư vấn và chế tác trang sức theo yêu cầu riêng (khắc tên, chọn đá quý, điều chỉnh kích thước). Vui lòng liên hệ trực tiếp để được tư vấn chi tiết.' },
]

export default function AboutPage() {
  useDocumentMeta({
    title: 'Giới thiệu — VIOLETTE Fine Jewelry',
    description: 'Câu chuyện thương hiệu VIOLETTE — 15 năm chế tác trang sức bạc 925, vàng 18K/24K và đá quý tự nhiên tại Việt Nam.',
  })
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  return (
    <>
      <section className="tr-page-head">
        <div className="tr-container">
          <div className="tr-breadcrumb"><Link to="/">Trang chủ</Link> / <span>Giới thiệu</span></div>
          <h1>Câu chuyện của VIOLETTE</h1>
          <p className="tr-page-head-sub">Hành trình 15 năm chế tác những món trang sức mang dấu ấn riêng, tôn vinh vẻ đẹp tinh tế của người phụ nữ Việt.</p>
        </div>
      </section>

      <section className="tr-pad">
        <div className="tr-container">
          <div className="tr-strip" data-reveal>
            <div className="tr-strip-img"><img src="https://images.unsplash.com/photo-1580582202907-d01fd0bd4c87?w=900&auto=format&fit=crop&q=80" alt="Xưởng chế tác trang sức VIOLETTE" loading="lazy" /></div>
            <div className="tr-strip-text">
              <div className="tr-eyebrow">Khởi nguồn</div>
              <h3>Từ Một <em>Xưởng Nhỏ</em> Đến Thương Hiệu Được Tin Yêu</h3>
              <p>VIOLETTE ra đời năm 2011 từ một xưởng chế tác bạc nhỏ tại TP.HCM, với mong muốn mang đến những món trang sức chất lượng cao nhưng vẫn phù hợp túi tiền của phụ nữ Việt. Sau 15 năm, chúng tôi đã phục vụ hơn 48.000 khách hàng trên toàn quốc.</p>
              <p>Mỗi sản phẩm mang tên VIOLETTE đều được kiểm soát chất lượng nghiêm ngặt qua từng công đoạn — từ chọn nguyên liệu, chế tác, gắn đá đến đánh bóng hoàn thiện.</p>
            </div>
          </div>
          <div className="tr-strip" data-reveal>
            <div className="tr-strip-img"><img src="https://images.unsplash.com/photo-1660860547079-fd4845880af9?w=900&auto=format&fit=crop&q=80" alt="Nghệ nhân chế tác trang sức VIOLETTE" loading="lazy" /></div>
            <div className="tr-strip-text">
              <div className="tr-eyebrow">Cam kết</div>
              <h3>Chất Lượng Là <em>Danh Dự</em></h3>
              <p>Chúng tôi cam kết 100% sản phẩm đá quý tự nhiên đều có giấy kiểm định rõ ràng, vàng 18K/24K đúng hàm lượng công bố. Chính sách bảo hành trọn đời và đổi trả 30 ngày là minh chứng cho sự tự tin vào chất lượng sản phẩm.</p>
              <p>VIOLETTE hiện có mặt tại 3 cửa hàng trưng bày và phục vụ khách hàng toàn quốc qua kênh trực tuyến, với đội ngũ tư vấn viên được đào tạo chuyên sâu về đá quý và kim hoàn.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tr-stat-bar tr-pad-sm">
        <div className="tr-container tr-stat-grid">
          <div data-reveal><div className="tr-stat-num">15+</div><div className="tr-stat-label">Năm kinh nghiệm</div></div>
          <div data-reveal data-reveal-d1><div className="tr-stat-num">48.000+</div><div className="tr-stat-label">Khách hàng tin dùng</div></div>
          <div data-reveal data-reveal-d2><div className="tr-stat-num">3</div><div className="tr-stat-label">Cửa hàng trưng bày</div></div>
          <div data-reveal data-reveal-d3><div className="tr-stat-num">320+</div><div className="tr-stat-label">Mẫu thiết kế</div></div>
        </div>
      </section>

      <section className="tr-pad">
        <div className="tr-container">
          <div className="tr-sec-head center" data-reveal>
            <div className="tr-eyebrow" style={{ justifyContent: 'center' }}>Hành trình</div>
            <h2 className="tr-sec-title">Những cột mốc <em>đáng nhớ</em></h2>
          </div>
          <div className="tr-timeline" data-reveal style={{ maxWidth: 680, margin: '0 auto' }}>
            {TIMELINE.map(item => (
              <div className="tr-timeline-item" key={item.year}>
                <div className="tr-timeline-year">{item.year}</div>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tr-pad tr-theme-section">
        <div className="tr-container" style={{ maxWidth: 900 }}>
          <div className="tr-sec-head center" data-reveal>
            <div className="tr-eyebrow" style={{ justifyContent: 'center' }}>Giải đáp thắc mắc</div>
            <h2 className="tr-sec-title">Câu hỏi <em>thường gặp</em></h2>
          </div>
          <div data-reveal>
            {FAQS.map((item, i) => (
              <div className={'tr-faq-item' + (faqOpen === i ? ' open' : '')} key={item.q}>
                <button className="tr-faq-q" aria-expanded={faqOpen === i} onClick={() => setFaqOpen(o => o === i ? null : i)}>
                  {item.q}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M12 5v14M5 12h14" /></svg>
                </button>
                <div className="tr-faq-a"><div className="tr-faq-a-inner">{item.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
