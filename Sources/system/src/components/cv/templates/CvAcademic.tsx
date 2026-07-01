import type { CvDataType, CvExperience, CvEducation, CvSkill, CvProject, CvCertification, CvLanguage } from '@/types/cv'

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const hasContent = (val: unknown[] | null | undefined): boolean =>
  Array.isArray(val) && val.length > 0

const LANG_LEVELS: Record<string, string> = { native: 'Bản ngữ', fluent: 'Thành thạo', intermediate: 'Trung cấp', basic: 'Cơ bản' }

export default function CvAcademic({ data, isPrint }: Props) {
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

  const groupedSkills: Record<string, string[]> = {}
  if (hasContent(skills)) {
    skills!.forEach(skill => {
      const cat = skill.category || 'Kỹ năng'
      if (!groupedSkills[cat]) groupedSkills[cat] = []
      groupedSkills[cat].push(skill.name)
    })
  }

  return (
    <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: '#1a202c', background: '#ffffff', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Source+Sans+3:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 56px' }}>
        {/* Header */}
        <div className="cv-header" style={{ marginBottom: 8 }}>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 700, color: '#1e3a5f', fontFamily: "'Source Serif 4', serif", letterSpacing: '-0.5px', lineHeight: 1.1 }}>
            {data.fullName || 'Họ và Tên'}
          </h1>
          {data.jobTitle && (
            <div style={{ fontSize: 16, color: '#4a5568', fontStyle: 'italic', marginTop: 6, fontFamily: "'Source Serif 4', serif" }}>
              {data.jobTitle}
            </div>
          )}

          {/* Contact horizontal */}
          {contactItems.length > 0 && (
            <div style={{ marginTop: 10, fontSize: 13, color: '#4a5568', display: 'flex', flexWrap: 'wrap', gap: '2px 0' }}>
              {contactItems.map((item, i) => (
                <span key={i}>
                  {item}
                  {i < contactItems.length - 1 && <span style={{ margin: '0 8px', color: '#cbd5e0' }}>·</span>}
                </span>
              ))}
            </div>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '2px solid #1e3a5f', margin: '16px 0' }} />

        {/* Summary */}
        {data.summary && (
          <div className="cv-section" style={{ marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#2d3748', lineHeight: 1.8, fontWeight: 300 }}>
              {data.summary}
            </p>
          </div>
        )}

        {/* Education */}
        {hasContent(education) && (
          <div className="cv-section" style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#1e3a5f', marginBottom: 4 }}>
              Học vấn
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #1e3a5f', margin: '0 0 14px' }} />
            {education!.map(edu => (
              <div key={edu.id} style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1a202c' }}>{edu.school}</div>
                  <div style={{ fontSize: 13, color: '#4a5568', fontStyle: 'italic' }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}</div>
                  {edu.gpa && <div style={{ fontSize: 12, color: '#718096' }}>GPA: {edu.gpa}</div>}
                  {edu.description && <div style={{ fontSize: 13, color: '#4a5568', marginTop: 4 }}>{edu.description}</div>}
                </div>
                <div style={{ fontSize: 13, color: '#718096', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                  {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {hasContent(experience) && (
          <div className="cv-section" style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#1e3a5f', marginBottom: 4 }}>
              Kinh nghiệm làm việc
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #1e3a5f', margin: '0 0 14px' }} />
            {experience!.map(exp => (
              <div key={exp.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#1a202c' }}>{exp.company}</span>
                    {exp.role && <span style={{ fontSize: 13, color: '#4a5568', fontStyle: 'italic' }}> — {exp.role}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#718096', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                    {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                  </div>
                </div>
                {exp.description && (
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#4a5568', lineHeight: 1.7 }}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Publications / Projects */}
        {hasContent(projects) && (
          <div className="cv-section" style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#1e3a5f', marginBottom: 4 }}>
              Công trình / Dự án nghiên cứu
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #1e3a5f', margin: '0 0 14px' }} />
            {projects!.map(proj => (
              <div key={proj.id} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a202c' }}>
                  {proj.name}
                  {proj.url && <span style={{ fontSize: 12, color: '#718096', fontWeight: 400, fontStyle: 'italic', marginLeft: 8 }}>{proj.url}</span>}
                </div>
                {proj.description && <p style={{ margin: '4px 0 4px', fontSize: 13, color: '#4a5568', lineHeight: 1.6 }}>{proj.description}</p>}
                {proj.tech && proj.tech.length > 0 && (
                  <div style={{ fontSize: 12, color: '#718096', fontStyle: 'italic' }}>
                    Công nghệ: {proj.tech.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills — categorized plain text */}
        {hasContent(skills) && (
          <div className="cv-section" style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#1e3a5f', marginBottom: 4 }}>
              Kỹ năng
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #1e3a5f', margin: '0 0 14px' }} />
            {Object.entries(groupedSkills).map(([cat, names]) => (
              <div key={cat} style={{ marginBottom: 8, fontSize: 13 }}>
                <span style={{ fontWeight: 600, color: '#1a202c' }}>{cat}: </span>
                <span style={{ color: '#4a5568' }}>{names.join(', ')}</span>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {hasContent(certs) && (
          <div className="cv-section" style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#1e3a5f', marginBottom: 4 }}>
              Chứng chỉ
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #1e3a5f', margin: '0 0 14px' }} />
            {certs!.map(cert => (
              <div key={cert.id} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#1a202c' }}>{cert.name}</span>
                  <span style={{ fontSize: 13, color: '#4a5568' }}> — {cert.issuer}</span>
                </div>
                <div style={{ fontSize: 13, color: '#718096', fontStyle: 'italic', whiteSpace: 'nowrap' }}>{cert.date}</div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {hasContent(languages) && (
          <div className="cv-section" style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#1e3a5f', marginBottom: 4 }}>
              Ngôn ngữ
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #1e3a5f', margin: '0 0 14px' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 32px' }}>
              {languages!.map(lang => (
                <div key={lang.id} style={{ fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: '#1a202c' }}>{lang.language}</span>
                  <span style={{ color: '#4a5568', fontStyle: 'italic' }}> ({LANG_LEVELS[lang.level]})</span>
                </div>
              ))}
            </div>
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
