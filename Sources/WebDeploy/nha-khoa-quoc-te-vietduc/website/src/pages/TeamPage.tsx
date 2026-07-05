import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Doctor {
  id: number; name: string; role: string; flag: string;
  experience_years: number; photo: string; tags: string[]; description: string;
}

export default function TeamPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    api.get<Doctor[]>('/public/doctors').then(setDoctors).catch(() => {})
  }, [])

  const filtered = filter === 'all'
    ? doctors
    : doctors.filter(d => d.flag === (filter === 'domestic' ? 'Trong nuoc' : 'Quoc te'))  // DB values match seed (unaccented OK for comparison)

  return (
    <>
      {/* Page hero */}
      <section className="vd-page-hero">
        <div className="wd-container">
          <div className="vd-ph-inner">
            <div className="vd-ph-crumb">
              <Link to="/">Trang chủ</Link>
              <span>›</span>
              <span>Bác sĩ</span>
            </div>
            <h1 className="vd-ph-title">Đội Ngũ <em>Chuyên Gia</em></h1>
            <p className="vd-ph-sub">Bác sĩ trong nước và quốc tế đào tạo tại các trung tâm hàng đầu thế giới.</p>
          </div>
        </div>
      </section>

      {/* Doctor grid */}
      <section className="vd-sec-pad">
        <div className="wd-container">
          {/* Filter */}
          <div className="vd-filter-bar mb-5" data-reveal="true">
            {[
              { key: 'all',      label: 'Tất cả' },
              { key: 'domestic', label: 'Trong nước' },
              { key: 'intl',     label: 'Quốc tế' },
            ].map(f => (
              <button
                key={f.key}
                className={`vd-filter-pill${filter === f.key ? ' active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="row g-4">
            {filtered.map((d, i) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={d.id}>
                <div className="vd-doc-card" data-reveal="true" data-delay={`${(i % 4) + 1}`}>
                  <div className="vd-doc-img-wrap">
                    {d.photo ? (
                      <img
                        className="vd-doc-img"
                        src={d.photo}
                        alt={d.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="vd-doc-img" style={{ background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: 'var(--accent)' }}>
                        {d.name[0]}
                      </div>
                    )}
                    <span className="vd-doc-flag">{d.flag}</span>
                  </div>
                  <div className="vd-doc-body">
                    <div className="vd-doc-name">{d.name}</div>
                    <div className="vd-doc-role">{d.role}</div>
                    {d.experience_years > 0 && (
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>{d.experience_years} năm kinh nghiệm</div>
                    )}
                    {d.description && <p className="vd-doc-desc">{d.description}</p>}
                    {d.tags && d.tags.length > 0 && (
                      <div className="vd-doc-creds">
                        {d.tags.map((t, j) => <span key={j} className="vd-doc-cred">{t}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }} data-reveal="true">
            <Link to="/dat-lich" className="vd-btn vd-btn-primary vd-btn-lg">Đặt Lịch Gặp Bác Sĩ</Link>
          </div>
        </div>
      </section>
    </>
  )
}
