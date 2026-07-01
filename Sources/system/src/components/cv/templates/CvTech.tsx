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

export default function CvTech({ data, isPrint }: Props) {
  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null
  const projects = data.projects as CvProject[] | null
  const certs = data.certifications as CvCertification[] | null
  const languages = data.languages as CvLanguage[] | null

  const hasContact = data.email || data.phone || data.location || data.website || data.linkedin || data.github || data.twitter

  // Group skills by category
  const skillsByCategory: Record<string, CvSkill[]> = {}
  if (hasContent(skills)) {
    skills!.forEach(skill => {
      const cat = skill.category || 'Kỹ năng'
      if (!skillsByCategory[cat]) skillsByCategory[cat] = []
      skillsByCategory[cat].push(skill)
    })
  }

  return (
    <div style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace", color: '#e2e8f0', background: '#0a0e1a', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&display=swap');
        @media print {
          .cv-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .cv-surface { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .cv-section { page-break-inside: avoid; }
        }
      `}</style>

      {/* Header */}
      <div className="cv-header cv-surface" style={{ background: '#111827', padding: '36px 40px', borderBottom: '1px solid #1f2937' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8, letterSpacing: 1 }}>
              {'// welcome to my cv'}
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#00d084', lineHeight: 1.2 }}>
              <span style={{ color: '#6b7280', fontWeight: 300 }}>&gt;_ </span>
              {data.fullName || 'Họ và Tên'}
            </h1>
            <div style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>
              {data.jobTitle || 'Chức danh'}
            </div>
            {hasContact && (
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 12 }}>
                {'// '}
                {[data.email, data.phone, data.location, data.website, data.linkedin, data.github, data.twitter]
                  .filter(Boolean).join(' · ')}
              </div>
            )}
            {data.summary && (
              <p style={{ margin: '16px 0 0', fontSize: 13, color: '#94a3b8', lineHeight: 1.8, maxWidth: 560, fontWeight: 300 }}>
                {'/* '}{data.summary}{' */'}
              </p>
            )}
          </div>
          {data.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.avatarUrl} alt={data.fullName ?? ''} style={{ width: 80, height: 80, borderRadius: 4, objectFit: 'cover', border: '1px solid #00d084', flexShrink: 0, opacity: 0.9 }} />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: 4, background: 'rgba(0,208,132,.06)', border: '1px solid rgba(0,208,132,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 24, fontWeight: 700, color: '#00d084', fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2 }}>
              {getInitials(data.fullName)}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '0 40px 48px' }}>
        {/* Experience */}
        {hasContent(experience) && (
          <div className="cv-section" style={{ marginTop: 32 }}>
            <div style={{ fontSize: 12, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20, paddingBottom: 8, borderBottom: '1px solid #1f2937' }}>
              {'// KINH NGHIỆM LÀM VIỆC'}
            </div>
            {experience!.map(exp => (
              <div key={exp.id} style={{ marginBottom: 24, paddingLeft: 16, borderLeft: '2px solid #1f2937' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f0' }}>{exp.role}</div>
                    <div style={{ fontSize: 13, color: '#00d084', marginTop: 3 }}>{exp.company}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                    {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                  </div>
                </div>
                {exp.description && (
                  <p style={{ margin: '10px 0 0', fontSize: 13, color: '#94a3b8', lineHeight: 1.8 }}>
                    {exp.description.split('\n').map((line, i) => (
                      <span key={i}>
                        {i > 0 ? <br /> : null}
                        {line.trim() ? <><span style={{ color: '#6b7280', marginRight: 6 }}>▹</span>{line}</> : null}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {hasContent(education) && (
          <div className="cv-section" style={{ marginTop: 32 }}>
            <div style={{ fontSize: 12, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20, paddingBottom: 8, borderBottom: '1px solid #1f2937' }}>
              {'// HỌC VẤN'}
            </div>
            {education!.map(edu => (
              <div key={edu.id} style={{ marginBottom: 18, paddingLeft: 16, borderLeft: '2px solid #1f2937' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f0' }}>{edu.school}</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 3 }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}</div>
                    {edu.gpa && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>gpa: {edu.gpa}</div>}
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                  </div>
                </div>
                {edu.description && (
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {hasContent(skills) && (
          <div className="cv-section" style={{ marginTop: 32 }}>
            <div style={{ fontSize: 12, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20, paddingBottom: 8, borderBottom: '1px solid #1f2937' }}>
              {'// KỸ NĂNG'}
            </div>
            {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
              <div key={cat} style={{ marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: '#6b7280', marginRight: 8 }}>{cat}:</span>
                <span style={{ fontSize: 13, color: '#e2e8f0' }}>
                  {catSkills.map(s => s.name).join(' · ')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {hasContent(projects) && (
          <div className="cv-section" style={{ marginTop: 32 }}>
            <div style={{ fontSize: 12, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20, paddingBottom: 8, borderBottom: '1px solid #1f2937' }}>
              {'// DỰ ÁN'}
            </div>
            {projects!.map(proj => (
              <div key={proj.id} style={{ marginBottom: 20, paddingLeft: 16, borderLeft: '2px solid #1f2937' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#00d084' }}>
                  {proj.name}
                  {proj.url && <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 300, marginLeft: 8 }}>{proj.url}</span>}
                </div>
                {proj.description && (
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#94a3b8', lineHeight: 1.75 }}>{proj.description}</p>
                )}
                {proj.tech && proj.tech.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                    {proj.tech.map((t, i) => (
                      <span key={i} style={{ fontSize: 11, padding: '2px 8px', border: '1px solid rgba(0,208,132,.3)', color: '#00d084', borderRadius: 3, background: 'rgba(0,208,132,.05)' }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Languages + Certs */}
        {(hasContent(languages) || hasContent(certs)) && (
          <div style={{ display: 'grid', gridTemplateColumns: hasContent(languages) && hasContent(certs) ? '1fr 1fr' : '1fr', gap: 40, marginTop: 32 }}>
            {hasContent(languages) && (
              <div className="cv-section">
                <div style={{ fontSize: 12, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #1f2937' }}>
                  {'// NGÔN NGỮ'}
                </div>
                {languages!.map(lang => (
                  <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                    <span style={{ color: '#e2e8f0' }}>{lang.language}</span>
                    <span style={{ color: '#6b7280' }}>{LANG_LEVELS[lang.level]}</span>
                  </div>
                ))}
              </div>
            )}
            {hasContent(certs) && (
              <div className="cv-section">
                <div style={{ fontSize: 12, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #1f2937' }}>
                  {'// CHỨNG CHỈ'}
                </div>
                {certs!.map(cert => (
                  <div key={cert.id} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, color: '#e2e8f0' }}>{cert.name}</div>
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
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#6b7280', fontSize: 13 }}>
          {'// Điền thông tin ở panel bên trái để xem preview CV của bạn'}
        </div>
      )}
    </div>
  )
}
