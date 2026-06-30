import type { CvDataType, CvExperience, CvEducation, CvSkill, CvProject, CvCertification, CvLanguage } from '@/types/cv'

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const hasContent = (val: unknown[] | null | undefined): boolean =>
  Array.isArray(val) && val.length > 0

const LEVEL_LABELS = ['', 'Cơ bản', 'Trung bình', 'Khá', 'Tốt', 'Thành thạo']
const LANG_LEVELS: Record<string, string> = { native: 'Bản ngữ', fluent: 'Thành thạo', intermediate: 'Trung cấp', basic: 'Cơ bản' }

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')).toUpperCase()
}

export default function CvDark({ data, isPrint }: Props) {
  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null
  const projects = data.projects as CvProject[] | null
  const certs = data.certifications as CvCertification[] | null
  const languages = data.languages as CvLanguage[] | null

  const hasContact = data.email || data.phone || data.location || data.website || data.linkedin || data.github || data.twitter

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f1f5f9', background: '#0f172a', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-header, .cv-sidebar { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Header */}
      <div className="cv-header" style={{ background: '#0f172a', padding: '40px 40px 32px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
              {data.fullName || 'Họ và Tên'}
            </h1>
            <div style={{ fontSize: 15, color: '#06b6d4', fontWeight: 500, marginTop: 6, textShadow: '0 0 20px rgba(6,182,212,.5)' }}>
              {data.jobTitle || 'Chức danh'}
            </div>
            {data.summary && (
              <p style={{ margin: '14px 0 0', fontSize: 13, color: '#94a3b8', lineHeight: 1.7, maxWidth: 520, fontWeight: 300 }}>
                {data.summary}
              </p>
            )}
          </div>
          {data.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.avatarUrl}
              alt={data.fullName ?? ''}
              style={{ width: 84, height: 84, borderRadius: 10, objectFit: 'cover', border: '2px solid #06b6d4', boxShadow: '0 0 20px rgba(6,182,212,.3)', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 84, height: 84, borderRadius: 10, background: 'rgba(6,182,212,.08)', border: '2px solid rgba(6,182,212,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 26, fontWeight: 700, color: '#06b6d4', letterSpacing: 2, fontFamily: "'Space Grotesk', sans-serif" }}>
              {getInitials(data.fullName)}
            </div>
          )}
        </div>
      </div>

      {/* Contact bar */}
      {hasContact && (
        <div style={{ background: '#1e293b', padding: '12px 40px', display: 'flex', flexWrap: 'wrap', gap: '6px 20px', borderBottom: '1px solid #334155' }}>
          {data.email && (
            <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#06b6d4', fontSize: 11 }}>✉</span>
              {data.email}
            </span>
          )}
          {data.phone && (
            <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#06b6d4', fontSize: 11 }}>☎</span>
              {data.phone}
            </span>
          )}
          {data.location && (
            <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#06b6d4', fontSize: 11 }}>⌖</span>
              {data.location}
            </span>
          )}
          {data.website && (
            <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#06b6d4', fontSize: 11 }}>⬡</span>
              {data.website}
            </span>
          )}
          {data.linkedin && (
            <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#06b6d4', fontSize: 11 }}>in</span>
              {data.linkedin}
            </span>
          )}
          {data.github && (
            <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#06b6d4', fontSize: 11 }}>gh</span>
              {data.github}
            </span>
          )}
          {data.twitter && (
            <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#06b6d4', fontSize: 11 }}>tw</span>
              {data.twitter}
            </span>
          )}
        </div>
      )}

      {/* Body: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 0 }}>
        {/* Left column */}
        <div style={{ padding: '8px 32px 40px 40px', borderRight: '1px solid #334155' }}>
          {/* Experience */}
          {hasContent(experience) && (
            <div className="cv-section" style={{ marginTop: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#06b6d4', borderBottom: '1px solid rgba(6,182,212,.25)', paddingBottom: 8, marginBottom: 16 }}>
                Kinh nghiệm làm việc
              </div>
              {(experience as CvExperience[]).map(exp => (
                <div key={exp.id} style={{ marginBottom: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#f1f5f9' }}>{exp.role}</div>
                      <div style={{ fontSize: 13, color: '#06b6d4', fontWeight: 500 }}>{exp.company}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', whiteSpace: 'nowrap', background: '#1e293b', padding: '2px 8px', borderRadius: 4 }}>
                      {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ margin: '8px 0 0', fontSize: 13, color: '#94a3b8', lineHeight: 1.7, fontWeight: 300 }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {hasContent(education) && (
            <div className="cv-section" style={{ marginTop: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#06b6d4', borderBottom: '1px solid rgba(6,182,212,.25)', paddingBottom: 8, marginBottom: 16 }}>
                Học vấn
              </div>
              {(education as CvEducation[]).map(edu => (
                <div key={edu.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#f1f5f9' }}>{edu.school}</div>
                      <div style={{ fontSize: 13, color: '#94a3b8' }}>
                        {[edu.degree, edu.field].filter(Boolean).join(', ')}
                      </div>
                      {edu.gpa && <div style={{ fontSize: 12, color: '#475569' }}>GPA: {edu.gpa}</div>}
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', whiteSpace: 'nowrap', background: '#1e293b', padding: '2px 8px', borderRadius: 4 }}>
                      {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                    </div>
                  </div>
                  {edu.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#94a3b8', lineHeight: 1.7, fontWeight: 300 }}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {hasContent(projects) && (
            <div className="cv-section" style={{ marginTop: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#06b6d4', borderBottom: '1px solid rgba(6,182,212,.25)', paddingBottom: 8, marginBottom: 16 }}>
                Dự án
              </div>
              {(projects as CvProject[]).map(proj => (
                <div key={proj.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#f1f5f9' }}>{proj.name}</span>
                    {proj.url && <span style={{ fontSize: 12, color: '#06b6d4' }}>{proj.url}</span>}
                  </div>
                  {proj.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#94a3b8', lineHeight: 1.7, fontWeight: 300 }}>
                      {proj.description}
                    </p>
                  )}
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {proj.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 11, background: '#1e293b', color: '#06b6d4', borderRadius: 4, padding: '2px 7px', border: '1px solid #334155' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ padding: '8px 32px 40px 28px' }}>
          {/* Skills */}
          {hasContent(skills) && (
            <div className="cv-section" style={{ marginTop: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#06b6d4', borderBottom: '1px solid rgba(6,182,212,.25)', paddingBottom: 8, marginBottom: 16 }}>
                Kỹ năng
              </div>
              {(skills as CvSkill[]).map(skill => (
                <div key={skill.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: '#e2e8f0' }}>{skill.name}</span>
                    <span style={{ color: '#475569', fontSize: 11 }}>{LEVEL_LABELS[skill.level]}</span>
                  </div>
                  <div style={{ height: 6, background: '#334155', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(skill.level / 5) * 100}%`,
                      background: '#06b6d4',
                      borderRadius: 4,
                      boxShadow: '0 0 8px rgba(6,182,212,.6)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {hasContent(languages) && (
            <div className="cv-section" style={{ marginTop: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#06b6d4', borderBottom: '1px solid rgba(6,182,212,.25)', paddingBottom: 8, marginBottom: 16 }}>
                Ngôn ngữ
              </div>
              {(languages as CvLanguage[]).map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#e2e8f0' }}>{lang.language}</span>
                  <span style={{ fontSize: 11, color: '#06b6d4', background: 'rgba(6,182,212,.1)', padding: '2px 8px', borderRadius: 4 }}>
                    {LANG_LEVELS[lang.level]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {hasContent(certs) && (
            <div className="cv-section" style={{ marginTop: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#06b6d4', borderBottom: '1px solid rgba(6,182,212,.25)', paddingBottom: 8, marginBottom: 16 }}>
                Chứng chỉ
              </div>
              {(certs as CvCertification[]).map(cert => (
                <div key={cert.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>{cert.name}</div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{cert.issuer}</div>
                  <div style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>{cert.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!data.fullName && !hasContent(experience) && !hasContent(skills) && (
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#475569', fontSize: 14 }}>
          Điền thông tin ở panel bên trái để xem preview CV của bạn
        </div>
      )}
    </div>
  )
}
