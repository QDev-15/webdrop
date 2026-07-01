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

function DotLevel({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: i < level ? '#a78bfa' : 'rgba(255,255,255,.2)',
          }}
        />
      ))}
    </div>
  )
}

export default function CvCreative({ data, isPrint }: Props) {
  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null
  const projects = data.projects as CvProject[] | null
  const certs = data.certifications as CvCertification[] | null
  const languages = data.languages as CvLanguage[] | null

  const hasContact = data.email || data.phone || data.location || data.website || data.linkedin || data.github || data.twitter

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1e1b4b', background: '#ffffff', minHeight: isPrint ? 'auto' : undefined, display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-sidebar { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Sidebar Left — 35% */}
      <div className="cv-sidebar" style={{ width: '35%', minWidth: 200, background: '#4c1d95', padding: '40px 28px 40px', flexShrink: 0 }}>
        {/* Avatar */}
        {data.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.avatarUrl}
            alt={data.fullName ?? ''}
            style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 12, border: '3px solid rgba(255,255,255,.25)', marginBottom: 24, display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', aspectRatio: '1/1', background: 'rgba(255,255,255,.08)', borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(255,255,255,.2)' }}>
            <span style={{ fontSize: 42, fontWeight: 700, color: 'rgba(255,255,255,.5)', letterSpacing: 2 }}>{getInitials(data.fullName)}</span>
          </div>
        )}

        {/* Name on sidebar */}
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
          {data.fullName || 'Họ và Tên'}
        </h1>
        <div style={{ fontSize: 13, color: '#c4b5fd', fontWeight: 500, marginBottom: 24, fontStyle: 'italic' }}>
          {data.jobTitle || 'Chức danh'}
        </div>

        {/* Contact */}
        {hasContact && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>
              Liên hệ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.email && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.75)', wordBreak: 'break-all' }}>{data.email}</div>
              )}
              {data.phone && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.75)' }}>{data.phone}</div>
              )}
              {data.location && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.75)' }}>{data.location}</div>
              )}
              {data.website && (
                <div style={{ fontSize: 12, color: '#c4b5fd', wordBreak: 'break-all' }}>{data.website}</div>
              )}
              {data.linkedin && (
                <div style={{ fontSize: 12, color: '#c4b5fd', wordBreak: 'break-all' }}>{data.linkedin}</div>
              )}
              {data.github && (
                <div style={{ fontSize: 12, color: '#c4b5fd', wordBreak: 'break-all' }}>{data.github}</div>
              )}
              {data.twitter && (
                <div style={{ fontSize: 12, color: '#c4b5fd', wordBreak: 'break-all' }}>{data.twitter}</div>
              )}
            </div>
          </div>
        )}

        {/* Skills in sidebar */}
        {hasContent(skills) && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>
              Kỹ năng
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(skills as CvSkill[]).map(skill => (
                <div key={skill.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', fontWeight: 500 }}>{skill.name}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>{LEVEL_LABELS[skill.level]}</span>
                  </div>
                  <DotLevel level={skill.level} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages in sidebar */}
        {hasContent(languages) && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>
              Ngôn ngữ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(languages as CvLanguage[]).map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.85)' }}>{lang.language}</span>
                  <span style={{ fontSize: 10, color: '#c4b5fd' }}>{LANG_LEVELS[lang.level]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications in sidebar */}
        {hasContent(certs) && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>
              Chứng chỉ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(certs as CvCertification[]).map(cert => (
                <div key={cert.id}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', fontWeight: 500 }}>{cert.name}</div>
                  <div style={{ fontSize: 11, color: '#c4b5fd' }}>{cert.issuer} · {cert.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Right — 65% */}
      <div style={{ flex: 1, padding: '40px 36px 40px', overflow: 'hidden' }}>
        {/* Summary */}
        {data.summary && (
          <div className="cv-section" style={{ marginBottom: 32 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#4c4580', lineHeight: 1.8, fontWeight: 300 }}>
              {data.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {hasContent(experience) && (
          <div className="cv-section" style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#7c3aed', marginBottom: 16 }}>
              Kinh nghiệm làm việc
            </div>
            {(experience as CvExperience[]).map(exp => (
              <div key={exp.id} style={{ marginBottom: 20, paddingLeft: 14, borderLeft: '2px solid #ede9fe' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1e1b4b' }}>{exp.role}</div>
                    <div style={{ fontSize: 13, color: '#7c3aed', fontWeight: 500 }}>{exp.company}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#a09d97', whiteSpace: 'nowrap' }}>
                    {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                  </div>
                </div>
                {exp.description && (
                  <p style={{ margin: '8px 0 0', fontSize: 13, color: '#4c4580', lineHeight: 1.7, fontWeight: 300 }}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {hasContent(education) && (
          <div className="cv-section" style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#7c3aed', marginBottom: 16 }}>
              Học vấn
            </div>
            {(education as CvEducation[]).map(edu => (
              <div key={edu.id} style={{ marginBottom: 16, paddingLeft: 14, borderLeft: '2px solid #ede9fe' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1e1b4b' }}>{edu.school}</div>
                    <div style={{ fontSize: 13, color: '#6d28d9' }}>
                      {[edu.degree, edu.field].filter(Boolean).join(', ')}
                    </div>
                    {edu.gpa && <div style={{ fontSize: 12, color: '#a09d97' }}>GPA: {edu.gpa}</div>}
                  </div>
                  <div style={{ fontSize: 12, color: '#a09d97', whiteSpace: 'nowrap' }}>
                    {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                  </div>
                </div>
                {edu.description && (
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#4c4580', lineHeight: 1.7, fontWeight: 300 }}>
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {hasContent(projects) && (
          <div className="cv-section">
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#7c3aed', marginBottom: 16 }}>
              Dự án
            </div>
            {(projects as CvProject[]).map(proj => (
              <div key={proj.id} style={{ marginBottom: 16, paddingLeft: 14, borderLeft: '2px solid #ede9fe' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1e1b4b' }}>{proj.name}</div>
                {proj.url && <div style={{ fontSize: 12, color: '#7c3aed' }}>{proj.url}</div>}
                {proj.description && (
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#4c4580', lineHeight: 1.7, fontWeight: 300 }}>
                    {proj.description}
                  </p>
                )}
                {proj.tech && proj.tech.length > 0 && (
                  <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {proj.tech.map((t, i) => (
                      <span key={i} style={{ fontSize: 11, background: '#ede9fe', color: '#7c3aed', borderRadius: 4, padding: '2px 7px' }}>
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

      {/* Empty state */}
      {!data.fullName && !hasContent(experience) && !hasContent(skills) && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', padding: '60px 40px', textAlign: 'center', color: '#a09d97', fontSize: 14 }}>
          Điền thông tin ở panel bên trái để xem preview CV của bạn
        </div>
      )}
    </div>
  )
}
