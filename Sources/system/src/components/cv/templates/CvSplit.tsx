import type { CvDataType, CvExperience, CvEducation, CvSkill, CvProject, CvCertification, CvLanguage } from '@/types/cv'

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const hasContent = (val: unknown[] | null | undefined): boolean =>
  Array.isArray(val) && val.length > 0

const LEVEL_LABELS = ['', 'Cơ bản', 'Trung bình', 'Khá', 'Tốt', 'Thành thạo']
const LANG_LEVELS: Record<string, string> = { native: 'Bản ngữ', fluent: 'Thành thạo', intermediate: 'Trung cấp', basic: 'Cơ bản' }

export default function CvSplit({ data, isPrint }: Props) {
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
    <div style={{ fontFamily: "'Manrope', sans-serif", color: '#18181b', background: '#fafafa', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-left { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: 700 }}>
        {/* Left — dark 50% */}
        <div className="cv-left" style={{ width: '50%', background: '#18181b', padding: '48px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>

          {/* Avatar */}
          <div style={{ marginBottom: 20 }}>
            {data.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.avatarUrl} alt={data.fullName ?? ''} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid #ec4899' }} />
            ) : (
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#27272a', border: '3px solid #ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: '#f4f4f5' }}>
                {(data.fullName ?? '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#f4f4f5', textAlign: 'center', lineHeight: 1.2 }}>
            {data.fullName || 'Họ và Tên'}
          </h1>
          <div style={{ fontSize: 14, color: '#ec4899', fontWeight: 600, marginTop: 6, textAlign: 'center' }}>
            {data.jobTitle || 'Chức danh'}
          </div>

          {data.summary && (
            <p style={{ margin: '16px 0 0', fontSize: 12, color: '#a1a1aa', lineHeight: 1.75, textAlign: 'center', fontWeight: 300 }}>
              {data.summary}
            </p>
          )}

          {/* Contact */}
          {contactItems.length > 0 && (
            <div style={{ width: '100%', marginTop: 28 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#ec4899', marginBottom: 12, textAlign: 'center' }}>
                Liên hệ
              </div>
              {contactItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, color: '#d4d4d8' }}>
                  <span style={{ color: '#ec4899', fontSize: 10, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ wordBreak: 'break-all' }}>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {hasContent(languages) && (
            <div style={{ width: '100%', marginTop: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#ec4899', marginBottom: 12, textAlign: 'center' }}>
                Ngôn ngữ
              </div>
              {languages!.map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: '#f4f4f5', fontWeight: 500 }}>{lang.language}</span>
                  <span style={{ color: '#a1a1aa' }}>{LANG_LEVELS[lang.level]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — light 50% */}
        <div style={{ flex: 1, padding: '40px 36px', background: '#fafafa' }}>

          {hasContent(experience) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#18181b', borderBottom: '2px solid #ec4899', paddingBottom: 6, marginBottom: 16 }}>
                Kinh nghiệm làm việc
              </div>
              {experience!.map(exp => (
                <div key={exp.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#18181b' }}>{exp.role}</div>
                      <div style={{ fontSize: 13, color: '#ec4899', fontWeight: 600 }}>{exp.company}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#71717a', whiteSpace: 'nowrap' }}>
                      {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#3f3f46', lineHeight: 1.7 }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasContent(education) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#18181b', borderBottom: '2px solid #ec4899', paddingBottom: 6, marginBottom: 16 }}>
                Học vấn
              </div>
              {education!.map(edu => (
                <div key={edu.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#18181b' }}>{edu.school}</div>
                      <div style={{ fontSize: 13, color: '#71717a' }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}</div>
                      {edu.gpa && <div style={{ fontSize: 12, color: '#71717a' }}>GPA: {edu.gpa}</div>}
                    </div>
                    <div style={{ fontSize: 11, color: '#71717a', whiteSpace: 'nowrap' }}>
                      {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasContent(skills) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#18181b', borderBottom: '2px solid #ec4899', paddingBottom: 6, marginBottom: 16 }}>
                Kỹ năng
              </div>
              {skills!.map(skill => (
                <div key={skill.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: '#18181b' }}>{skill.name}</span>
                    <span style={{ fontSize: 11, color: '#71717a' }}>{LEVEL_LABELS[skill.level]}</span>
                  </div>
                  <div style={{ height: 5, background: '#e4e4e7', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(skill.level / 5) * 100}%`, background: '#ec4899', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasContent(projects) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#18181b', borderBottom: '2px solid #ec4899', paddingBottom: 6, marginBottom: 16 }}>
                Dự án
              </div>
              {projects!.map(proj => (
                <div key={proj.id} style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#18181b' }}>
                    {proj.name}
                    {proj.url && <span style={{ fontSize: 11, color: '#ec4899', fontWeight: 400, marginLeft: 8 }}>{proj.url}</span>}
                  </div>
                  {proj.description && <p style={{ margin: '4px 0 6px', fontSize: 13, color: '#3f3f46', lineHeight: 1.6 }}>{proj.description}</p>}
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {proj.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 11, background: '#fce7f3', color: '#be185d', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasContent(certs) && (
            <div className="cv-section">
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#18181b', borderBottom: '2px solid #ec4899', paddingBottom: 6, marginBottom: 16 }}>
                Chứng chỉ
              </div>
              {certs!.map(cert => (
                <div key={cert.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#18181b' }}>{cert.name}</div>
                  <div style={{ fontSize: 12, color: '#71717a' }}>{cert.issuer} — {cert.date}</div>
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
