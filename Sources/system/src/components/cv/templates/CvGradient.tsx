import type { CvDataType, CvExperience, CvEducation, CvSkill, CvProject, CvCertification, CvLanguage } from '@/types/cv'

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const hasContent = (val: unknown[] | null | undefined): boolean =>
  Array.isArray(val) && val.length > 0

const LEVEL_LABELS = ['', 'Cơ bản', 'Trung bình', 'Khá', 'Tốt', 'Thành thạo']
const LANG_LEVELS: Record<string, string> = { native: 'Bản ngữ', fluent: 'Thành thạo', intermediate: 'Trung cấp', basic: 'Cơ bản' }

const SECTION_COLORS: Record<string, string> = {
  experience: '#7c3aed',
  education: '#4f46e5',
  skills: '#0891b2',
  projects: '#7c3aed',
  certs: '#4f46e5',
}

export default function CvGradient({ data, isPrint }: Props) {
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
  ].filter(Boolean) as { icon: string; text: string }[]

  const SectionTitle = ({ section, children }: { section: string; children: React.ReactNode }) => {
    const color = SECTION_COLORS[section] ?? '#7c3aed'
    return (
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color, borderBottom: `2px solid ${color}`, paddingBottom: 6, marginBottom: 14, marginTop: 24 }}>
        {children}
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Raleway', sans-serif", color: '#1e1b4b', background: '#f8f9ff', minHeight: isPrint ? 'auto' : undefined, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-sidebar { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      <div style={{ display: 'flex', flex: 1, minHeight: 600 }}>
        {/* Sidebar — gradient */}
        <div className="cv-sidebar" style={{ width: '34%', background: 'linear-gradient(180deg, #7c3aed 0%, #4f46e5 50%, #0891b2 100%)', padding: '40px 24px 40px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Avatar */}
          <div style={{ marginBottom: 20 }}>
            {data.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.avatarUrl} alt={data.fullName ?? ''} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.9)' }} />
            ) : (
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '4px solid rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: '#ffffff' }}>
                {(data.fullName ?? '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name + title in sidebar */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
              {data.fullName || 'Họ và Tên'}
            </h1>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', fontStyle: 'italic', marginTop: 4 }}>
              {data.jobTitle || 'Chức danh'}
            </div>
          </div>

          {/* Summary */}
          {data.summary && (
            <p style={{ margin: '0 0 24px', fontSize: 12, color: 'rgba(255,255,255,.7)', lineHeight: 1.7, textAlign: 'center', fontWeight: 300 }}>
              {data.summary}
            </p>
          )}

          {/* Contact */}
          {contactItems.length > 0 && (
            <div style={{ width: '100%', marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 10, textAlign: 'center' }}>
                Liên hệ
              </div>
              {contactItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 11, color: 'rgba(255,255,255,.85)' }}>
                  <span style={{ fontSize: 9, opacity: 0.6 }}>{item.icon}</span>
                  <span style={{ wordBreak: 'break-all' }}>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Skills — white semi-transparent bars */}
          {hasContent(skills) && (
            <div style={{ width: '100%', marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 10, textAlign: 'center' }}>
                Kỹ năng
              </div>
              {skills!.map(skill => (
                <div key={skill.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11 }}>
                    <span style={{ color: 'rgba(255,255,255,.9)', fontWeight: 500 }}>{skill.name}</span>
                    <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 10 }}>{LEVEL_LABELS[skill.level]}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(skill.level / 5) * 100}%`, background: 'rgba(255,255,255,0.8)', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {hasContent(languages) && (
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 10, textAlign: 'center' }}>
                Ngôn ngữ
              </div>
              {languages!.map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: 'rgba(255,255,255,.85)', fontWeight: 500 }}>{lang.language}</span>
                  <span style={{ color: 'rgba(255,255,255,.55)', fontSize: 11 }}>{LANG_LEVELS[lang.level]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '32px 36px 40px', background: '#ffffff' }}>

          {hasContent(experience) && (
            <div className="cv-section">
              <SectionTitle section="experience">Kinh nghiệm làm việc</SectionTitle>
              {experience!.map(exp => (
                <div key={exp.id} style={{ marginBottom: 18, paddingLeft: 12, borderLeft: '2px solid #e0e7ff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1e1b4b' }}>{exp.role}</div>
                      <div style={{ fontSize: 13, color: '#7c3aed', fontWeight: 500 }}>{exp.company}</div>
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
            <div className="cv-section">
              <SectionTitle section="education">Học vấn</SectionTitle>
              {education!.map(edu => (
                <div key={edu.id} style={{ marginBottom: 14, paddingLeft: 12, borderLeft: '2px solid #e0e7ff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1e1b4b' }}>{edu.school}</div>
                      <div style={{ fontSize: 13, color: '#4f46e5' }}>{[edu.degree, edu.field].filter(Boolean).join(' — ')}</div>
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
            <div className="cv-section">
              <SectionTitle section="projects">Dự án</SectionTitle>
              {projects!.map(proj => (
                <div key={proj.id} style={{ marginBottom: 14, paddingLeft: 12, borderLeft: '2px solid #e0e7ff' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1e1b4b' }}>
                    {proj.name}
                    {proj.url && <span style={{ fontSize: 11, color: '#0891b2', fontWeight: 400, marginLeft: 8 }}>{proj.url}</span>}
                  </div>
                  {proj.description && <p style={{ margin: '4px 0 6px', fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{proj.description}</p>}
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {proj.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 11, background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasContent(certs) && (
            <div className="cv-section">
              <SectionTitle section="certs">Chứng chỉ</SectionTitle>
              {certs!.map(cert => (
                <div key={cert.id} style={{ marginBottom: 10, paddingLeft: 12, borderLeft: '2px solid #e0e7ff' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#1e1b4b' }}>{cert.name}</div>
                  <div style={{ fontSize: 12, color: '#374151' }}>{cert.issuer} <span style={{ color: '#6b7280' }}>— {cert.date}</span></div>
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
