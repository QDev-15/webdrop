import { useEffect, useState } from 'react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const TIMELINE = [
  { year: '2014', title: 'Cửa hàng đầu tiên', desc: 'Mộc Vang mở cửa hàng đầu tiên tại Quận 1, TP.HCM với hơn 30 nhãn hiệu vang nhập khẩu từ Pháp & Ý.' },
  { year: '2017', title: 'Mở kho lạnh chuẩn quốc tế', desc: 'Đầu tư kho lưu trữ kiểm soát nhiệt độ 14–16°C, độ ẩm 65–75% theo tiêu chuẩn cellar châu Âu.' },
  { year: '2019', title: 'Mở rộng ra Hà Nội', desc: 'Thành lập chi nhánh & kho lạnh thứ hai tại Hà Nội, phục vụ khách hàng khu vực phía Bắc.' },
  { year: '2022', title: 'Ra mắt kênh bán online', desc: 'Triển khai nền tảng đặt hàng trực tuyến, giao nhanh 2 giờ nội thành cho khách hàng TP.HCM & Hà Nội.' },
  { year: '2026', title: 'Hơn 200 nhãn hiệu, 7 quốc gia', desc: 'Danh mục mở rộng lên hơn 200 nhãn hiệu vang từ 7 quốc gia, phục vụ hơn 12.800 khách hàng.' },
]

const TEAM = [
  { name: 'Nguyễn Anh Khoa', role: 'Sommelier trưởng', image: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&auto=format&fit=crop&q=80' },
  { name: 'Trần Bảo Ngọc', role: 'Quản lý kho lạnh', image: 'https://images.unsplash.com/photo-1543132220-3ec99c6094dc?w=400&auto=format&fit=crop&q=80' },
  { name: 'Lê Minh Đức', role: 'Chuyên gia nhập khẩu', image: 'https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?w=400&auto=format&fit=crop&q=80' },
  { name: 'Phạm Thùy Linh', role: 'Tư vấn khách hàng', image: 'https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=400&auto=format&fit=crop&q=80' },
]

const FAQS = [
  { q: 'Làm sao để chọn rượu vang phù hợp với món ăn?', a: 'Nguyên tắc cơ bản: vang đỏ tannin cao hợp với thịt đỏ, vang trắng chua nhẹ hợp hải sản & khai vị, vang sủi hợp món chiên/tiệc nhẹ. Đội ngũ sommelier của Mộc Vang luôn sẵn sàng tư vấn miễn phí theo thực đơn cụ thể của bạn qua điện thoại hoặc Zalo.' },
  { q: 'Rượu vang cần bảo quản như thế nào sau khi mua?', a: 'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng và nhiệt độ dao động lớn, lý tưởng 14–16°C. Với chai có nút bần, nên đặt nằm ngang để nút không bị khô, tránh không khí lọt vào làm oxy hóa rượu.' },
  { q: 'Mộc Vang có giao hàng toàn quốc không? Mất bao lâu?', a: 'Có. Nội thành Hà Nội & TP.HCM giao trong 2 giờ nếu đặt trước 17h. Các tỉnh thành khác giao trong 2–4 ngày làm việc bằng xe chuyên dụng chống sốc, chống nóng để đảm bảo chất lượng rượu.' },
  { q: 'Chính sách đổi trả nếu chai vang bị vỡ hoặc lỗi vận chuyển?', a: 'Mộc Vang hỗ trợ đổi trả miễn phí trong vòng 24 giờ kể từ khi nhận hàng nếu sản phẩm bị vỡ, sai mẫu hoặc lỗi do quá trình vận chuyển. Vui lòng giữ nguyên bao bì, chụp ảnh hiện trạng và liên hệ hotline ngay khi phát hiện.' },
  { q: 'Làm sao biết vang là hàng chính hãng, không phải hàng trôi nổi?', a: 'Mọi sản phẩm tại Mộc Vang đều có tem phụ tiếng Việt, hóa đơn chứng từ nhập khẩu (C/O, C/Q) đầy đủ và có thể tra cứu theo từng lô hàng. Chúng tôi nhập khẩu trực tiếp từ nhà làm rượu, không qua trung gian không rõ nguồn gốc.' },
  { q: 'Có cần xác nhận độ tuổi khi nhận hàng không?', a: 'Có. Theo quy định pháp luật, shipper có quyền yêu cầu xuất trình giấy tờ tùy thân để xác minh người nhận đã đủ 18 tuổi trước khi giao hàng. Đơn hàng sẽ không được giao nếu không xác minh được độ tuổi.' },
  { q: 'Có hỗ trợ xuất hóa đơn VAT cho doanh nghiệp mua quà tặng không?', a: 'Có. Với đơn hàng số lượng lớn hoặc mua làm quà tặng doanh nghiệp, vui lòng cung cấp thông tin xuất hóa đơn khi đặt hàng hoặc liên hệ trực tiếp bộ phận CSKH để được hỗ trợ nhanh nhất.' },
  { q: 'Vang đã mở nắp bảo quản được bao lâu?', a: 'Vang đỏ/trắng đã mở nên dùng trong 3–5 ngày (đậy kín, để tủ lạnh với vang trắng), vang sủi nên dùng trong 1–2 ngày với nút chặn chuyên dụng để giữ ga. Hương vị sẽ giảm dần theo thời gian sau khi tiếp xúc với không khí.' },
]

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const step = Math.ceil(value / 60)
    let cur = 0
    const t = setInterval(() => {
      cur = Math.min(cur + step, value)
      setDisplay(cur)
      if (cur >= value) clearInterval(t)
    }, 25)
    return () => clearInterval(t)
  }, [value])
  return (
    <div data-reveal>
      <div className="rv-stat-num">{display}{suffix}</div>
      <div className="rv-stat-label">{label}</div>
    </div>
  )
}

