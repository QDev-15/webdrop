import React, { useState, useEffect } from 'react'
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

const STRENGTHS = [
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>`,
    title: 'Đào tạo bài bản',
    desc: 'Toàn bộ bác sĩ được đào tạo tại các trường Y hàng đầu Việt Nam và tu nghiệp chuyên sâu tại Hàn Quốc, Nhật Bản, Pháp, Đức.',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    title: 'Chứng chỉ quốc tế',
    desc: 'Sở hữu các chứng chỉ hành nghề từ ISAPS, ASLMS, IPRAS và được Bộ Y tế Việt Nam cấp phép hoạt động đầy đủ.',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
    title: 'Kinh nghiệm thực chiến',
    desc: 'Mỗi bác sĩ đã thực hiện hàng nghìn ca phẫu thuật và điều trị, với tỷ lệ thành công trên 98% được ghi nhận và kiểm chứng.',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`,
    title: 'Tận tâm với khách hàng',
    desc: 'Mỗi bác sĩ cam kết theo dõi kết quả sau điều trị, luôn sẵn sàng tư vấn và hỗ trợ khách hàng trong suốt quá trình phục hồi.',
  },
]

export default function BacSiPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Đội ngũ bác sĩ — ${settings.site_name || 'Thẩm Mỹ Viện Quốc Tế'}`,
    description: 'Đội ngũ bác sĩ thẩm mỹ giàu kinh nghiệm, đào tạo bài bản trong và ngoài nước, sở hữu chứng chỉ hành nghề quốc tế.',
  })
  const [team, setTeam]       = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<TeamMember[]>('/public/team').then(setTeam).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* Page hero */}
      <section className="tmv-page-hero">
        <div className="wd-container">
          <div data-reveal>
            <div className="tmv-ph-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Đội ngũ chuyên gia
            </div>
            <h1 className="tmv-ph-title">Gặp gỡ <em>đội ngũ</em> bác sĩ</h1>
            <p className="tmv-ph-sub">Mỗi bác sĩ là sự kết hợp giữa chuyên môn y khoa đỉnh cao và đam mê mang lại vẻ đẹp tự nhiên, an toàn cho khách hàng.</p>
          </div>
        </div>
      </section>

      {/* Credentials strip */}
      <section style={{ background: 'var(--bg)', padding: 'clamp(40px,5vw,56px) 0' }}>
        <div className="wd-container">
          <div className="tmv-cred-strip" data-reveal>
            {[
              { num: '15+', label: 'Bác sĩ\nchuyên khoa' },
              { num: '8.500+', label: 'Ca thực hiện\nthành công' },
              { num: '12 năm', label: 'Kinh nghiệm\ntập thể' },
              { num: '98%', label: 'Khách hàng\nhài lòng' },
              { num: '6', label: 'Chuyên khoa\nkhác nhau' },
            ].map((item, i) => (
              <React.Fragment key={item.num}>
                {i > 0 && <div className="tmv-cred-divider" />}
                <div className="tmv-cred-item">
                  <div className="tmv-cred-num">{item.num}</div>
                  <div className="tmv-cred-label" style={{ whiteSpace: 'pre-line' }}>{item.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors grid */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="tmv-label" style={{ justifyContent: 'center' }}>Đội ngũ bác sĩ</div>
            <h2 className="tmv-h2">Chuyên gia <em>hàng đầu</em> đồng hành cùng bạn</h2>
            <div className="tmv-divider center" />
            <p className="tmv-lead center">Toàn bộ bác sĩ được đào tạo tại các trung tâm y tế uy tín trong và ngoài nước, sở hữu chứng chỉ quốc tế và kinh nghiệm thực chiến hàng nghìn ca.</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
              Đang tải thông tin đội ngũ...
            </div>
          ) : (
            <div className="row g-4">
              {team.map((m, i) => {
                const edus  = m.education      ? m.education.split('|').map(s => s.trim()).filter(Boolean) : []
                const certs = m.certifications ? m.certifications.split('|').map(s => s.trim()).filter(Boolean) : []
                return (
                  <div key={m.id} className="col-12 col-md-6 col-lg-4" data-reveal data-delay={String(Math.min((i % 3) + 1, 4)) as '1'|'2'|'3'|'4'}>
                    <div className="tmv-doc-full">
                      <div className="tmv-doc-full-img-wrap">
                        {m.image ? (
                          <img
                            className="tmv-doc-full-img"
                            src={m.image}
                            alt={m.name}
                            loading="lazy"
                          />
                        ) : (
                          <div className="tmv-doc-full-img" style={{ background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 64, opacity: .2 }}>👨‍⚕️</span>
                          </div>
                        )}
                        {m.badge && <div className="tmv-doc-full-badge">{m.badge}</div>}
                        {m.experience && (
                          <div className="tmv-doc-full-exp">
                            <div className="tmv-doc-full-exp-num">{m.experience}</div>
                            <div className="tmv-doc-full-exp-label">kinh nghiệm</div>
                          </div>
                        )}
                      </div>

                      <div className="tmv-doc-full-body">
                        <div className="tmv-doc-full-name">{m.name}</div>
                        <div className="tmv-doc-full-role">{m.role}</div>
                        {m.specialty && <p className="tmv-doc-full-desc">{m.specialty}</p>}

                        <div className="tmv-doc-full-meta">
                          {edus.length > 0 && (
                            <div className="tmv-doc-meta-row">
                              <div className="tmv-doc-meta-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" width="13" height="13">
                                  <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                                </svg>
                              </div>
                              <div className="tmv-doc-meta-text">
                                <strong>Học vị</strong>
                                {edus.map((e, ei) => <span key={`edu-${ei}`}>{e}{ei < edus.length - 1 ? <br /> : ''}</span>)}
                              </div>
                            </div>
                          )}
                          {m.cases_count > 0 && (
                            <div className="tmv-doc-meta-row">
                              <div className="tmv-doc-meta-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" width="13" height="13">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                              </div>
                              <div className="tmv-doc-meta-text">
                                <strong>Kinh nghiệm</strong>
                                {m.experience} — {Number(m.cases_count).toLocaleString('vi-VN')}+ ca thực hiện thành công
                              </div>
                            </div>
                          )}
                        </div>

                        {certs.length > 0 && (
                          <div className="tmv-doc-certs">
                            {certs.map(c => (
                              <span key={c} className="tmv-doc-cert-tag">{c}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Strength cards */}
      <section className="sec-pad" style={{ background: 'var(--clinical-white)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="tmv-label" style={{ justifyContent: 'center' }}>Tại sao chọn chúng tôi</div>
            <h2 className="tmv-h2">Điều làm nên <em>sự khác biệt</em></h2>
          </div>

          <div className="row g-4">
            {STRENGTHS.map((s, i) => (
              <div key={i} className="col-12 col-sm-6" data-reveal data-delay={String(i + 1) as '1'|'2'|'3'|'4'}>
                <div className="tmv-str-card">
                  <div className="tmv-str-icon" dangerouslySetInnerHTML={{ __html: s.icon }} />
                  <div className="tmv-str-title">{s.title}</div>
                  <div className="tmv-str-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5" data-reveal>
            <Link to="/tu-van" className="tmv-btn tmv-btn-gold">
              Đặt lịch tư vấn cùng bác sĩ →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
