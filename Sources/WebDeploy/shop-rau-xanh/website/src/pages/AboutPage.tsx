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

export default function AboutPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Vườn Xanh'

  const stats = [1, 2, 3, 4].map(i => ({
    num: Number(settings[`stat${i}_num`] || 0),
    suffix: settings[`stat${i}_suffix`] || '',
    label: settings[`stat${i}_label`] || '',
  })).filter(s => s.label)

  return (
    <main>
      <div className="rx-container" style={{ paddingTop: 32 }}>
        <nav className="rx-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Về chúng tôi</span>
        </nav>
        <h1 style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(30px,4.2vw,48px)', margin: '20px 0 8px' }}>
          Câu chuyện <strong style={{ fontStyle: 'normal', color: 'var(--accent)' }}>{siteName}</strong>
        </h1>
        <p style={{ color: 'var(--text-2)', maxWidth: 560, marginBottom: 12 }}>Hành trình kết nối nông trại sạch với bàn ăn mỗi gia đình</p>
      </div>

      <section style={{ padding: '48px 0 80px' }}>
        <div className="rx-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }} data-reveal>
            <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3' }}>
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80"
                alt="Nông trại hữu cơ nguồn cung rau củ"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div className="rx-eyebrow">Nguồn gốc</div>
              <h2 className="rx-sec-title">Bắt đầu từ <strong>một mảnh vườn nhỏ</strong></h2>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.75, maxWidth: 460 }}>
                {siteName} khởi đầu từ một mảnh vườn nhỏ ở ngoại ô, nơi người sáng lập tự tay trồng rau sạch cho gia đình mình vì lo ngại thực phẩm trôi nổi trên thị trường. Nhận thấy nhiều gia đình khác cũng có cùng nỗi trăn trở, chúng tôi bắt đầu liên kết với các nông trại hữu cơ địa phương để mở rộng nguồn cung. Từ vài chục đơn hàng mỗi tuần, {siteName} nay đã đồng hành cùng hàng ngàn gia đình trên khắp cả nước, luôn giữ vững cam kết ban đầu: rau củ sạch, tươi mỗi ngày.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rx-sec" style={{ background: 'var(--surface)' }} aria-labelledby="values-heading">
        <div className="rx-container">
          <div className="rx-eyebrow" data-reveal>Cam kết</div>
          <h2 className="rx-sec-title" id="values-heading" data-reveal data-delay="1">Vì sao chọn <strong>{siteName}</strong></h2>
          <div className="row g-4" style={{ marginTop: 24 }}>
            <div className="col-md-4" data-reveal>
              <div style={{ height: '100%', padding: 28, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16 }}>
                <i className="bi bi-flower1" style={{ fontSize: 26, color: 'var(--accent)' }} />
                <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 19, margin: '14px 0 8px' }}>100% Hữu cơ</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>Không thuốc bảo vệ thực vật, không chất bảo quản — từ nông trại đến bàn ăn trong ngày.</p>
              </div>
            </div>
            <div className="col-md-4" data-reveal data-delay="1">
              <div style={{ height: '100%', padding: 28, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16 }}>
                <i className="bi bi-truck" style={{ fontSize: 26, color: 'var(--accent)' }} />
                <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 19, margin: '14px 0 8px' }}>Giao trong ngày</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>Thu hoạch buổi sáng, giao đến tay khách hàng ngay trong ngày, giữ trọn độ tươi.</p>
              </div>
            </div>
            <div className="col-md-4" data-reveal data-delay="2">
              <i className="bi bi-people" style={{ fontSize: 26, color: 'var(--accent)' }} />
              <div style={{ height: '100%', padding: 28, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, marginTop: -38, paddingTop: 38 }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 19, margin: '14px 0 8px' }}>Đồng hành nông dân</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>Liên kết trực tiếp với hơn 120 nông trại địa phương, đảm bảo thu nhập ổn định cho nông dân.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="rx-stats" aria-label="Số liệu">
          <div className="rx-container">
            <div className="rx-stats-grid">
              {stats.map((s, i) => (
                <div className="rx-stat" data-reveal data-delay={String(i)} key={i}>
                  <div className="rx-stat-num"><CountUp target={s.num} suffix={s.suffix} /></div>
                  <div className="rx-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