export default function AboutPage() {
  useDocumentMeta({
    title: 'Giới thiệu — Mộc Vang',
    description: 'Mộc Vang — nhà nhập khẩu & phân phối rượu vang chính hãng tại Việt Nam. Tìm hiểu câu chuyện, hành trình phát triển & đội ngũ của chúng tôi.',
  })
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  return (
    <>
      <section className="rv-page-hero">
        <div className="rv-page-hero-bg"><img src="https://images.unsplash.com/photo-1567590997610-cca4b1fd9027?w=1600&auto=format&fit=crop&q=80" alt="" /></div>
        <div className="wd-container rv-page-hero-content">
          <div className="rv-eyebrow">Câu chuyện của chúng tôi</div>
          <h1>Về Mộc Vang</h1>
          <p>Mộc Vang là cầu nối giữa những nhà làm rượu tâm huyết trên thế giới và người yêu vang tại Việt Nam — mang đến trải nghiệm rượu vang chính hãng, minh bạch và dễ tiếp cận.</p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="rv-strip" data-reveal>
            <div className="rv-strip-img"><img src="https://images.unsplash.com/photo-1637181156153-bedd1098f8c1?w=800&auto=format&fit=crop&q=80" alt="Khởi đầu từ đam mê rượu vang" loading="lazy" /></div>
            <div className="rv-strip-body">
              <div className="rv-strip-num">01</div>
              <h3>Khởi đầu từ đam mê,<br />không phải phong trào</h3>
              <p>Mộc Vang thành lập năm 2014 bởi một nhóm nhỏ những người yêu rượu vang, xuất phát từ mong muốn đơn giản: mang những chai vang thật sự chất lượng — không pha trộn, không hàng trôi nổi — đến gần hơn với người Việt.</p>
              <p>Từ một cửa hàng nhỏ tại TP.HCM, đến nay Mộc Vang đã có mặt tại 2 thành phố lớn với kho lạnh đạt chuẩn quốc tế.</p>
            </div>
          </div>
          <div className="rv-strip reverse" data-reveal>
            <div className="rv-strip-body">
              <div className="rv-strip-num">02</div>
              <h3>Đội ngũ sommelier<br />đồng hành cùng bạn</h3>
              <p>Mỗi đơn hàng đều có thể được tư vấn bởi đội ngũ sommelier được đào tạo bài bản — từ việc chọn vang hợp món ăn, hợp dịp, cho đến cách khai chai và thưởng thức đúng cách.</p>
              <ul>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 6 9 17l-5-5" /></svg> Tư vấn miễn phí qua điện thoại, Zalo, tại cửa hàng</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 6 9 17l-5-5" /></svg> Hướng dẫn bảo quản & phối món chi tiết theo từng chai</li>
              </ul>
            </div>
            <div className="rv-strip-img"><img src="https://images.unsplash.com/photo-1558138818-34316d616e44?w=800&auto=format&fit=crop&q=80" alt="Đội ngũ sommelier tư vấn khách hàng" loading="lazy" /></div>
          </div>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="wd-container" style={{ maxWidth: 760 }}>
          <div className="rv-sec-head" data-reveal>
            <div className="rv-eyebrow">Hành trình phát triển</div>
            <h2 className="rv-sec-title">10 năm <span>xây dựng niềm tin</span></h2>
          </div>
          <div className="rv-timeline" data-reveal data-delay="1">
            {TIMELINE.map(item => (
              <div className="rv-timeline-item" key={item.year}>
                <div className="rv-timeline-dot"></div>
                <div className="rv-timeline-year">{item.year}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rv-statbar">
        <div className="wd-container rv-stats-grid">
          <Stat value={2} suffix=" kho" label="Kho lạnh chuẩn 16°C" />
          <Stat value={40} suffix="+" label="Nhà làm rượu đối tác" />
          <Stat value={98} suffix="%" label="Khách hàng hài lòng" />
          <Stat value={10} suffix="+" label="Năm kinh nghiệm" />
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="rv-sec-head center" data-reveal>
            <div className="rv-eyebrow">Con người Mộc Vang</div>
            <h2 className="rv-sec-title">Đội ngũ <span>đồng hành</span></h2>
          </div>
          <div className="row g-4">
            {TEAM.map((m, i) => (
              <div className="col-6 col-lg-3" data-reveal data-delay={String(i)} key={m.name}>
                <div className="rv-testi-avatar" style={{ width: '100%', height: 220, borderRadius: 8, marginBottom: 14 }}>
                  <img src={m.image} alt={m.role} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="rv-testi-name">{m.name}</div>
                <div className="rv-testi-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="wd-container">
          <div className="rv-sec-head center" data-reveal>
            <div className="rv-eyebrow">Giải đáp thắc mắc</div>
            <h2 className="rv-sec-title">Câu hỏi <span>thường gặp</span></h2>
          </div>
          <div className="rv-faq" data-reveal data-delay="1">
            {FAQS.map((item, i) => (
              <div className={'rv-faq-item' + (faqOpen === i ? ' open' : '')} key={item.q}>
                <button className="rv-faq-q" onClick={() => setFaqOpen(o => o === i ? null : i)}>
                  <span>{item.q}</span><span className="rv-faq-plus">+</span>
                </button>
                <div className="rv-faq-a"><p>{item.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
