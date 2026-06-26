import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  avatar_url: string
  rating: number
}

function Stars({ n }: { n: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? '#f59e0b' : 'var(--border)' }}>★</span>
      ))}
    </div>
  )
}

const FALLBACK: Testimonial[] = [
  { id:1, name: 'Nguyễn Lan Anh', role: 'Nhân viên văn phòng', content: 'Sau 2 tháng tập tại Balance, đau lưng của tôi giảm hẳn. Huấn luyện viên rất chuyên tâm và lớp học không đông.', avatar_url: '', rating: 5 },
  { id:2, name: 'Trần Minh Phúc', role: 'Kỹ sư IT', content: 'Tôi không ngờ Pilates lại khó đến vậy! Nhưng sau 1 tháng, cảm giác cơ thể cân bằng hơn rõ rệt. Sẽ tiếp tục dài hạn.', avatar_url: '', rating: 5 },
  { id:3, name: 'Lê Thu Hà', role: 'Giáo viên', content: 'Lớp Prenatal Pilates cực kỳ hữu ích trong giai đoạn mang thai. Giáo viên hiểu rõ nhu cầu của từng học viên.', avatar_url: '', rating: 5 },
]

function Avatar({ src, name }: { src: string; name: string }) {
  const initials = (name || '?').split(' ').slice(-2).map(w => w[0] || '').join('').toUpperCase() || '?'
  if (src) return <img src={src} alt={name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  return (
    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--green-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
      {initials}
    </div>
  )
}

export default function Testimonials() {
  const [data, setData] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(d => setData(d.length > 0 ? d : FALLBACK))
      .catch(() => setData(FALLBACK))
  }, [])

  return (
    <section className="ps-testimonials sec-pad">
      <div className="wd-container">
        <div className="text-center reveal">
          <div className="ps-eyebrow">Học viên nói về chúng tôi</div>
          <h2 className="ps-sec-title">Những thay đổi<br /><em>thực sự.</em></h2>
        </div>
        <div className="row g-4 mt-2">
          {data.map((t, i) => (
            <div key={t.id} className={`col-md-4 reveal reveal-d${Math.min(i % 3, 2) as 0|1|2}`}>
              <div className="ps-testi-card">
                <Stars n={t.rating} />
                <p className="ps-testi-text">"{t.content}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
                  <Avatar src={t.avatar_url} name={t.name} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    {t.role && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.role}</div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
