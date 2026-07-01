import type { CvDataType, CvExperience, CvEducation, CvSkill, CvProject, CvCertification, CvLanguage } from '@/types/cv'

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const hasContent = (val: unknown[] | null | undefined): boolean =>
  Array.isArray(val) && val.length > 0

const LANG_LEVELS: Record<string, string> = { native: 'Bản ngữ', fluent: 'Thành thạo', intermediate: 'Trung cấp', basic: 'Cơ bản' }

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 11, fontWeight: 400, letterSpacing: 3, textTransform: 'uppercase', color: '#000000', borderTop: '1px solid #000000', paddingTop: 8, marginBottom: 16, marginTop: 28 }}>
    {children}
  </div>
)

export default function CvMinimalist({ data, isPrint }: Props) {
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

  const allSkillNames = hasContent(skills) ? skills!.map(s => s.name) : []

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#000000', background: '#ffffff', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300;1,9..40,400&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '56px 48px' }}>
        {/* Header */}
        <div className="cv-header" style={{ marginBottom: 8 }}>
          <h1 style={{ margin: 0, fontSize: 52, fontWeight: 400, color: '#000000', lineHeight: 1.05, fontFamily: "'DM Serif Display', serif", letterSpacing: '-1px' }}>
            {data.fullName || 'Họ và Tên'}
          </h1>
          {data.jobTitle && (
            <div style={{ fontSize: 16, color: '#555555', fontStyle: 'italic', marginTop: 10, fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>
              {data.jobTitle}
            </div>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid #cccccc', margin: '16px 0' }} />

          {/* Contact — inline small italic */}
          {contactItems.length > 0 && (
            <div style={{ fontSize: 12, color: '#555555', fontStyle: 'italic', display: 'flex', flexWrap: 'wrap', gap: '2px 0' }}>
              {contactItems.map((item, i) => (
                <span key={i}>
                  {item}
                  {i < contactItems.length - 1 && <span style={{ margin: '0 10px', color: '#cccccc' }}>·</span>}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="cv-section" style={{ marginTop: 20 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#333333', lineHeight: 1.8, fontWeight: 300 }}>
              {data.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {hasContent(experience) && (
          <div className="cv-section">
            <SectionTitle>Kinh nghiệm làm việc</SectionTitle>
            {experience!.map(exp => (
              <div key={exp.id} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4, marginBottom: 2 }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 15, color: '#000000', fontFamily: "'DM Serif Display', serif" }}>{exp.role}</span>
                    <span style={{ fontSize: 13, color: '#555555', fontStyle: 'italic', marginLeft: 10 }}>{exp.company}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#555555', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                    {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                  </div>
                </div>
                {exp.description && (
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#333333', lineHeight: 1.75, fontWeight: 300 }}>{exp.description}</p>
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
              <div key={edu.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4, marginBottom: 2 }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 15, color: '#000000', fontFamily: "'DM Serif Display', serif" }}>{edu.school}</span>
                    <span style={{ fontSize: 13, color: '#555555', fontStyle: 'italic', marginLeft: 10 }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#555555', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                    {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                  </div>
                </div>
                {edu.gpa && <div style={{ fontSize: 12, color: '#555555' }}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Skills — inline with dot separator */}
        {hasContent(skills) && (
          <div className="cv-section">
            <SectionTitle>Kỹ năng</SectionTitle>
            <p style={{ margin: 0, fontSize: 13, color: '#333333', lineHeight: 1.8, fontWeight: 300 }}>
              {allSkillNames.join(' · ')}
            </p>
          </div>
        )}

        {/* Projects */}
        {hasContent(projects) && (
          <div className="cv-section">
            <SectionTitle>Dự án</SectionTitle>
            {projects!.map(proj => (
              <div key={proj.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 15, color: '#000000', fontFamily: "'DM Serif Display', serif" }}>{proj.name}</span>
                  {proj.url && <span style={{ fontSize: 12, color: '#555555', fontStyle: 'italic' }}>{proj.url}</span>}
                </div>
                {proj.description && <p style={{ margin: '4px 0 4px', fontSize: 13, color: '#333333', lineHeight: 1.7, fontWeight: 300 }}>{proj.description}</p>}
                {proj.tech && proj.tech.length > 0 && (
                  <p style={{ margin: 0, fontSize: 12, color: '#555555', fontStyle: 'italic' }}>{proj.tech.join(' · ')}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certs + Languages */}
        {(hasContent(certs) || hasContent(languages)) && (
          <div style={{ display: 'grid', gridTemplateColumns: hasContent(certs) && hasContent(languages) ? '1fr 1fr' : '1fr', gap: 32 }}>
            {hasContent(certs) && (
              <div className="cv-section">
                <SectionTitle>Chứng chỉ</SectionTitle>
                {certs!.map(cert => (
                  <div key={cert.id} style={{ marginBottom: 10, fontSize: 13 }}>
                    <div style={{ fontWeight: 500, color: '#000000' }}>{cert.name}</div>
                    <div style={{ color: '#555555', fontStyle: 'italic' }}>{cert.issuer} — {cert.date}</div>
                  </div>
                ))}
              </div>
            )}
            {hasContent(languages) && (
              <div className="cv-section">
                <SectionTitle>Ngôn ngữ</SectionTitle>
                {languages!.map(lang => (
                  <div key={lang.id} style={{ marginBottom: 8, fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: '#000000' }}>{lang.language}</span>
                    <span style={{ color: '#555555', fontStyle: 'italic' }}> — {LANG_LEVELS[lang.level]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!data.fullName && !hasContent(experience) && !hasContent(skills) && (
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#a09d97', fontSize: 14 }}>
          Điền thông tin ở panel bên trái để xem preview CV của bạn
        </div>
      )}
    </div>
  )
}
