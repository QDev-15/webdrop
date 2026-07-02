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
  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#ea580c', borderTop: '2px solid #ea580c', paddingTop: 6, marginBottom: 10, marginTop: 18 }}>
    {children}
  </div>
)

export default function CvCompact({ data, isPrint }: Props) {
  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null
  const projects = data.projects as CvProject[] | null
  const certs = data.certifications as CvCertification[] | null
  const languages = data.languages as CvLanguage[] | null

  const contactItems = [
    data.email && { label: data.email },
    data.phone && { label: data.phone },
    data.location && { label: data.location },
    data.website && { label: data.website },
    data.linkedin && { label: data.linkedin },
    data.github && { label: data.github },
    data.twitter && { label: data.twitter },
  ].filter(Boolean) as { label: string }[]

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: '#1c1917', background: '#ffffff', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Header — 2 col: name/title | contact */}
      <div className="cv-header" style={{ padding: '28px 36px 20px', borderBottom: '1px solid #e7e5e4', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#292524', lineHeight: 1.2 }}>
            {data.fullName || 'Họ và Tên'}
          </h1>
          <div style={{ fontSize: 14, color: '#ea580c', fontStyle: 'italic', fontWeight: 500, marginTop: 4 }}>
            {data.jobTitle || 'Chức danh'}
          </div>
          {data.summary && (
            <p style={{ margin: '8px 0 0', fontSize: 12, color: '#78716c', lineHeight: 1.6, maxWidth: 380 }}>
              {data.summary}
            </p>
          )}
        </div>
        {contactItems.length > 0 && (
          <div style={{ fontSize: 11, color: '#78716c', textAlign: 'right', flexShrink: 0 }}>
            {contactItems.map((item, i) => (
              <div key={i} style={{ marginBottom: 3 }}>{item.label}</div>
            ))}
          </div>
        )}
      </div>

      {/* Body — 3 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, padding: '0 36px 36px', alignItems: 'start' }}>
        {/* Column 1: Experience */}
        <div style={{ paddingRight: 20, borderRight: '1px solid #e7e5e4' }}>
          {hasContent(experience) && (
            <div className="cv-section">
              <SectionTitle>Kinh nghiệm</SectionTitle>
              {experience!.map(exp => (
                <div key={exp.id} style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, color: '#1c1917' }}>{exp.role}</div>
                  <div style={{ fontSize: 11, color: '#ea580c', fontWeight: 500 }}>{exp.company}</div>
                  <div style={{ fontSize: 10, color: '#78716c', marginBottom: 3 }}>
                    {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                  </div>
                  {exp.description && (
                    <p style={{ margin: 0, fontSize: 11, color: '#78716c', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Education + Skills */}
        <div style={{ padding: '0 20px', borderRight: '1px solid #e7e5e4' }}>
          {hasContent(education) && (
            <div className="cv-section">
              <SectionTitle>Học vấn</SectionTitle>
              {education!.map(edu => (
                <div key={edu.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, color: '#1c1917' }}>{edu.school}</div>
                  <div style={{ fontSize: 11, color: '#78716c' }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}</div>
                  <div style={{ fontSize: 10, color: '#a8a29e' }}>{edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}</div>
                  {edu.gpa && <div style={{ fontSize: 10, color: '#a8a29e' }}>GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}

          {hasContent(skills) && (
            <div className="cv-section">
              <SectionTitle>Kỹ năng</SectionTitle>
              {skills!.map(skill => (
                <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 12 }}>
                  <span style={{ color: '#ea580c', fontSize: 10 }}>●</span>
                  <span style={{ color: '#1c1917' }}>{skill.name}</span>
                  <span style={{ fontSize: 10, color: '#a8a29e' }}>— {LEVEL_LABELS[skill.level]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Projects + Certs + Languages */}
        <div style={{ paddingLeft: 20 }}>
          {hasContent(projects) && (
            <div className="cv-section">
              <SectionTitle>Dự án</SectionTitle>
              {projects!.map(proj => (
                <div key={proj.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, color: '#1c1917' }}>{proj.name}</div>
                  {proj.description && <p style={{ margin: '2px 0 3px', fontSize: 11, color: '#78716c', lineHeight: 1.5 }}>{proj.description}</p>}
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ fontSize: 10, color: '#ea580c' }}>{proj.tech.join(' · ')}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasContent(certs) && (
            <div className="cv-section">
              <SectionTitle>Chứng chỉ</SectionTitle>
              {certs!.map(cert => (
                <div key={cert.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, color: '#1c1917' }}>{cert.name}</div>
                  <div style={{ fontSize: 11, color: '#78716c' }}>{cert.issuer}</div>
                  <div style={{ fontSize: 10, color: '#a8a29e' }}>{cert.date}</div>
                </div>
              ))}
            </div>
          )}

          {hasContent(languages) && (
            <div className="cv-section">
              <SectionTitle>Ngôn ngữ</SectionTitle>
              {languages!.map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                  <span style={{ color: '#1c1917' }}>{lang.language}</span>
                  <span style={{ color: '#a8a29e', fontSize: 11 }}>{LANG_LEVELS[lang.level]}</span>
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
