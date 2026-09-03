import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let cur = 0
        const step = Math.ceil(target / 60) || 1
        const t = setInterval(() => {
          cur = Math.min(cur + step, target)
          setValue(cur)
          if (cur >= target) clearInterval(t)
        }, 25)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{value.toLocaleString('vi-VN')}{suffix}</span>
}

export default function AboutPage() {
  useDocumentMeta({
    title: 'Giới thiệu — MERIDIAN',
    description: 'MERIDIAN — nhà phân phối đồng hồ chính hãng đa thương hiệu, cam kết nguồn gốc rõ ràng, quy trình kiểm định nghiêm ngặt, bảo hành đầy đủ.',
  })

  return (
    <>
      <section className="dh-catalog-header">
        <div className="dh-container">
          <div className="dh-breadcrumb"><Link to="/">Trang chủ</Link> / <span>Giới thiệu</span></div>
          <h1>Về MERIDIAN</h1>
          <p>Nhà phân phối đồng hồ chính hãng đa thương hiệu — minh bạch nguồn gốc, tận tâm với từng khách hàng</p>
        </div>
      </section>

      <section className="dh-sec">
        <div className="dh-container">
          <div className="dh-strip" data-reveal>
            <div className="dh-strip-media"><img src="https://images.unsplash.com/photo-1622704776938-bed6cd156e04?w=900&auto=format&fit=crop&q=80" alt="Showroom MERIDIAN" /></div>
            <div className="dh-strip-text">
              <p className="dh-eyebrow">Câu chuyện của chúng tôi</p>
              <h3>Từ đam mê cơ khí đến hệ thống phân phối tin cậy</h3>
              <p>MERIDIAN khởi đầu từ một cửa hàng nhỏ chuyên sửa chữa và tư vấn đồng hồ tại TP.HCM. Nhận thấy thị trường thiếu một địa chỉ đáng tin cậy để mua đồng hồ chính hãng với giá minh bạch, chúng tôi xây dựng MERIDIAN trở thành nhà phân phối ủy quyền của hơn 10 thương hiệu quốc tế.</p>
              <p>Đến nay, MERIDIAN đã phục vụ hơn 8.500 khách hàng trên toàn quốc, với hệ thống showroom tại TP.HCM, Hà Nội và Đà Nẵng.</p>
            </div>
          </div>

          <div className="dh-strip reverse" data-reveal>
            <div className="dh-strip-media"><img src="https://images.unsplash.com/photo-1660860547079-fd4845880af9?w=900&auto=format&fit=crop&q=80" alt="Cam kết chính hãng MERIDIAN" /></div>
            <div className="dh-strip-text">
              <p className="dh-eyebrow">Cam kết chính hãng</p>
              <h3>Minh bạch từ nguồn gốc đến tay khách hàng</h3>
              <p>Mọi sản phẩm tại MERIDIAN đều được nhập khẩu trực tiếp từ nhà phân phối ủy quyền tại nước sở tại hoặc chính hãng tại Việt Nam — không qua trung gian không rõ nguồn gốc.</p>
              <ul className="dh-strip-list">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M20 6L9 17l-5-5" /></svg>Hóa đơn VAT đầy đủ cho mọi đơn hàng</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M20 6L9 17l-5-5" /></svg>Tem chống hàng giả & mã serial tra cứu được</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M20 6L9 17l-5-5" /></svg>Phiếu bảo hành điện tử liên kết trực tiếp với hãng</li>
              </ul>
            </div>
          </div>

          <div className="dh-strip" data-reveal>
            <div className="dh-strip-media"><img src="https://images.unsplash.com/photo-1786501135828-6927a8612593?w=900&auto=format&fit=crop&q=80" alt="Đội ngũ kỹ thuật MERIDIAN" /></div>
            <div className="dh-strip-text">
              <p className="dh-eyebrow">Đội ngũ chuyên môn</p>
              <h3>Kỹ thuật viên được đào tạo bởi chính hãng</h3>
              <p>Đội ngũ kỹ thuật viên của MERIDIAN được đào tạo trực tiếp bởi các hãng đồng hồ, đảm bảo khả năng tư vấn chính xác về cơ chế vận hành, bảo dưỡng và xử lý sự cố nhanh chóng cho mọi dòng sản phẩm đang phân phối.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dh-statbar">
        <div className="dh-container">
          <div className="dh-stats-grid">
            <div data-reveal><div className="dh-stat-num"><Counter target={7} /></div><div className="dh-stat-label">Năm hoạt động</div></div>
            <div data-reveal data-reveal-d1><div className="dh-stat-num"><Counter target={3} /></div><div className="dh-stat-label">Showroom trên toàn quốc</div></div>
            <div data-reveal data-reveal-d2><div className="dh-stat-num"><Counter target={8500} suffix="+" /></div><div className="dh-stat-label">Khách hàng đã phục vụ</div></div>
            <div data-reveal data-reveal-d3><div className="dh-stat-num"><Counter target={10} /></div><div className="dh-stat-label">Thương hiệu ủy quyền chính thức</div></div>
          </div>
        </div>
      </section>

      <section className="dh-sec">
        <div className="dh-container">
          <div className="dh-sec-head" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }} data-reveal>
            <p className="dh-eyebrow">Quy trình nghiêm ngặt</p>
            <h2 className="dh-sec-title">5 bước <em>kiểm định trước khi bán</em></h2>
          </div>
          <div className="dh-timeline" data-reveal>
            <div className="dh-timeline-item">
              <div className="dh-timeline-dot">1</div>
              <h4>Nhập hàng từ nhà phân phối ủy quyền</h4>
              <p>Toàn bộ sản phẩm được nhập trực tiếp, kèm chứng từ xuất xứ rõ ràng, không qua kênh xách tay không kiểm soát.</p>
            </div>
            <div className="dh-timeline-item">
              <div className="dh-timeline-dot">2</div>
              <h4>Kiểm tra tem chống hàng giả</h4>
              <p>Đối chiếu tem bảo hành, mã vạch và bao bì gốc với tiêu chuẩn của từng thương hiệu.</p>
            </div>
            <div className="dh-timeline-item">
              <div className="dh-timeline-dot">3</div>
              <h4>Đối chiếu số serial với hãng</h4>
              <p>Tra cứu mã serial trên hệ thống chính hãng để xác nhận thông tin sản phẩm khớp 100%.</p>
            </div>
            <div className="dh-timeline-item">
              <div className="dh-timeline-dot">4</div>
              <h4>Kiểm tra chức năng vận hành</h4>
              <p>Kỹ thuật viên kiểm tra độ chính xác, khả năng chống nước và các chức năng phụ trước khi lên kệ.</p>
            </div>
            <div className="dh-timeline-item">
              <div className="dh-timeline-dot">5</div>
              <h4>Kích hoạt bảo hành điện tử</h4>
              <p>Đăng ký bảo hành ngay khi bán ra, khách hàng tra cứu tình trạng bảo hành online 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dh-sec-tight" style={{ background: 'var(--surface)' }}>
        <div className="dh-container">
          <div className="dh-cta-band" data-reveal>
            <div>
              <h3>Sẵn sàng tìm chiếc đồng hồ phù hợp?</h3>
              <p>Khám phá hơn 40 mẫu đồng hồ chính hãng từ 10 thương hiệu uy tín ngay hôm nay.</p>
            </div>
            <Link to="/san-pham" className="dh-btn dh-btn-primary">Khám phá sản phẩm</Link>
          </div>
        </div>
      </section>
    </>
  )
}
