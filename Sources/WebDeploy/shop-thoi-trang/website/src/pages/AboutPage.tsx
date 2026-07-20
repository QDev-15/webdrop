import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const step = Math.max(1, Math.ceil(target / 60))
    let cur = 0
    const t = setInterval(() => {
      cur = Math.min(cur + step, target)
      setValue(cur)
      if (cur >= target) clearInterval(t)
    }, 25)
    return () => clearInterval(t)
  }, [target, active])
  return value
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const count = useCountUp(value, visible)
  return (
    <div className="st-stat-item" ref={ref}>
      <div className="st-stat-num">{count}{suffix}</div>
      <div className="st-stat-label">{label}</div>
    </div>
  )
}

const VALUES = [
  {
    icon: 'bi-lightning-charge',
    title: 'Cá Tính',
    desc: 'Mỗi thiết kế đều mang dấu ấn riêng, không hòa lẫn với số đông.',
  },
  {
    icon: 'bi-award',
    title: 'Chất Lượng',
    desc: 'Mỗi sản phẩm đều trải qua kiểm định nghiêm ngặt trước khi đến tay khách hàng.',
  },
  {
    icon: 'bi-recycle',
    title: 'Bền Vững',
    desc: 'Ưu tiên chất liệu và quy trình sản xuất thân thiện với môi trường.',
  },
]

export default function AboutPage() {
  useDocumentMeta({
    title: 'Về Chúng Tôi — Nova Store',
    description: 'Tìm hiểu về Nova Store — hành trình xây dựng thương hiệu thời trang phong cách mới, táo bạo và chất lượng.',
  })
  const { settings } = useSite()
  const siteName = settings.site_name || 'Nova Store'

  return (
    <>
      <section className="st-page-hero" aria-label="Tiêu đề trang">
        <div className="st-container">
          <nav className="st-breadcrumb mb-3" aria-label="Điều hướng">
            <Link to="/">Trang chủ</Link>
            <span className="st-breadcrumb-sep">/</span>
            <span>Về chúng tôi</span>
          </nav>
          <h1 className="st-page-title">Về<br />Chúng Tôi</h1>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 14, fontWeight: 600, maxWidth: 400, marginTop: 8 }}>
            Hành trình xây dựng một thương hiệu thời trang được nhiều người tin yêu
          </p>
        </div>
      </section>

      <section className="st-sec" aria-labelledby="story-heading">
        <div className="st-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }} data-reveal>
            <div style={{ borderRadius: 0, overflow: 'hidden', aspectRatio: '4/3' }}>
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                alt="Studio thiết kế thời trang của thương hiệu"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div className="st-eyebrow">Hành trình</div>
              <h2 className="st-sec-title" id="story-heading">Sinh Ra Từ<br /><em>Đam Mê</em></h2>
              <p className="st-sec-sub" style={{ maxWidth: 440 }}>
                {siteName} khởi nguồn từ tình yêu thời trang cá tính và khát vọng mang phong cách riêng đến với mọi người.
                Từ một studio thiết kế nhỏ, chúng tôi đã không ngừng phát triển để trở thành điểm đến quen thuộc của
                những ai theo đuổi sự khác biệt — nơi mỗi bộ sưu tập đều kể một câu chuyện, mỗi sản phẩm đều mang một dấu ấn.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="st-statbar" aria-label="Thống kê">
        <div className="st-container">
          <div className="st-statbar-grid">
            <StatItem value={50} suffix="K+" label="Khách hàng" />
            <StatItem value={8} suffix=" năm" label="Kinh nghiệm" />
            <StatItem value={120} suffix="+" label="Mẫu thiết kế / năm" />
            <StatItem value={63} suffix="" label="Tỉnh thành giao hàng" />
          </div>
        </div>
      </section>

      <section className="st-sec" aria-labelledby="values-heading">
        <div className="st-container">
          <div className="text-center mb-5">
            <div className="st-eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>Giá trị cốt lõi</div>
            <h2 className="st-sec-title" id="values-heading">Điều Chúng Tôi<br /><em>Theo Đuổi</em></h2>
          </div>
          <div className="row g-4">
            {VALUES.map((v, i) => (
              <div className="col-md-4" data-reveal data-delay={String(i)} key={v.title}>
                <div style={{ height: '100%', padding: '32px 28px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <i className={`bi ${v.icon}`} style={{ fontSize: 28, color: 'var(--accent)' }} />
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '16px 0 8px' }}>{v.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
