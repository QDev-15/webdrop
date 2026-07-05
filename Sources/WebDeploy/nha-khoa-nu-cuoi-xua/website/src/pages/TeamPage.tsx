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
  { id: 1, name: 'BS. Nguyễn Thị Mai', role: 'Trưởng phòng khám — Nha khoa thẩm mỹ', photo: '', experience_years: 12, tags: 'Nha khoa thẩm mỹ,Răng sứ,Tẩy trắng', quote: 'Mọi nụ cười đẹp bắt đầu từ sự tận tâm của người bác sĩ.', is_active: 1 },
  { id: 2, name: 'BS. Trần Văn Hùng', role: 'Chuyên khoa Chỉnh nha', photo: '', experience_years: 8, tags: 'Niềng răng,Invisalign,Chỉnh nha hàm', quote: 'Cháu răng cần được điều trị sớm để tránh các biến chứng sau này.', is_active: 1 },
  { id: 3, name: 'BS. Lê Thị Hoa', role: 'Chuyên khoa Phẫu thuật hàm mặt', photo: '', experience_years: 10, tags: 'Implant,Nhổ răng khôn,Phẫu thuật', quote: 'Sự an toàn và thoải mái của bệnh nhân là ưu tiên hàng đầu.', is_active: 1 },
  { id: 4, name: 'BS. Phạm Minh Tuấn', role: 'Chuyên khoa Nha khoa trẻ em', photo: '', experience_years: 7, tags: 'Nha khoa trẻ em,Phòng ngừa,Trám răng', quote: 'Răng sữa khỏe mạnh là nền tảng cho răng vĩnh viễn tốt đẹp.', is_active: 1 },
]

export default function TeamPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Doctor[]>('/public/doctors')
      .then(data => setDoctors(data.filter(d => d.is_active)))
      .catch(() => setDoctors(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  const items = doctors.length > 0 ? doctors : (loading ? [] : FALLBACK)

  return (
    <>
      {/* Page hero */}
      <div className="nc-page-hero">
        <div className="wd-container nc-strip-inner">
          <div className="nc-ph-crumb">
            <Link to="/">Trang chủ</Link> / Bác sĩ
          </div>
          <h1 className="nc-ph-title">Đội ngũ <span>bác sĩ</span></h1>
          <p className="nc-ph-sub">Những chuyên gia răng miệng tận tâm, giàu kinh nghiệm, luôn đặt sự an toàn của bệnh nhân lên hàng đầu.</p>
        </div>
      </div>

      <section className="sec-pad">
        <div className="wd-container">
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '80px' }}>Đang tải...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {items.map((d, i) => (
                <div key={d.id} className="nc-card" data-reveal data-delay={String((i % 3) + 1)}>
                  {d.photo ? (
                    <div className="nc-card-img nc-doc-img">
                      <img src={d.photo} alt={d.name} loading="lazy" />
                    </div>
                  ) : (
                    <div className="nc-card-img nc-doc-img" style={{ background: 'var(--warm2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '64px', opacity: .2 }}>👨‍⚕️</span>
                    </div>
                  )}
                  <div className="nc-card-body">
                    <div className="nc-doc-role">{d.role}</div>
                    <h2 className="nc-card-name">{d.name}</h2>
                    {d.quote && (
                      <p className="nc-card-desc" style={{ fontStyle: 'italic' }}>"{d.quote}"</p>
                    )}
                    {d.experience_years > 0 && (
                      <div className="nc-card-price" style={{ fontSize: '14px' }}>{d.experience_years} năm kinh nghiệm</div>
                    )}
                    {d.tags && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                        {d.tags.split(',').filter(Boolean).map(tag => (
                          <span key={tag} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-light)', padding: '3px 8px', border: '1px solid var(--accent)' }}>
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '60px' }} data-reveal>
            <div className="nc-eyebrow" style={{ display: 'inline-flex', marginBottom: '14px' }}>Khám cùng chúng tôi</div>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/dat-lich" className="nc-btn">Đặt lịch khám</Link>
              <Link to="/lien-he" className="nc-btn-outline">Liên hệ tư vấn</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
