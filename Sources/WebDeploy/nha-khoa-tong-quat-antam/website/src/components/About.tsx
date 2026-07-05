import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'

interface Settings {
  calm_quote?: string
  calm_attr_name?: string
  calm_attr_role?: string
  stat_patients?: string
  stat_years?: string
  stat_satisfaction?: string
}

const USP_ITEMS = [
  {
    icon: '🌿',
    title: 'Không gian yên tĩnh',
    text: 'Môi trường nhẹ nhàng, ít tiếng ồn — thiết kế đặc biệt để giảm lo lắng ngay từ bước vào phòng khám.',
  },
  {
    icon: '🗣',
    title: 'Lắng nghe trước hết',
    text: 'Mỗi ca khám bắt đầu bằng 5 phút chỉ để lắng nghe. Bác sĩ không bao giờ vội bắt đầu điều trị.',
  },
  {
    icon: '💰',
    title: 'Giá cả minh bạch',
    text: 'Bảng giá rõ ràng, không phát sinh. Mọi chi phí được thống nhất trước khi thực hiện.',
  },
  {
    icon: '🤝',
    title: 'Đồng hành lâu dài',
    text: 'Chúng tôi xây dựng kế hoạch chăm sóc răng miệng dài hạn, không chỉ điều trị triệu chứng tạm thời.',
  },
]

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    el.querySelectorAll('.at-reveal').forEach(el2 => obs.observe(el2))
    return () => obs.disconnect()
  }, [])
  return ref
}

export default function About() {
  const [s, setS] = useState<Settings>({})
  const ref = useReveal()

  useEffect(() => {
    api.get<Settings>('/public/settings').then(setS).catch(() => {})
  }, [])

  const quote = s.calm_quote || 'Chúng tôi tin rằng sự an tâm bắt đầu từ một không gian yên tĩnh — nơi mọi lo lắng được lắng nghe trước khi điều trị.'
  const attrName = s.calm_attr_name || 'BS. Nguyễn Thị Minh Anh'
  const attrRole = s.calm_attr_role || 'Sáng lập Nha Khoa An Tâm'

  return (
    <div ref={ref}>
      {/* USP row */}
      <section className="at-usp-bg" aria-label="Triết lý An Tâm">
        <div className="at-usp-grid">
          {USP_ITEMS.map((item, i) => (
            <div key={i} className={`at-usp-item at-reveal at-reveal-d${i + 1}`}>
              <div className="at-usp-icon" aria-hidden="true">{item.icon}</div>
              <div className="at-usp-title">{item.title}</div>
              <p className="at-usp-text">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="at-stat-bg" aria-label="Thống kê">
        <div className="at-stat-grid">
          <div className="at-stat-item at-reveal">
            <div className="at-stat-num">{s.stat_patients || '10.000+'}</div>
            <div className="at-stat-label">Bệnh nhân tin tưởng</div>
          </div>
          <div className="at-stat-item at-reveal at-reveal-d2">
            <div className="at-stat-num">{s.stat_years || '12'}</div>
            <div className="at-stat-label">Năm kinh nghiệm</div>
          </div>
          <div className="at-stat-item at-reveal at-reveal-d3">
            <div className="at-stat-num">{s.stat_satisfaction || '98%'}</div>
            <div className="at-stat-label">Hài lòng sau điều trị</div>
          </div>
        </div>
      </section>

      {/* Calm quote */}
      <section className="at-calm" aria-label="Triết lý phòng khám">
        <div className="at-calm-grid">
          <div className="at-calm-media">
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80&auto=format&fit=crop"
              alt="Không gian phòng khám yên tĩnh"
              loading="lazy"
            />
          </div>
          <div className="at-calm-content at-reveal">
            <div className="at-eyebrow" style={{ color: 'var(--accent-mid)' }}>
              <span className="at-eyebrow-line" style={{ background: 'var(--accent-dim)' }} />
              Triết lý của chúng tôi
            </div>
            <blockquote className="at-calm-quote">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <div className="at-calm-attr">
              <strong>{attrName}</strong> · {attrRole}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
