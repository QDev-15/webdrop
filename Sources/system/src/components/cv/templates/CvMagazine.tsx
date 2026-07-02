import type { CvDataType, CvExperience, CvEducation, CvSkill, CvProject, CvCertification, CvLanguage } from '@/types/cv'

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const hasContent = (val: unknown[] | null | undefined): boolean =>
  Array.isArray(val) && val.length > 0

const LANG_LEVELS: Record<string, string> = { native: 'Bản ngữ', fluent: 'Thành thạo', intermediate: 'Trung cấp', basic: 'Cơ bản' }

function SkillSegments({ level }: { level: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ width: 18, height: 6, borderRadius: 2, background: i < level ? '#f0a500' : '#e0e0e0' }} />
      ))}
    </div>
  )
}

const MainSectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: "'Anton', sans-serif",
    fontSize: 15,
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#f0a500',
    marginBottom: 14,
    marginTop: 28,
    paddingBottom: 6,
    borderBottom: '1px solid #f0a500',
  }}>
    {children}
  </div>
)

const SidebarSectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: "'Anton', sans-serif",
    fontSize: 14,
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#f0a500',
    marginBottom: 12,
    marginTop: 24,
    paddingBottom: 6,
    borderBottom: '1px solid #f0a500',
  }}>
    {children}
  </div>
)

export default function CvMagazine({ data, isPrint }: Props) {
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

  return (
    <div style={{ fontFamily: "'Libre Baskerville', serif", color: '#f5f5f5', background: '#1a1a1a', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-header, .cv-sidebar-magazine { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Header — magazine editorial with photo overlay */}
      <div className="cv-header" style={{ position: 'relative', background: '#242424', minHeight: 200, padding: '0', overflow: 'hidden' }}>
        {data.avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.avatarUrl} alt={data.fullName ?? ''} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
        )}
        {/* Dark overlay gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.7) 60%, rgba(26,26,26,0.4) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '40px 48px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 200 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 56, fontWeight: 400, color: '#f5f5f5', lineHeight: 0.95, fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', letterSpacing: 2 }}>
              {data.fullName || 'Họ và Tên'}
            </h1>
            <div style={{ fontSize: 18, color: '#f0a500', fontWeight: 700, marginTop: 10, fontFamily: "'Anton', sans-serif", letterSpacing: 3 }}>
              {data.jobTitle || 'Chức danh'}
            </div>
          </div>
          {!data.avatarUrl && (
            <div style={{ width: 80, height: 80, background: '#333333', border: '2px solid #f0a500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 400, color: '#f0a500', fontFamily: "'Anton', sans-serif", flexShrink: 0 }}>
              {(data.fullName ?? '?').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Contact bar */}
      {contactItems.length > 0 && (
        <div style={{ background: '#111111', padding: '10px 48px', display: 'flex', flexWrap: 'wrap', gap: '6px 24px', borderBottom: '1px solid #333333' }}>
          {contactItems.map((item, i) => (
            <span key={i} style={{ fontSize: 12, color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 9, color: '#f0a500' }}>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      {data.summary && (
        <div style={{ background: '#242424', padding: '20px 48px', borderBottom: '1px solid #333333' }}>
          <p style={{ margin: 0, fontSize: 14, color: '#a0a0a0', lineHeight: 1.75, fontStyle: 'italic', maxWidth: 640 }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Body: Main 60% + Sidebar 40% */}
      <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', minHeight: 400 }}>
        {/* Main — dark */}
        <div style={{ padding: '8px 32px 40px 48px', borderRight: '1px solid #333333' }}>
          {hasContent(experience) && (
            <div className="cv-section">
              <MainSectionTitle>Kinh nghiệm làm việc</MainSectionTitle>
              {experience!.map(exp => (
                <div key={exp.id} style={{ marginBottom: 20, paddingLeft: 12, borderLeft: '2px solid #f0a500' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#f5f5f5', fontFamily: "'Libre Baskerville', serif" }}>{exp.role}</div>
                      <div style={{ fontSize: 13, color: '#f0a500', fontStyle: 'italic' }}>{exp.company}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#a0a0a0', whiteSpace: 'nowrap' }}>
                      {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#c0c0c0', lineHeight: 1.7, fontStyle: 'italic' }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasContent(education) && (
            <div className="cv-section">
              <MainSectionTitle>Học vấn</MainSectionTitle>
              {education!.map(edu => (
                <div key={edu.id} style={{ marginBottom: 16, paddingLeft: 12, borderLeft: '2px solid #f0a500' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#f5f5f5' }}>{edu.school}</div>
                      <div style={{ fontSize: 13, color: '#a0a0a0', fontStyle: 'italic' }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}</div>
                      {edu.gpa && <div style={{ fontSize: 12, color: '#a0a0a0' }}>GPA: {edu.gpa}</div>}
                    </div>
                    <div style={{ fontSize: 11, color: '#a0a0a0', whiteSpace: 'nowrap' }}>
                      {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasContent(projects) && (
            <div className="cv-section">
              <MainSectionTitle>Dự án</MainSectionTitle>
              {projects!.map(proj => (
                <div key={proj.id} style={{ marginBottom: 14, paddingLeft: 12, borderLeft: '2px solid #f0a500' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#f5f5f5' }}>
                    {proj.name}
                    {proj.url && <span style={{ fontSize: 11, color: '#f0a500', fontWeight: 400, fontStyle: 'italic', marginLeft: 8 }}>{proj.url}</span>}
                  </div>
                  {proj.description && <p style={{ margin: '4px 0 6px', fontSize: 13, color: '#c0c0c0', lineHeight: 1.6, fontStyle: 'italic' }}>{proj.description}</p>}
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {proj.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 11, background: '#333333', color: '#f0a500', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar — light inverted */}
        <div className="cv-sidebar-magazine" style={{ padding: '8px 32px 40px 28px', background: '#f5f5f5', color: '#1a1a1a' }}>

          {hasContent(skills) && (
            <div className="cv-section">
              <SidebarSectionTitle>Kỹ năng</SidebarSectionTitle>
              {skills!.map(skill => (
                <div key={skill.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{skill.name}</span>
                  </div>
                  <SkillSegments level={skill.level} />
                </div>
              ))}
            </div>
          )}

          {hasContent(languages) && (
            <div className="cv-section">
              <SidebarSectionTitle>Ngôn ngữ</SidebarSectionTitle>
              {languages!.map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{lang.language}</span>
                  <span style={{ color: '#555555' }}>{LANG_LEVELS[lang.level]}</span>
                </div>
              ))}
            </div>
          )}

          {hasContent(certs) && (
            <div className="cv-section">
              <SidebarSectionTitle>Chứng chỉ</SidebarSectionTitle>
              {certs!.map(cert => (
                <div key={cert.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>{cert.name}</div>
                  <div style={{ fontSize: 12, color: '#555555' }}>{cert.issuer}</div>
                  <div style={{ fontSize: 11, color: '#888888' }}>{cert.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!data.fullName && !hasContent(experience) && !hasContent(skills) && (
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#a0a0a0', fontSize: 14 }}>
          Điền thông tin ở panel bên trái để xem preview CV của bạn
        </div>
      )}
    </div>
  )
}
