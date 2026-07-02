import type { CvDataType, CvExperience, CvEducation, CvSkill, CvProject, CvCertification, CvLanguage } from '@/types/cv'

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const hasContent = (val: unknown[] | null | undefined): boolean =>
  Array.isArray(val) && val.length > 0

const LANG_LEVELS: Record<string, string> = { native: 'Bản ngữ', fluent: 'Thành thạo', intermediate: 'Trung cấp', basic: 'Cơ bản' }

function StarRating({ level }: { level: number }) {
  return (
    <span>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < level ? '#b45309' : '#d6b896', fontSize: 12 }}>
          {i < level ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: "'Courier Prime', monospace",
    fontSize: 13,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: '#b45309',
    borderBottom: '1px dashed #d6b896',
    paddingBottom: 6,
    marginBottom: 14,
    marginTop: 24,
  }}>
    {children}
  </div>
)

export default function CvRetro({ data, isPrint }: Props) {
  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null
  const projects = data.projects as CvProject[] | null
  const certs = data.certifications as CvCertification[] | null
  const languages = data.languages as CvLanguage[] | null

  const contactItems = [
    data.email,
    data.phone,
    data.location,
    data.website,
    data.linkedin,
    data.github,
  ].filter(Boolean) as string[]

  return (
    <div style={{ fontFamily: "'Merriweather', serif", color: '#292524', background: '#fdf6e3', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Outer decorative frame */}
      <div style={{ margin: '24px', border: '2px solid #b45309', padding: '4px' }}>
        <div style={{ border: '1px solid #d6b896', padding: '32px 40px', background: '#fdf6e3' }}>

          {/* Header */}
          <div className="cv-header" style={{ textAlign: 'center', marginBottom: 8 }}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: '#b45309', letterSpacing: 4, marginBottom: 12 }}>
              ══════════════════════════════════════
            </div>

            {data.avatarUrl && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.avatarUrl} alt={data.fullName ?? ''} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #b45309' }} />
              </div>
            )}

            <h1 style={{ margin: 0, fontSize: 30, fontFamily: "'Courier Prime', monospace", fontWeight: 700, color: '#451a03', textTransform: 'uppercase', letterSpacing: 4, lineHeight: 1.2 }}>
              {data.fullName || 'Họ và Tên'}
            </h1>

            {data.jobTitle && (
              <div style={{ fontSize: 14, color: '#b45309', fontStyle: 'italic', marginTop: 8, fontFamily: "'Merriweather', serif" }}>
                — {data.jobTitle} —
              </div>
            )}

            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: '#b45309', letterSpacing: 4, marginTop: 12 }}>
              ══════════════════════════════════════
            </div>

            {/* Contact row */}
            {contactItems.length > 0 && (
              <div style={{ marginTop: 12, fontSize: 12, color: '#78716c', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 0' }}>
                {contactItems.map((item, i) => (
                  <span key={i}>
                    {item}
                    {i < contactItems.length - 1 && <span style={{ margin: '0 8px', color: '#b45309' }}>|</span>}
                  </span>
                ))}
              </div>
            )}

            {data.summary && (
              <p style={{ margin: '16px auto 0', fontSize: 13, color: '#4a3728', lineHeight: 1.8, maxWidth: 520, fontStyle: 'italic', fontWeight: 300 }}>
                {data.summary}
              </p>
            )}
          </div>

          {/* Ornament */}
          <div style={{ textAlign: 'center', marginTop: 16, color: '#b45309', fontSize: 14, letterSpacing: 8 }}>
            ✦ ✦ ✦
          </div>

          {/* Experience */}
          {hasContent(experience) && (
            <div className="cv-section">
              <SectionTitle>Kinh nghiệm làm việc</SectionTitle>
              {experience!.map(exp => (
                <div key={exp.id} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#451a03' }}>{exp.role}</div>
                      <div style={{ fontSize: 13, color: '#b45309', fontStyle: 'italic' }}>{exp.company}</div>
                    </div>
                    <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: '#78716c' }}>
                      {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#4a3728', lineHeight: 1.7, fontWeight: 300 }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {hasContent(education) && (
            <div className="cv-section">
              <SectionTitle>Học vấn</SectionTitle>
              {education!.map(edu => (
                <div key={edu.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#451a03' }}>{edu.school}</div>
                      <div style={{ fontSize: 13, color: '#4a3728', fontStyle: 'italic' }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}</div>
                      {edu.gpa && <div style={{ fontSize: 12, color: '#78716c' }}>GPA: {edu.gpa}</div>}
                    </div>
                    <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: '#78716c' }}>
                      {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills — star ratings */}
          {hasContent(skills) && (
            <div className="cv-section">
              <SectionTitle>Kỹ năng</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 24px' }}>
                {skills!.map(skill => (
                  <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                    <span style={{ color: '#292524' }}>{skill.name}</span>
                    <StarRating level={skill.level} />
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
                <div key={proj.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#451a03' }}>{proj.name}</div>
                  {proj.description && <p style={{ margin: '4px 0 4px', fontSize: 13, color: '#4a3728', lineHeight: 1.6, fontWeight: 300 }}>{proj.description}</p>}
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ fontSize: 12, color: '#b45309', fontStyle: 'italic' }}>{proj.tech.join(' · ')}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certs & Languages */}
          {(hasContent(certs) || hasContent(languages)) && (
            <div style={{ display: 'grid', gridTemplateColumns: hasContent(certs) && hasContent(languages) ? '1fr 1fr' : '1fr', gap: 24 }}>
              {hasContent(certs) && (
                <div className="cv-section">
                  <SectionTitle>Chứng chỉ</SectionTitle>
                  {certs!.map(cert => (
                    <div key={cert.id} style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#451a03' }}>{cert.name}</div>
                      <div style={{ fontSize: 12, color: '#78716c', fontStyle: 'italic' }}>{cert.issuer} — {cert.date}</div>
                    </div>
                  ))}
                </div>
              )}
              {hasContent(languages) && (
                <div className="cv-section">
                  <SectionTitle>Ngôn ngữ</SectionTitle>
                  {languages!.map(lang => (
                    <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ color: '#292524' }}>{lang.language}</span>
                      <span style={{ color: '#78716c', fontStyle: 'italic' }}>{LANG_LEVELS[lang.level]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom ornament */}
          <div style={{ textAlign: 'center', marginTop: 24, color: '#b45309', fontSize: 14, letterSpacing: 8 }}>
            ✦ ✦ ✦
          </div>
        </div>
      </div>

      {!data.fullName && !hasContent(experience) && !hasContent(skills) && (
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#a09d97', fontSize: 14 }}>
          Điền thông tin ở panel bên trái để xem preview CV của bạn
        </div>
      )}
    </div>
  )
}
