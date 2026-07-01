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

function DoubleDivider() {
  return (
    <div style={{ position: 'relative', margin: '20px 0 18px' }}>
      <div style={{ borderTop: '1px solid #fecdd3' }} />
      <div style={{ borderTop: '1px solid #fecdd3', marginTop: 3 }} />
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 400, fontStyle: 'italic', color: '#9f1239', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
      {children}
    </div>
  )
}

export default function CvElegant({ data, isPrint }: Props) {
  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null
  const projects = data.projects as CvProject[] | null
  const certs = data.certifications as CvCertification[] | null
  const languages = data.languages as CvLanguage[] | null

  const hasContact = data.email || data.phone || data.location || data.website || data.linkedin || data.github || data.twitter

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', 'Lora', Georgia, serif", color: '#1c1917', background: '#fff1f2', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
        @media print {
          .cv-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .cv-section { page-break-inside: avoid; }
        }
      `}</style>

      <div style={{ maxWidth: 720, margin: '0 auto', background: '#ffffff', padding: '56px 60px 60px' }}>
        {/* Header */}
        <div className="cv-header" style={{ textAlign: 'center' }}>
          {data.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.avatarUrl}
              alt={data.fullName ?? ''}
              style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '3px solid #9f1239', display: 'block', margin: '0 auto 16px' }}
            />
          ) : (
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#fecdd3', border: '3px solid #9f1239', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 30, fontWeight: 600, color: '#9f1239', letterSpacing: 1, fontFamily: "'Cormorant Garamond', serif" }}>
              {getInitials(data.fullName)}
            </div>
          )}
          <h1 style={{ margin: 0, fontSize: 52, fontWeight: 300, fontStyle: 'italic', color: '#1c1917', lineHeight: 1.05, letterSpacing: '-1px' }}>
            {data.fullName || 'Họ và Tên'}
          </h1>
          {data.jobTitle && (
            <div style={{ fontSize: 16, color: '#be123c', fontWeight: 400, marginTop: 10, letterSpacing: 1 }}>
              {data.jobTitle}
            </div>
          )}
          {hasContact && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 16px', marginTop: 14 }}>
              {[data.email, data.phone, data.location, data.website, data.linkedin, data.github, data.twitter]
                .filter(Boolean).map((item, i) => (
                  <span key={i} style={{ fontSize: 12, color: '#78716c' }}>{item}</span>
                ))}
            </div>
          )}
          {data.summary && (
            <p style={{ margin: '16px auto 0', fontSize: 15, color: '#44403c', lineHeight: 1.85, maxWidth: 540, fontWeight: 300, fontStyle: 'italic' }}>
              {data.summary}
            </p>
          )}
        </div>

        {/* Experience */}
        {hasContent(experience) && (
          <div className="cv-section">
            <DoubleDivider />
            <SectionTitle>Kinh nghiệm làm việc</SectionTitle>
            {experience!.map(exp => (
              <div key={exp.id} style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#1c1917' }}>{exp.role}</div>
                    <div style={{ fontSize: 14, color: '#9f1239', fontStyle: 'italic', marginTop: 2 }}>{exp.company}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#78716c', whiteSpace: 'nowrap', fontStyle: 'italic', marginTop: 2 }}>
                    {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                  </div>
                </div>
                {exp.description && (
                  <p style={{ margin: '8px 0 0', fontSize: 14, color: '#57534e', lineHeight: 1.8 }}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {hasContent(education) && (
          <div className="cv-section">
            <DoubleDivider />
            <SectionTitle>Học vấn</SectionTitle>
            {education!.map(edu => (
              <div key={edu.id} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{edu.school}</div>
                    <div style={{ fontSize: 14, color: '#78716c', fontStyle: 'italic', marginTop: 2 }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}</div>
                    {edu.gpa && <div style={{ fontSize: 12, color: '#a8a29e', marginTop: 2 }}>GPA: {edu.gpa}</div>}
                  </div>
                  <div style={{ fontSize: 12, color: '#78716c', whiteSpace: 'nowrap', fontStyle: 'italic', marginTop: 2 }}>
                    {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                  </div>
                </div>
                {edu.description && (
                  <p style={{ margin: '6px 0 0', fontSize: 14, color: '#57534e', lineHeight: 1.75 }}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {hasContent(skills) && (
          <div className="cv-section">
            <DoubleDivider />
            <SectionTitle>Kỹ năng</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {skills!.map(skill => (
                <span key={skill.id} style={{
                  fontSize: 13,
                  padding: '5px 14px',
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  color: '#9f1239',
                  borderRadius: 20,
                  fontStyle: 'italic',
                }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {hasContent(projects) && (
          <div className="cv-section">
            <DoubleDivider />
            <SectionTitle>Dự án</SectionTitle>
            {projects!.map(proj => (
              <div key={proj.id} style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>
                  {proj.name}
                  {proj.url && <span style={{ fontSize: 12, color: '#9f1239', fontWeight: 400, fontStyle: 'italic', marginLeft: 8 }}>{proj.url}</span>}
                </div>
                {proj.description && (
                  <p style={{ margin: '6px 0 0', fontSize: 14, color: '#57534e', lineHeight: 1.75 }}>{proj.description}</p>
                )}
                {proj.tech && proj.tech.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                    {proj.tech.map((t, i) => (
                      <span key={i} style={{ fontSize: 11, background: '#fff1f2', color: '#9f1239', border: '1px solid #fecdd3', padding: '2px 8px', borderRadius: 12 }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Languages & Certs */}
        {(hasContent(languages) || hasContent(certs)) && (
          <div style={{ display: 'grid', gridTemplateColumns: hasContent(languages) && hasContent(certs) ? '1fr 1fr' : '1fr', gap: 32 }}>
            {hasContent(languages) && (
              <div className="cv-section">
                <DoubleDivider />
                <SectionTitle>Ngôn ngữ</SectionTitle>
                {languages!.map(lang => (
                  <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, alignItems: 'center' }}>
                    <span style={{ fontStyle: 'italic' }}>{lang.language}</span>
                    <span style={{ fontSize: 12, color: '#9f1239' }}>{LANG_LEVELS[lang.level]}</span>
                  </div>
                ))}
              </div>
            )}
            {hasContent(certs) && (
              <div className="cv-section">
                <DoubleDivider />
                <SectionTitle>Chứng chỉ</SectionTitle>
                {certs!.map(cert => (
                  <div key={cert.id} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{cert.name}</div>
                    <div style={{ fontSize: 13, color: '#78716c', fontStyle: 'italic', marginTop: 2 }}>{cert.issuer} · {cert.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!data.fullName && !hasContent(experience) && !hasContent(skills) && (
          <div style={{ padding: '60px 40px', textAlign: 'center', color: '#a8a29e', fontSize: 14, fontStyle: 'italic' }}>
            Điền thông tin ở panel bên trái để xem preview CV của bạn
          </div>
        )}
      </div>
    </div>
  )
}
