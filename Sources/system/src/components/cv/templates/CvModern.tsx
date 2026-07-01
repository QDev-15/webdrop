import type { CvDataType, CvExperience, CvEducation, CvSkill, CvProject, CvCertification, CvLanguage } from '@/types/cv'

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const hasContent = (val: unknown[] | null | undefined): boolean =>
  Array.isArray(val) && val.length > 0

const LEVEL_LABELS = ['', 'Cơ bản', 'Trung bình', 'Khá', 'Tốt', 'Thành thạo']
const LANG_LEVELS: Record<string, string> = { native: 'Bản ngữ', fluent: 'Thành thạo', intermediate: 'Trung cấp', basic: 'Cơ bản' }

export default function CvModern({ data, isPrint }: Props) {
  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null
  const projects = data.projects as CvProject[] | null
  const certs = data.certifications as CvCertification[] | null
  const languages = data.languages as CvLanguage[] | null

  const contactItems = [
    data.email && { icon: '✉', text: data.email },
    data.phone && { icon: '☎', text: data.phone },
    data.location && { icon: '⌖', text: data.location },
    data.website && { icon: '⬡', text: data.website },
    data.linkedin && { icon: 'in', text: data.linkedin },
    data.github && { icon: '⌥', text: data.github },
    data.twitter && { icon: '⌘', text: data.twitter },
  ].filter(Boolean) as { icon: string; text: string }[]

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#064e3b', background: '#f0fdf4', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-header, .cv-sidebar { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Header */}
      <div className="cv-header" style={{ background: 'linear-gradient(135deg, #059669 0%, #065f46 100%)', padding: '40px 48px', display: 'flex', alignItems: 'center', gap: 28 }}>
        {data.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.avatarUrl} alt={data.fullName ?? ''} style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '4px solid #ffffff', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '4px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 32, fontWeight: 700, color: '#ffffff' }}>
            {(data.fullName ?? '?').charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
            {data.fullName || 'Họ và Tên'}
          </h1>
          <div style={{ fontSize: 16, color: '#a7f3d0', fontWeight: 500, marginTop: 6 }}>
            {data.jobTitle || 'Chức danh'}
          </div>
          {data.summary && (
            <p style={{ margin: '10px 0 0', fontSize: 13, color: 'rgba(255,255,255,.8)', lineHeight: 1.7, maxWidth: 520 }}>
              {data.summary}
            </p>
          )}
        </div>
      </div>

      {/* Contact bar */}
      {contactItems.length > 0 && (
        <div style={{ background: '#ffffff', borderBottom: '1px solid #d1fae5', padding: '10px 48px', display: 'flex', flexWrap: 'wrap', gap: '6px 24px' }}>
          {contactItems.map((item, i) => (
            <span key={i} style={{ fontSize: 12, color: '#065f46', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 10, color: '#059669' }}>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      )}

      {/* Body: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '65% 35%', minHeight: 400 }}>
        {/* Main column */}
        <div style={{ padding: '24px 32px 40px 48px', borderRight: '1px solid #d1fae5', background: '#ffffff' }}>
          {hasContent(experience) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#059669', borderLeft: '3px solid #059669', paddingLeft: 10, marginBottom: 16 }}>
                Kinh nghiệm làm việc
              </div>
              {experience!.map(exp => (
                <div key={exp.id} style={{ marginBottom: 20, paddingLeft: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#064e3b' }}>{exp.role}</div>
                      <div style={{ fontSize: 13, color: '#059669', fontWeight: 500 }}>{exp.company}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#374151', lineHeight: 1.7 }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasContent(education) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#059669', borderLeft: '3px solid #059669', paddingLeft: 10, marginBottom: 16 }}>
                Học vấn
              </div>
              {education!.map(edu => (
                <div key={edu.id} style={{ marginBottom: 16, paddingLeft: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#064e3b' }}>{edu.school}</div>
                      <div style={{ fontSize: 13, color: '#374151' }}>{[edu.degree, edu.field].filter(Boolean).join(' — ')}</div>
                      {edu.gpa && <div style={{ fontSize: 12, color: '#6b7280' }}>GPA: {edu.gpa}</div>}
                    </div>
                    <div style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasContent(projects) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#059669', borderLeft: '3px solid #059669', paddingLeft: 10, marginBottom: 16 }}>
                Dự án
              </div>
              {projects!.map(proj => (
                <div key={proj.id} style={{ marginBottom: 16, paddingLeft: 13 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#064e3b' }}>
                    {proj.name}
                    {proj.url && <span style={{ fontSize: 11, color: '#059669', fontWeight: 400, marginLeft: 8 }}>{proj.url}</span>}
                  </div>
                  {proj.description && <p style={{ margin: '4px 0 6px', fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{proj.description}</p>}
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {proj.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 11, background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="cv-sidebar" style={{ padding: '24px 28px 40px 24px', background: '#f0fdf4' }}>
          {hasContent(skills) && (
            <div className="cv-section" style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#059669', borderLeft: '3px solid #059669', paddingLeft: 10, marginBottom: 16 }}>
                Kỹ năng
              </div>
              {skills!.map(skill => (
                <div key={skill.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: '#064e3b' }}>{skill.name}</span>
                    <span style={{ fontSize: 11, color: '#6b7280' }}>{LEVEL_LABELS[skill.level]}</span>
                  </div>
                  <div style={{ height: 5, background: '#a7f3d0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(skill.level / 5) * 100}%`, background: '#059669', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasContent(languages) && (
            <div className="cv-section" style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#059669', borderLeft: '3px solid #059669', paddingLeft: 10, marginBottom: 16 }}>
                Ngôn ngữ
              </div>
              {languages!.map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ fontWeight: 500, color: '#064e3b' }}>{lang.language}</span>
                  <span style={{ color: '#6b7280', fontSize: 12 }}>{LANG_LEVELS[lang.level]}</span>
                </div>
              ))}
            </div>
          )}

          {hasContent(certs) && (
            <div className="cv-section">
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#059669', borderLeft: '3px solid #059669', paddingLeft: 10, marginBottom: 16 }}>
                Chứng chỉ
              </div>
              {certs!.map(cert => (
                <div key={cert.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#064e3b' }}>{cert.name}</div>
                  <div style={{ fontSize: 12, color: '#374151' }}>{cert.issuer}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{cert.date}</div>
                </div>
              ))}
            </div>
          )}
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
