import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Doctor {
  id: number
  name: string
  role: string
  photo: string
  experience_years: number
  tags: string
  quote: string
}

export default function TeamPage() {
  useDocumentMeta({
    title: 'Đội ngũ bác sĩ — Sunrise Nha Khoa Gia Đình',
    description: 'Đội ngũ bác sĩ nha khoa tận tâm, giàu kinh nghiệm tại Sunrise — đồng hành cùng gia đình bạn từ khám tổng quát đến điều trị chuyên sâu.',
  })

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Doctor[]>('/public/doctors')
      .then(setDoctors)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="sr-page-header">
        <div className="wd-container">
          <div className="sr-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <span>Đội ngũ bác sĩ</span>
          </div>
          <h1 className="sr-page-header-title">Đội ngũ bác sĩ <em>tận tâm</em></h1>
          <p className="sr-page-header-sub">
            Mỗi bác sĩ tại Sunrise đều được đào tạo chuyên sâu, giàu lòng nhân ái — đồng hành cùng gia đình bạn
            từ những bước khám đầu tiên đến khi hoàn thành điều trị.
          </p>
        </div>
      </div>

      <section className="sec-pad">
        <div className="wd-container">
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '80px 0' }}>Đang tải...</div>
          ) : doctors.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '80px 0' }}>Chưa có thông tin bác sĩ.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
              {doctors.map((d, i) => (
                <div key={d.id} className="sr-doc-card" data-reveal data-delay={String((i % 3) + 1)}>
                  {d.photo && (
                    <div className="sr-doc-photo">
                      <img src={d.photo} alt={d.name} loading="lazy" />
                    </div>
                  )}
                  <div className="sr-doc-body">
                    <div className="sr-doc-name">{d.name}</div>
                    <div className="sr-doc-role">{d.role}</div>
                    {d.tags && (
                      <div className="sr-doc-tags">
                        {d.tags.split(',').map((t, j) => (
                          <span key={j}>{t.trim()}</span>
                        ))}
                        <span>{d.experience_years} năm kinh nghiệm</span>
                      </div>
                    )}
                    {d.quote && (
                      <div className="sr-doc-quote">"{d.quote}"</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '56px', padding: '48px', background: 'var(--accent-pale)', borderRadius: '24px' }} data-reveal>
            <h3 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
              Đặt lịch khám cùng bác sĩ Sunrise
            </h3>
            <p style={{ color: 'var(--text-2)', marginBottom: '24px' }}>
              Chọn giờ khám thuận tiện — bác sĩ sẽ dẫn dắt bạn qua từng bước chăm sóc.
            </p>
            <Link to="/dat-lich" className="sr-btn sr-btn-primary">Đặt lịch ngay</Link>
          </div>
        </div>
      </section>
    </>
  )
}
