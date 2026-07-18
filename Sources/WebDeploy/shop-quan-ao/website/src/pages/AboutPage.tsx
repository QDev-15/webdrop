import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      let cur = 0
      const step = Math.max(1, Math.ceil(target / 60))
      const t = setInterval(() => {
        cur = Math.min(cur + step, target)
        setValue(cur)
        if (cur >= target) clearInterval(t)
      }, 25)
      io.disconnect()
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])

  return <span ref={ref}>{value}{suffix}</span>
}

const VALUES = [
  { title: 'Chất lượng luôn đặt lên hàng đầu', desc: 'Mỗi sản phẩm đều được kiểm định kỹ càng, form dáng chuẩn trước khi đến tay khách hàng.', icon: 'gem' },
  { title: 'Bền vững với môi trường', desc: 'Ưu tiên chất liệu thân thiện, giảm thiểu tác động đến môi trường trong từng khâu sản xuất.', icon: 'flower2' },
  { title: 'Đồng hành cùng khách hàng', desc: 'Luôn lắng nghe phản hồi và cải thiện để mang đến trải nghiệm mua sắm tốt nhất.', icon: 'heart' },
]

export default function AboutPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Lys Chic'

  const stats = [1, 2, 3, 4].map(i => ({
    num: Number(settings[`stat${i}_num`] || 0),
    suffix: settings[`stat${i}_suffix`] || '',
    label: settings[`stat${i}_label`] || '',
  })).filter(s => s.label)

  return (
    <>
      <div className="qa-page-header">
        <div className="qa-container">
          <nav className="qa-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Về chúng tôi</span>
          </nav>
          <h1 className="qa-page-title">Câu chuyện <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>của chúng tôi</em></h1>
          <p className="qa-page-count" style={{ fontSize: 16 }}>Hành trình từ ý tưởng đến thương hiệu thời trang được nhiều người tin yêu</p>
        </div>
      </div>

      <main>
        <section className="qa-sec">
          <div className="qa-container">
            <div className="qa-value-item" data-reveal style={{ gridTemplateColumns: '1fr 1fr', gap: 44, border: 'none', padding: 0 }}>
              <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4/3' }}>
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80" alt="Xưởng thiết kế thời trang" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ alignSelf: 'center' }}>
                <div className="qa-eyebrow">Hành trình của chúng tôi</div>
                <h2 className="qa-sec-title">Bắt đầu từ <strong>tình yêu</strong> với vải vóc</h2>
                <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.75, maxWidth: 460 }}>
                  {siteName} ra đời từ niềm đam mê với thời trang nữ và mong muốn mang đến những thiết kế vừa nhẹ nhàng, tinh tế
                  vừa thoải mái cho vóc dáng người Việt. Từ những mẫu vải đầu tiên được chọn lọc tỉ mỉ, chúng tôi đã xây dựng nên
                  một thương hiệu được nhiều khách hàng tin yêu và đồng hành mỗi ngày.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="qa-sec" style={{ background: 'var(--surface)' }} aria-labelledby="values-heading">
          <div className="qa-container-sm">
            <div className="qa-eyebrow" data-reveal>Giá trị cốt lõi</div>
            <h2 className="qa-sec-title" id="values-heading" data-reveal data-delay="1">Điều chúng tôi <strong>theo đuổi</strong></h2>
            <div className="qa-values-list">
              {VALUES.map((v, i) => (
                <div className="qa-value-item" data-reveal data-delay={String(i + 1)} key={v.title}>
                  <div className="qa-value-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="qa-value-body"><h3>{v.title}</h3><p>{v.desc}</p></div>
                  <div className="qa-value-icon"><i className={`bi bi-${v.icon}`} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {stats.length > 0 && (
          <section className="qa-stats" aria-label="Số liệu thành tựu">
            <div className="qa-container">
              <div className="qa-stats-grid">
                {stats.map((s, i) => (
                  <div className="qa-stat" data-reveal data-delay={String(i + 1)} key={i}>
                    <div className="qa-stat-num"><CountUp target={s.num} suffix={s.suffix} /></div>
                    <div className="qa-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="qa-sec qa-newsletter" aria-labelledby="cta-heading">
          <div className="qa-container">
            <div className="qa-newsletter-inner">
              <div className="qa-eyebrow" style={{ justifyContent: 'center' }} data-reveal>Đồng hành cùng chúng tôi</div>
              <h2 className="qa-sec-title" id="cta-heading" data-reveal data-delay="1">Khám phá <strong>bộ sưu tập</strong> mới nhất</h2>
              <div style={{ marginTop: 28 }} data-reveal data-delay="2">
                <Link to="/san-pham" className="qa-btn qa-btn-primary">Mua sắm ngay <i className="bi bi-arrow-right ms-1" /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
