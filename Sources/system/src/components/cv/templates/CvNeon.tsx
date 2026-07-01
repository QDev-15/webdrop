import type { CvDataType, CvExperience, CvEducation, CvSkill, CvProject, CvCertification, CvLanguage } from '@/types/cv'

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const hasContent = (val: unknown[] | null | undefined): boolean =>
  Array.isArray(val) && val.length > 0

const LEVEL_LABELS = ['', 'Cơ bản', 'Trung bình', 'Khá', 'Tốt', 'Thành thạo']
const LANG_LEVELS: Record<string, string> = { native: 'Bản ngữ', fluent: 'Thành thạo', intermediate: 'Trung cấp', basic: 'Cơ bản' }

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#39ff14',
    borderBottom: '1px solid rgba(57,255,20,0.3)',
    paddingBottom: 8,
    marginBottom: 16,
    marginTop: 28,
    textShadow: '0 0 10px rgba(57,255,20,0.5)',
    boxShadow: '0 1px 0 rgba(57,255,20,0.1)',
  }}>
    {children}
  </div>
)

export default function CvNeon({ data, isPrint }: Props) {
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
    <div style={{ fontFamily: "'Exo 2', sans-serif", color: '#e2e8f0', background: '#0a0a0f', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;900&family=Exo+2:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-header, .cv-body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Header */}
      <div className="cv-header" style={{ background: '#111118', borderBottom: '1px solid rgba(57,255,20,0.3)', padding: '36px 48px', display: 'flex', alignItems: 'center', gap: 28 }}>
        {data.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.avatarUrl} alt={data.fullName ?? ''} style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '2px solid #39ff14', boxShadow: '0 0 16px rgba(57,255,20,0.4)', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#1a1a2e', border: '2px solid #39ff14', boxShadow: '0 0 16px rgba(57,255,20,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 32, fontWeight: 700, color: '#39ff14', fontFamily: "'Orbitron', sans-serif" }}>
            {(data.fullName ?? '?').charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: '#39ff14', lineHeight: 1.2, fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 20px rgba(57,255,20,0.6)', textTransform: 'uppercase', letterSpacing: 2 }}>
            {data.fullName || 'Họ và Tên'}
          </h1>
          <div style={{ fontSize: 15, color: '#ffff00', fontWeight: 500, marginTop: 6, textShadow: '0 0 10px rgba(255,255,0,0.5)' }}>
            {data.jobTitle || 'Chức danh'}
          </div>
          {data.summary && (
            <p style={{ margin: '10px 0 0', fontSize: 13, color: '#94a3b8', lineHeight: 1.7, maxWidth: 520, fontWeight: 300 }}>
              {data.summary}
            </p>
          )}
        </div>
      </div>

      {/* Contact bar */}
      {contactItems.length > 0 && (
        <div style={{ background: '#0f0f1a', borderBottom: '1px solid #1a1a2e', padding: '10px 48px', display: 'flex', flexWrap: 'wrap', gap: '6px 24px' }}>
          {contactItems.map((item, i) => (
            <span key={i} style={{ fontSize: 12, color: '#00ffff', display: 'flex', alignItems: 'center', gap: 5, textShadow: '0 0 8px rgba(0,255,255,0.5)' }}>
              <span style={{ fontSize: 9, opacity: 0.7 }}>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      )}

      {/* Body: 2 columns */}
      <div className="cv-body" style={{ display: 'grid', gridTemplateColumns: '65% 35%', minHeight: 400 }}>
        {/* Main */}
        <div style={{ padding: '8px 32px 40px 48px', borderRight: '1px solid #1a1a2e' }}>
          {hasContent(experience) && (
            <div className="cv-section">
              <SectionTitle>Kinh nghiệm làm việc</SectionTitle>
              {experience!.map(exp => (
                <div key={exp.id} style={{ marginBottom: 20, paddingLeft: 12, borderLeft: '1px solid rgba(57,255,20,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#ffff00', textShadow: '0 0 8px rgba(255,255,0,0.4)' }}>{exp.role}</div>
                      <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{exp.company}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#4a5568', whiteSpace: 'nowrap' }}>
                      {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#94a3b8', lineHeight: 1.7, fontWeight: 300 }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasContent(education) && (
            <div className="cv-section">
              <SectionTitle>Học vấn</SectionTitle>
              {education!.map(edu => (
                <div key={edu.id} style={{ marginBottom: 16, paddingLeft: 12, borderLeft: '1px solid rgba(57,255,20,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#e2e8f0' }}>{edu.school}</div>
                      <div style={{ fontSize: 13, color: '#94a3b8' }}>{[edu.degree, edu.field].filter(Boolean).join(' — ')}</div>
                      {edu.gpa && <div style={{ fontSize: 12, color: '#4a5568' }}>GPA: {edu.gpa}</div>}
                    </div>
                    <div style={{ fontSize: 11, color: '#4a5568', whiteSpace: 'nowrap' }}>
                      {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasContent(projects) && (
            <div className="cv-section">
              <SectionTitle>Dự án</SectionTitle>
              {projects!.map(proj => (
                <div key={proj.id} style={{ marginBottom: 14, paddingLeft: 12, borderLeft: '1px solid rgba(57,255,20,0.2)' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#e2e8f0' }}>
                    {proj.name}
                    {proj.url && <span style={{ fontSize: 11, color: '#00ffff', fontWeight: 400, marginLeft: 8 }}>{proj.url}</span>}
                  </div>
                  {proj.description && <p style={{ margin: '4px 0 6px', fontSize: 13, color: '#94a3b8', lineHeight: 1.6, fontWeight: 300 }}>{proj.description}</p>}
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {proj.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 11, background: '#1a1a2e', color: '#39ff14', padding: '2px 8px', borderRadius: 4, fontWeight: 500, border: '1px solid rgba(57,255,20,0.3)' }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ padding: '8px 28px 40px 24px', background: '#0f0f1a' }}>
          {hasContent(skills) && (
            <div className="cv-section">
              <SectionTitle>Kỹ năng</SectionTitle>
              {skills!.map(skill => (
                <div key={skill.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: '#e2e8f0' }}>{skill.name}</span>
                    <span style={{ fontSize: 11, color: '#4a5568' }}>{LEVEL_LABELS[skill.level]}</span>
                  </div>
                  <div style={{ height: 6, background: '#1a1a2e', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(skill.level / 5) * 100}%`, background: '#39ff14', borderRadius: 4, boxShadow: '0 0 8px rgba(57,255,20,0.6)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasContent(languages) && (
            <div className="cv-section">
              <SectionTitle>Ngôn ngữ</SectionTitle>
              {languages!.map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ fontWeight: 500, color: '#e2e8f0' }}>{lang.language}</span>
                  <span style={{ color: '#4a5568', fontSize: 12 }}>{LANG_LEVELS[lang.level]}</span>
                </div>
              ))}
            </div>
          )}

          {hasContent(certs) && (
            <div className="cv-section">
              <SectionTitle>Chứng chỉ</SectionTitle>
              {certs!.map(cert => (
                <div key={cert.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#e2e8f0' }}>{cert.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{cert.issuer}</div>
                  <div style={{ fontSize: 11, color: '#4a5568' }}>{cert.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!data.fullName && !hasContent(experience) && !hasContent(skills) && (
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#4a5568', fontSize: 14 }}>
          Điền thông tin ở panel bên trái để xem preview CV của bạn
        </div>
      )}
    </div>
  )
}
