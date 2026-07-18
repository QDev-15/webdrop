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

const WHY_ITEMS = [
  { icon: 'lightning-charge-fill', title: 'Đổi mới không ngừng', desc: 'Luôn cập nhật xu hướng và công nghệ mới nhất trong từng thiết kế.' },
  { icon: 'patch-check-fill', title: 'Chất lượng chính hãng', desc: 'Cam kết 100% hàng chính hãng, có tem chống hàng giả rõ ràng.' },
  { icon: 'people-fill', title: 'Cộng đồng sneakerhead', desc: 'Kết nối những người yêu thích văn hóa sneaker trên khắp cả nước.' },
]

export default function AboutPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Volt Kicks'

  const stats = [1, 2, 3, 4].map(i => ({
    num: Number(settings[`stat${i}_num`] || 0),
    suffix: settings[`stat${i}_suffix`] || '',
    label: settings[`stat${i}_label`] || '',
  })).filter(s => s.label)

  return (
    <>
      <div className="gd-page-header">
        <div className="gd-container">
          <nav className="gd-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Về chúng tôi</span>
          </nav>
          <h1 className="gd-page-title">Về <em>Chúng Tôi</em></h1>
          <p className="gd-page-count">Hành trình xây dựng thương hiệu sneaker được nhiều người tin dùng</p>
        </div>
      </div>

      <main>
        <section className="gd-sec">
          <div className="gd-container">
            <div className="gd-split-row" data-reveal>
              <div className="gd-split-media">
                <img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80" alt="Xưởng thiết kế sneaker" loading="lazy" />
              </div>
              <div className="gd-split-content">
                <div className="gd-eyebrow">Hành trình</div>
                <h2 className="gd-sec-title">Sinh Ra Từ <em>Đường Phố</em></h2>
                <p>
                  {siteName} ra đời từ niềm đam mê văn hóa sneaker của một nhóm bạn trẻ yêu thích street style. Bắt đầu
                  từ một cửa hàng nhỏ, chúng tôi không ngừng tìm kiếm những mẫu giày chất lượng, độc đáo để mang đến
                  cho cộng đồng yêu giày tại Việt Nam. Đến nay, {siteName} tự hào là điểm đến tin cậy của hàng nghìn
                  khách hàng trên khắp cả nước.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="gd-sec" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }} aria-labelledby="why-heading">
          <div className="gd-container">
            <div className="gd-eyebrow" data-reveal>Vì sao chọn chúng tôi</div>
            <h2 className="gd-sec-title" id="why-heading" data-reveal data-delay="1">Điều Chúng Tôi <em>Theo Đuổi</em></h2>
            <div className="gd-feat-row">
              {WHY_ITEMS.map((item, i) => (
                <div className="gd-feat-item" data-reveal data-delay={String(i)} key={item.title}>
                  <div className="gd-feat-icon"><i className={`bi bi-${item.icon}`} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {stats.length > 0 && (
          <section className="gd-stats" aria-label="Số liệu thành tựu">
            <div className="gd-container">
              <div className="gd-stats-grid">
                {stats.map((s, i) => (
                  <div className="gd-stat" data-reveal data-delay={String(i)} key={i}>
                    <div className="gd-stat-num"><CountUp target={s.num} suffix={s.suffix} /></div>
                    <div className="gd-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
