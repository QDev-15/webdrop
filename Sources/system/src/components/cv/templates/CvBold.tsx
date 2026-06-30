import type { CvDataType, CvExperience, CvEducation, CvSkill, CvProject, CvCertification, CvLanguage } from '@/types/cv'

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')).toUpperCase()
}

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const LANG_LEVELS = { native: 'Bản ngữ', fluent: 'Thành thạo', intermediate: 'Trung cấp', basic: 'Cơ bản' }

const hasContent = (val: unknown[] | null | undefined): boolean =>
  Array.isArray(val) && val.length > 0

function MainSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18, marginTop: 32 }}>
      <div style={{ fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: '#111827', lineHeight: 1 }}>
        {children}
      </div>
      <div style={{ marginTop: 6, width: 32, height: 3, background: '#f59e0b', borderRadius: 2 }} />
    </div>
  )
}

export default function CvBold({ data, isPrint }: Props) {
  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null
  const projects = data.projects as CvProject[] | null
  const certs = data.certifications as CvCertification[] | null
  const languages = data.languages as CvLanguage[] | null

  return (
    <div style={{ fontFamily: "'Syne', 'Barlow', sans-serif", color: '#111827', background: '#ffffff', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Barlow:wght@300;400;500;600;700;800&display=swap');
        @media print {
          .cv-sidebar { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .cv-section { page-break-inside: avoid; }
        }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '30% 1fr', minHeight: 600 }}>
        {/* Left sidebar — dark */}
        <div className="cv-sidebar" style={{ background: '#111827', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {data.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.avatarUrl} alt={data.fullName ?? ''} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8, marginBottom: 24, border: '3px solid #f59e0b' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '1/1', background: 'rgba(245,158,11,.1)', border: '3px solid #f59e0b', borderRadius: 8, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 800, color: '#f59e0b', letterSpacing: 2, fontFamily: "'Syne', sans-serif" }}>
              {getInitials(data.fullName)}
            </div>
          )}

          <h1 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800, textTransform: 'uppercase', color: '#ffffff', lineHeight: 1.2, letterSpacing: 1, wordBreak: 'break-word' }}>
            {data.fullName || 'Họ và Tên'}
          </h1>
          <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 24 }}>
            {data.jobTitle || 'Chức danh'}
          </div>

          {/* Contact */}
          {(data.email || data.phone || data.location || data.website || data.linkedin || data.github || data.twitter) && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: '#f59e0b', marginBottom: 12 }}>Liên hệ</div>
              {[data.email, data.phone, data.location, data.website, data.linkedin, data.github, data.twitter]
                .filter(Boolean).map((item, i) => (
                  <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', marginBottom: 6, wordBreak: 'break-all', lineHeight: 1.4 }}>{item}</div>
                ))}
            </div>
          )}

          {/* Skills */}
          {hasContent(skills) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: '#f59e0b', marginBottom: 14 }}>Kỹ năng</div>
              {skills!.map(skill => (
                <div key={skill.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', marginBottom: 5, fontWeight: 500 }}>{skill.name}</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} style={{ width: 10, height: 10, borderRadius: '50%', background: n <= skill.level ? '#f59e0b' : 'rgba(255,255,255,.15)' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {hasContent(languages) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: '#f59e0b', marginBottom: 12 }}>Ngôn ngữ</div>
              {languages!.map(lang => (
                <div key={lang.id} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', fontWeight: 500 }}>{lang.language}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginTop: 2 }}>{LANG_LEVELS[lang.level]}</div>
                </div>
              ))}
            </div>
          )}

          {/* Certs */}
          {hasContent(certs) && (
            <div className="cv-section">
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: '#f59e0b', marginBottom: 12 }}>Chứng chỉ</div>
              {certs!.map(cert => (
                <div key={cert.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', fontWeight: 500 }}>{cert.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginTop: 2 }}>{cert.issuer} · {cert.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right main */}
        <div style={{ padding: '40px 36px 48px', background: '#fafafa' }}>
          {/* Summary */}
          {data.summary && (
            <div style={{ marginBottom: 8, paddingBottom: 24, borderBottom: '1px solid #e5e7eb' }}>
              <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.85, fontWeight: 300 }}>{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {hasContent(experience) && (
            <div className="cv-section">
              <MainSectionTitle>Kinh nghiệm</MainSectionTitle>
              {experience!.map(exp => (
                <div key={exp.id} style={{ marginBottom: 22, paddingLeft: 16, borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{exp.role}</div>
                      <div style={{ fontSize: 13, color: '#92400e', fontWeight: 600, marginTop: 2 }}>{exp.company}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap', marginTop: 2 }}>
                      {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ margin: '8px 0 0', fontSize: 13, color: '#374151', lineHeight: 1.8 }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {hasContent(education) && (
            <div className="cv-section">
              <MainSectionTitle>Học vấn</MainSectionTitle>
              {education!.map(edu => (
                <div key={edu.id} style={{ marginBottom: 18, paddingLeft: 16, borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{edu.school}</div>
                      <div style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}</div>
                      {edu.gpa && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>GPA: {edu.gpa}</div>}
                    </div>
                    <div style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                    </div>
                  </div>
                  {edu.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#374151', lineHeight: 1.75 }}>{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {hasContent(projects) && (
            <div className="cv-section">
              <MainSectionTitle>Dự án</MainSectionTitle>
              {projects!.map(proj => (
                <div key={proj.id} style={{ marginBottom: 20, paddingLeft: 16, borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>
                    {proj.name}
                    {proj.url && <span style={{ fontSize: 12, color: '#92400e', fontWeight: 400, marginLeft: 8 }}>{proj.url}</span>}
                  </div>
                  {proj.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#374151', lineHeight: 1.75 }}>{proj.description}</p>
                  )}
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                      {proj.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!data.fullName && !hasContent(experience) && !hasContent(skills) && (
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
          Điền thông tin ở panel bên trái để xem preview CV của bạn
        </div>
      )}
    </div>
  )
}
