import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Service {
  id: number
  name: string
  description: string
  price_from: number
  price_unit: string
  duration: string
  image: string
  is_featured: number
  category_name?: string
}

const ICONS = ['◈', '◉', '◆', '◇', '◎', '✦']

export default function Services() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    api.get<Service[]>('/public/services?featured=1').then(setServices).catch(() => {})
  }, [])

  // Fallback: show static cards if no data yet
  const items = services.length > 0 ? services : []

  return (
    <section className="cn-services sec-pad">
      <div className="wd-container">
        <div className="cn-section-head" data-reveal>
          <div>
            <div className="cn-eyebrow">Dịch vụ nổi bật</div>
            <h2 className="cn-title">Giải pháp niềng răng cho <em>mọi nhu cầu</em></h2>
            <p className="cn-sub">Từ mắc cài truyền thống đến khay trong suốt cao cấp — tư vấn giải pháp phù hợp với cấu trúc răng và ngân sách của bạn.</p>
          </div>
          <Link to="/dich-vu" className="cn-btn cn-btn-ghost">Xem tất cả dịch vụ</Link>
        </div>

        {items.length > 0 ? (
          <div className="cn-svc-grid">
            {items.map((s, i) => (
              <div className="cn-svc-card" key={s.id} data-reveal data-delay={String(i % 3)}>
                <div className="cn-svc-num">0{i + 1}</div>
                <div className="cn-svc-icon" aria-hidden="true">
                  <span style={{ fontSize: 18 }}>{ICONS[i % ICONS.length]}</span>
                </div>
                <h3 className="cn-svc-title">{s.name}</h3>
                <p className="cn-svc-text">{s.description}</p>
                {s.price_from > 0 && (
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 16 }}>
                    Từ {Number(s.price_from).toLocaleString('vi-VN')}đ / {s.price_unit}
                  </div>
                )}
                <Link to="/dich-vu" className="cn-svc-link">
                  Tìm hiểu thêm
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="cn-svc-grid">
            {[
              { num: '01', title: 'Mắc cài kim loại', text: 'Hiệu quả cao, chi phí hợp lý, phù hợp với hầu hết các ca sai lệch khớp cắn.' },
              { num: '02', title: 'Mắc cài sứ thẩm mỹ', text: 'Màu gần với răng thật, ít lộ khi giao tiếp, hiệu quả tương đương mắc cài kim loại.' },
              { num: '03', title: 'Invisalign', text: 'Khay trong suốt tháo lắp linh hoạt, gần như vô hình, nhập khẩu chính hãng Hoa Kỳ.' },
            ].map((s, i) => (
              <div className="cn-svc-card" key={s.num} data-reveal data-delay={String(i)}>
                <div className="cn-svc-num">{s.num}</div>
                <div className="cn-svc-icon" aria-hidden="true">
                  <span style={{ fontSize: 18 }}>{ICONS[i]}</span>
                </div>
                <h3 className="cn-svc-title">{s.title}</h3>
                <p className="cn-svc-text">{s.text}</p>
                <Link to="/dich-vu" className="cn-svc-link">
                  Tìm hiểu thêm
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
