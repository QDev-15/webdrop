import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface TeamMember {
  id: number
  name: string
  title: string
  role: string
  specialty: string
  education: string
  experience: string
  cases_count: number
  certifications: string
  image: string
  badge: string
}

export default function BacSiPage() {
  useDocumentMeta({
    title: 'Đội ngũ bác sĩ — Nha Khoa Chỉnh Nha Sài Gòn',
    description: 'Đội ngũ bác sĩ chuyên khoa chỉnh nha giàu kinh nghiệm, đã điều trị hàng nghìn ca niềng răng — mắc cài kim loại, mắc cài sứ, Invisalign.',
  })
  const { settings } = useSite()
  const [team, setTeam] = useState<TeamMember[]>([])

  const cases   = settings.stat_cases   || '4.500'
  const doctors = settings.stat_doctors || '6'
  const years   = settings.stat_years   || '12'
  const satisfy = settings.stat_satisfaction || '98'

  useEffect(() => {
    api.get<TeamMember[]>('/public/team').then(setTeam).catch(() => {})
  }, [])

  return (
    <>
      <div className="cn-page-hero">
        <div className="wd-container">
          <div className="cn-ph-badge">Đội ngũ bác sĩ</div>
          <h1 className="cn-ph-title">Chuyên gia <em>chỉnh nha</em> hàng đầu</h1>
          <p className="cn-ph-sub">Tốt nghiệp chuyên khoa Chỉnh nha, được đào tạo quốc tế, mang đến kết quả điều trị vượt mong đợi.</p>
        </div>
      </div>

      {/* Stats strip */}
      <section style={{ background: 'var(--surface)', padding: 'clamp(36px,4vw,48px) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="wd-container">
          <div className="cn-stats-strip" data-reveal>
            <div className="cn-stats-strip-item">
              <div className="cn-stats-strip-num">{cases}+</div>
              <div className="cn-stats-strip-label">Ca chỉnh nha thành công</div>
            </div>
            <div className="cn-stats-strip-item">
              <div className="cn-stats-strip-num">{doctors}</div>
              <div className="cn-stats-strip-label">Bác sĩ chuyên khoa</div>
            </div>
            <div className="cn-stats-strip-item">
              <div className="cn-stats-strip-num">{years}+</div>
              <div className="cn-stats-strip-label">Năm kinh nghiệm trung bình</div>
            </div>
            <div className="cn-stats-strip-item">
              <div className="cn-stats-strip-num">{satisfy}%</div>
              <div className="cn-stats-strip-label">Khách hàng hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team grid */}
      <section className="sec-pad">
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }} data-reveal>
            <div className="cn-eyebrow">Đội ngũ chuyên gia</div>
            <h2 className="cn-title">Gặp gỡ <em>bác sĩ</em> của bạn</h2>
          </div>

          <div className="cn-bac-si-grid">
            {team.map((m, i) => (
              <div className="cn-doctor-card" key={m.id} data-reveal data-delay={String(i % 3)}>
                <div className="cn-doctor-img-wrap">
                  {m.image && (
                    <img src={m.image} alt={m.name} className="cn-doctor-img" loading="lazy" />
                  )}
                  {m.badge && <div className="cn-doctor-badge">{m.badge}</div>}
                  {m.cases_count > 0 && (
                    <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(17,16,9,.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(26,107,82,.3)', borderRadius: 10, padding: '8px 14px', textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-mid)', lineHeight: 1 }}>{Number(m.cases_count).toLocaleString('vi-VN')}</div>
                      <div style={{ fontSize: 10, fontWeight: 300, color: 'rgba(255,255,255,.45)', marginTop: 2 }}>ca điều trị</div>
                    </div>
                  )}
                </div>
                <div className="cn-doctor-body">
                  <div className="cn-doctor-name">{m.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>{m.title}</div>
                  {m.specialty && <div className="cn-doctor-specialty">{m.specialty}</div>}
                  {m.education && (
                    <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 10, paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>
                      {m.education}
                    </div>
                  )}
                  {m.certifications && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {m.certifications.split('|').map(c => (
                        <span key={c.trim()} style={{ fontSize: 10, fontWeight: 500, color: 'var(--accent)', background: 'var(--accent-light)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--accent-border)' }}>
                          {c.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cn-cta">
        <div className="wd-container">
          <div className="cn-cta-inner" data-reveal>
            <div className="cn-eyebrow" style={{ justifyContent: 'center' }}>Đặt lịch ngay</div>
            <h2 className="cn-title" style={{ color: '#fff' }}>Tư vấn trực tiếp với <em>bác sĩ chuyên khoa</em></h2>
            <p className="cn-sub" style={{ color: 'rgba(255,255,255,.45)', margin: '0 auto 36px' }}>
              Đặt lịch tư vấn để được gặp trực tiếp bác sĩ chuyên khoa — thăm khám, scan 3D và nhận kế hoạch điều trị cá nhân hóa miễn phí.
            </p>
            <div className="cn-cta-btns">
              <Link to="/dat-lich" className="cn-btn cn-btn-primary">Đặt lịch tư vấn miễn phí</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
