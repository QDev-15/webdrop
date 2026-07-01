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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#0d9488', marginBottom: 20, marginTop: 36, paddingBottom: 8, borderBottom: '2px solid #99f6e4' }}>
      {children}
    </div>
  )
}

function TimelineItem({ children, date }: { children: React.ReactNode; date?: string }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 32, marginBottom: 24 }}>
      {/* Timeline line */}
      <div style={{ position: 'absolute', left: 7, top: 20, bottom: -24, width: 1, background: '#99f6e4' }} />
      {/* Dot */}
      <div style={{ position: 'absolute', left: 0, top: 8, width: 14, height: 14, borderRadius: '50%', background: '#0d9488', border: '2px solid #99f6e4', boxShadow: '0 0 0 3px rgba(13,148,136,.12)' }} />
      {/* Content */}
      <div style={{ background: '#ffffff', borderRadius: 8, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,.06)', border: '1px solid #ccfbf1' }}>
        {date && <div style={{ fontSize: 11, color: '#0d9488', fontWeight: 600, marginBottom: 6 }}>{date}</div>}
        {children}
      </div>
    </div>
  )
}

export default function CvTimeline({ data, isPrint }: Props) {
  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null
  const projects = data.projects as CvProject[] | null
  const certs = data.certifications as CvCertification[] | null
  const languages = data.languages as CvLanguage[] | null

  const hasContact = data.email || data.phone || data.location || data.website || data.linkedin || data.github || data.twitter

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", color: '#134e4a', background: '#f0fdf4', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400&display=swap');
        @media print {
          .cv-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .cv-section { page-break-inside: avoid; }
        }
      `}</style>

      <div style={{ maxWidth: 760, margin: '0 auto', background: '#f0fdf4', padding: '0 0 48px' }}>
        {/* Header */}
        <div className="cv-header" style={{ background: '#ffffff', padding: '36px 40px 28px', borderBottom: '2px solid #99f6e4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#0d9488', lineHeight: 1.15, letterSpacing: '-0.5px' }}>
                {data.fullName || 'Họ và Tên'}
              </h1>
              <div style={{ fontSize: 15, color: '#6b7280', fontWeight: 500, marginTop: 6 }}>
                {data.jobTitle || 'Chức danh'}
              </div>
              {hasContact && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', marginTop: 14 }}>
                  {[data.email, data.phone, data.location, data.website, data.linkedin, data.github, data.twitter]
                    .filter(Boolean).map((item, i) => (
                      <span key={i} style={{
                        fontSize: 12,
                        color: '#0d9488',
                        background: '#f0fdf4',
                        border: '1px solid #99f6e4',
                        padding: '3px 10px',
                        borderRadius: 20,
                        fontWeight: 500,
                      }}>
                        {item}
                      </span>
                    ))}
                </div>
              )}
              {data.summary && (
                <p style={{ margin: '16px 0 0', fontSize: 14, color: '#374151', lineHeight: 1.85, maxWidth: 540, fontWeight: 300 }}>
                  {data.summary}
                </p>
              )}
            </div>
            {data.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.avatarUrl} alt={data.fullName ?? ''} style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: '3px solid #0d9488', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#ccfbf1', border: '3px solid #0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 26, fontWeight: 700, color: '#0d9488', letterSpacing: 1, fontFamily: "'Nunito', sans-serif" }}>
                {getInitials(data.fullName)}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '0 40px' }}>
          {/* Experience */}
          {hasContent(experience) && (
            <div className="cv-section">
              <SectionTitle>Kinh nghiệm làm việc</SectionTitle>
              {experience!.map(exp => (
                <TimelineItem key={exp.id} date={`${exp.startDate} — ${exp.isCurrent ? 'Hiện tại' : exp.endDate}`}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#134e4a' }}>{exp.role}</div>
                  <div style={{ fontSize: 13, color: '#0d9488', fontWeight: 600, marginTop: 2 }}>{exp.company}</div>
                  {exp.description && (
                    <p style={{ margin: '8px 0 0', fontSize: 13, color: '#374151', lineHeight: 1.8 }}>{exp.description}</p>
                  )}
                </TimelineItem>
              ))}
            </div>
          )}

          {/* Education */}
          {hasContent(education) && (
            <div className="cv-section">
              <SectionTitle>Học vấn</SectionTitle>
              {education!.map(edu => (
                <TimelineItem key={edu.id} date={`${edu.startDate}${edu.endDate ? ` — ${edu.endDate}` : ''}`}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#134e4a' }}>{edu.school}</div>
                  <div style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}</div>
                  {edu.gpa && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>GPA: {edu.gpa}</div>}
                  {edu.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#374151', lineHeight: 1.7 }}>{edu.description}</p>
                  )}
                </TimelineItem>
              ))}
            </div>
          )}

          {/* Skills */}
          {hasContent(skills) && (
            <div className="cv-section">
              <SectionTitle>Kỹ năng</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {skills!.map(skill => (
                  <div key={skill.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '8px 14px', borderRadius: 8, border: '1px solid #ccfbf1' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#134e4a' }}>{skill.name}</span>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <div key={n} style={{ width: 8, height: 8, borderRadius: '50%', background: n <= skill.level ? '#0d9488' : '#ccfbf1' }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {hasContent(projects) && (
            <div className="cv-section">
              <SectionTitle>Dự án</SectionTitle>
              {projects!.map(proj => (
                <TimelineItem key={proj.id}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#134e4a' }}>
                    {proj.name}
                    {proj.url && <span style={{ fontSize: 12, color: '#0d9488', fontWeight: 400, marginLeft: 8 }}>{proj.url}</span>}
                  </div>
                  {proj.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#374151', lineHeight: 1.75 }}>{proj.description}</p>
                  )}
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                      {proj.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 11, background: '#f0fdf4', color: '#0d9488', border: '1px solid #99f6e4', padding: '2px 8px', borderRadius: 12 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </TimelineItem>
              ))}
            </div>
          )}

          {/* Languages + Certs */}
          {(hasContent(languages) || hasContent(certs)) && (
            <div style={{ display: 'grid', gridTemplateColumns: hasContent(languages) && hasContent(certs) ? '1fr 1fr' : '1fr', gap: 32 }}>
              {hasContent(languages) && (
                <div className="cv-section">
                  <SectionTitle>Ngôn ngữ</SectionTitle>
                  {languages!.map(lang => (
                    <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '8px 14px', borderRadius: 8, border: '1px solid #ccfbf1', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ fontWeight: 600, color: '#134e4a' }}>{lang.language}</span>
                      <span style={{ color: '#0d9488', fontSize: 12 }}>{LANG_LEVELS[lang.level]}</span>
                    </div>
                  ))}
                </div>
              )}
              {hasContent(certs) && (
                <div className="cv-section">
                  <SectionTitle>Chứng chỉ</SectionTitle>
                  {certs!.map(cert => (
                    <div key={cert.id} style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 8, border: '1px solid #ccfbf1', marginBottom: 6 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#134e4a' }}>{cert.name}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{cert.issuer} · {cert.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Empty state */}
        {!data.fullName && !hasContent(experience) && !hasContent(skills) && (
          <div style={{ padding: '60px 40px', textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
            Điền thông tin ở panel bên trái để xem preview CV của bạn
          </div>
        )}
      </div>
    </div>
  )
}
