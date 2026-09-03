import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Testimonial } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const SLIDES = [
  { image: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?w=1600&auto=format&fit=crop&q=80', alt: 'Xưởng mộc MỘC AN' },
  { image: 'https://images.unsplash.com/photo-1659930087003-2d64e33181f7?w=1600&auto=format&fit=crop&q=80', alt: 'Nghệ nhân MỘC AN đang chế tác' },
  { image: 'https://images.unsplash.com/photo-1512212621149-107ffe572d2f?w=1600&auto=format&fit=crop&q=80', alt: 'Showroom trưng bày MỘC AN' },
  { image: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=1600&auto=format&fit=crop&q=80', alt: 'Sản phẩm hoàn thiện tại MỘC AN' },
]

function ShowcaseSlider() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])
  return (
    <section className="nt-showcase">
      {SLIDES.map((s, i) => (
        <div className={'nt-showcase-slide' + (i === idx ? ' active' : '')} key={i}>
          <img src={s.image} alt={s.alt} />
        </div>
      ))}
      <div className="nt-showcase-overlay">
        <span className="nt-showcase-label">Từ năm 2016</span>
        <h1>Mỗi món đồ là một câu chuyện <br />được kể bằng gỗ.</h1>
      </div>
      <div className="nt-showcase-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={'nt-showcase-dot' + (i === idx ? ' active' : '')} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`}></button>
        ))}
      </div>
    </section>
  )
}

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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useDocumentMeta({
    title: 'Giới thiệu — MỘC AN',
    description: 'MỘC AN — thương hiệu nội thất gỗ tối giản, thành lập 2016. Câu chuyện thương hiệu, cam kết chất lượng và quy trình sản xuất thủ công tại xưởng riêng.',
  })

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setTestimonials).catch(() => {})
  }, [])

  return (
    <div>
      <ShowcaseSlider />

      <section className="nt-sec">
        <div className="nt-container">
          <div className="nt-strip" data-reveal>
            <div className="nt-strip-media"><img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80" alt="Khởi đầu của MỘC AN" /></div>
            <div className="nt-strip-text">
              <span className="nt-num">01 — Khởi đầu</span>
              <h3>Từ một xưởng mộc nhỏ ở ngoại thành</h3>
              <p>MỘC AN bắt đầu năm 2016 từ một xưởng mộc nhỏ với 4 người thợ, chỉ nhận đóng bàn ghế theo yêu cầu cho vài khách quen trong xóm. Chúng tôi tin rằng đồ gỗ tốt không cần cầu kỳ — chỉ cần đúng chất liệu, đúng tay nghề và đủ thời gian.</p>
              <p>Sau 8 năm, xưởng đã mở rộng thành 3 khu sản xuất tại Bình Dương, phục vụ khách hàng trên toàn quốc mà vẫn giữ nguyên triết lý ban đầu: làm chậm, làm chắc.</p>
            </div>
          </div>

          <div className="nt-strip rev" data-reveal>
            <div className="nt-strip-media"><img src="https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&auto=format&fit=crop&q=80" alt="Quy trình sản xuất MỘC AN" /></div>
            <div className="nt-strip-text">
              <span className="nt-num">02 — Quy trình</span>
              <h3>Gỗ được tuyển chọn, sấy đúng chuẩn</h3>
              <p>Mọi lô gỗ tự nhiên đều trải qua quy trình sấy tẩm đạt độ ẩm 8–12% trước khi đưa vào gia công, hạn chế cong vênh trong điều kiện khí hậu nhiệt đới. Gỗ công nghiệp sử dụng cốt MDF lõi xanh chống ẩm, phủ Melamine chống trầy.</p>
              <p>Mỗi sản phẩm đều qua 3 vòng kiểm tra chất lượng trước khi đóng gói — từ độ chắc của khớp nối đến độ mịn của lớp sơn hoàn thiện.</p>
            </div>
          </div>

          <div className="nt-strip" data-reveal>
            <div className="nt-strip-media"><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80" alt="Đội ngũ giao lắp MỘC AN" /></div>
            <div className="nt-strip-text">
              <span className="nt-num">03 — Đồng hành</span>
              <h3>Không chỉ bán đồ, mà đồng hành cùng không gian sống</h3>
              <p>Đội ngũ tư vấn của MỘC AN luôn sẵn sàng hỗ trợ đo đạc, phối hợp bố cục nội thất theo diện tích thực tế của từng ngôi nhà — không chỉ bán một món đồ đơn lẻ mà giúp khách hàng hình dung trọn vẹn không gian sống của mình.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="nt-stats">
        <div className="nt-container">
          <div className="nt-stats-grid">
            <div data-reveal><div className="nt-stat-num"><Counter target={8} /><em>+</em></div><div className="nt-stat-label">Năm kinh nghiệm</div></div>
            <div data-reveal data-reveal-d1><div className="nt-stat-num"><Counter target={24000} /><em>+</em></div><div className="nt-stat-label">Sản phẩm đã giao</div></div>
            <div data-reveal data-reveal-d2><div className="nt-stat-num"><Counter target={35} /></div><div className="nt-stat-label">Tỉnh thành phục vụ</div></div>
            <div data-reveal data-reveal-d3><div className="nt-stat-num"><Counter target={98} suffix="%" /></div><div className="nt-stat-label">Khách hàng hài lòng</div></div>
          </div>
        </div>
      </section>

      <section className="nt-sec">
        <div className="nt-container">
          <div className="nt-sec-head center" data-reveal>
            <div className="nt-eyebrow" style={{ justifyContent: 'center' }}>Khách hàng nói gì</div>
            <h2 className="nt-sec-title">Những phản hồi <em>chân thật</em></h2>
          </div>
          <div style={{ maxWidth: 820, margin: '0 auto' }} data-reveal>
            {testimonials.map((t, i) => (
              <div key={t.id} style={{ display: 'flex', gap: 20, padding: '28px 0', borderBottom: i === testimonials.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <img src={t.author_avatar} alt={`Khách hàng ${t.author_name}`} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, color: 'var(--text)', marginBottom: 10 }}>"{t.content}"</p>
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{t.author_name} — {t.author_location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nt-sec-tight" style={{ textAlign: 'center', background: 'var(--accent-light)' }}>
        <div className="nt-container" data-reveal>
          <h2 className="nt-sec-title" style={{ marginBottom: 22 }}>Sẵn sàng làm mới <em>không gian sống</em>?</h2>
          <Link to="/" className="nt-btn">Khám phá sản phẩm</Link>
        </div>
      </section>
    </div>
  )
}
