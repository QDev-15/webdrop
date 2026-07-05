import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Doctor {
  id: number
  name: string
  role: string
  photo: string
  experience_years: number
  tags: string
  quote: string
  is_active: number
}

const FALLBACK: Doctor[] = [
  { id: 1, name: 'BS. Nguyễn Thị Mai', role: 'Trưởng phòng khám — Nha khoa thẩm mỹ', photo: '', experience_years: 12, tags: 'Nha khoa thẩm mỹ,Răng sứ', quote: 'Mọi nụ cười đẹp bắt đầu từ sự tận tâm của người bác sĩ.', is_active: 1 },
  { id: 2, name: 'BS. Trần Văn Hùng', role: 'Chuyên khoa Chỉnh nha', photo: '', experience_years: 8, tags: 'Niềng răng,Invisalign', quote: 'Cháu răng cần được điều trị sớm để tránh các biến chứng sau này.', is_active: 1 },
  { id: 3, name: 'BS. Lê Thị Hoa', role: 'Chuyên khoa Phẫu thuật hàm mặt', photo: '', experience_years: 10, tags: 'Implant,Nhổ răng khôn', quote: 'Sự an toàn và thoải mái của bệnh nhân là ưu tiên hàng đầu.', is_active: 1 },
]

export default function Team() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Doctor[]>('/public/doctors')
      .then(data => setDoctors(data.filter(d => d.is_active).slice(0, 3)))
      .catch(() => setDoctors(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  const items = doctors.length > 0 ? doctors : (loading ? [] : FALLBACK)

  return (
    <section className="sec-pad" style={{ background: 'var(--surface)' }}>
      <div className="wd-container">
        <div style={{ marginBottom: '52px' }} data-reveal>
          <div className="nc-eyebrow">Đội ngũ bác sĩ</div>
          <h2 className="nc-title">Những <span>bàn tay tài hoa</span></h2>
          <p className="nc-sub">Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm, được đào tạo bài bản và luôn đặt sự an toàn của bệnh nhân lên hàng đầu.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {items.map((d, i) => (
            <div key={d.id} className="nc-card" data-reveal data-delay={String((i % 3) + 1)}>
              {d.photo ? (
                <div className="nc-card-img nc-doc-img">
                  <img src={d.photo} alt={d.name} loading="lazy" />
                </div>
              ) : (
                <div className="nc-card-img nc-doc-img" style={{ background: 'var(--warm2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '64px', opacity: .25 }}>👨‍⚕️</span>
                </div>
              )}
              <div className="nc-card-body">
                <div className="nc-doc-role">{d.role}</div>
                <h3 className="nc-card-name">{d.name}</h3>
                {d.quote && (
                  <p className="nc-card-desc" style={{ fontStyle: 'italic' }}>"{d.quote}"</p>
                )}
                {d.experience_years > 0 && (
                  <div className="nc-card-price" style={{ fontSize: '14px' }}>
                    {d.experience_years} năm kinh nghiệm
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }} data-reveal>
          <Link to="/bac-si" className="nc-btn-outline">Xem tất cả bác sĩ</Link>
        </div>
      </div>
    </section>
  )
}
