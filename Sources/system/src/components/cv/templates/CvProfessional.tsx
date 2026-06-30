import type { CvDataType, CvExperience, CvEducation, CvSkill, CvProject, CvCertification, CvLanguage } from '@/types/cv'

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')).toUpperCase()
}

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const LEVEL_LABELS = ['', 'Cơ bản', 'Trung bình', 'Khá', 'Tốt', 'Thành thạo']
const LANG_LEVELS = { native: 'Bản ngữ', fluent: 'Thành thạo', intermediate: 'Trung cấp', basic: 'Cơ bản' }

const hasContent = (val: unknown[] | null | undefined): boolean =>
  Array.isArray(val) && val.length > 0

export default function CvProfessional({ data, isPrint }: Props) {
  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null
  const projects = data.projects as CvProject[] | null
  const certs = data.certifications as CvCertification[] | null
  const languages = data.languages as CvLanguage[] | null

  const hasContact = data.email || data.phone || data.location || data.website || data.linkedin || data.github || data.twitter

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', background: '#f8fafc', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @media print {
          .cv-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .cv-sidebar { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .cv-section { page-break-inside: avoid; }
        }
      `}</style>

      {/* Header */}
      <div className="cv-header" style={{ background: '#1e3a5f', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
            {data.fullName || 'Họ và Tên'}
          </h1>
          <div style={{ fontSize: 15, color: '#93c5fd', fontWeight: 500, marginTop: 6 }}>
            {data.jobTitle || 'Chức danh'}
          </div>
          {data.summary && (
            <p style={{ margin: '12px 0 0', fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.75, maxWidth: 520 }}>
              {data.summary}
            </p>
          )}
        </div>
        {data.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.avatarUrl} alt={data.fullName ?? ''} style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,.25)', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(255,255,255,.1)', border: '3px solid rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,.8)', letterSpacing: 1 }}>
            {getInitials(data.fullName)}
          </div>
        )}
      </div>

      {/* Contact bar */}
      {hasContact && (
        <div style={{ background: '#f1f5f9', padding: '10px 40px', display: 'flex', flexWrap: 'wrap', gap: '4px 20px', borderBottom: '1px solid #e2e8f0' }}>
          {[
            data.email && { label: data.email },
            data.phone && { label: data.phone },
            data.location && { label: data.location },
            data.website && { label: data.website },
            data.linkedin && { label: data.linkedin },
            data.github && { label: data.github },
            data.twitter && { label: data.twitter },
          ].filter(Boolean).map((item, i) => item && (
            <span key={i} style={{ fontSize: 12, color: '#475569' }}>{item.label}</span>
          ))}
        </div>
      )}

      {/* Body: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 35%', minHeight: 200 }}>
        {/* Left main */}
        <div style={{ padding: '24px 32px 40px 40px', borderRight: '1px solid #e2e8f0' }}>
          {hasContent(experience) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#1e3a5f', borderLeft: '3px solid #2563eb', paddingLeft: 10, marginBottom: 16 }}>
                Kinh nghiệm làm việc
              </div>
              {experience!.map(exp => (
                <div key={exp.id} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{exp.role}</div>
                      <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 500, marginTop: 2 }}>{exp.company}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap', marginTop: 2 }}>
                      {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ margin: '8px 0 0', fontSize: 13, color: '#475569', lineHeight: 1.75 }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasContent(education) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#1e3a5f', borderLeft: '3px solid #2563eb', paddingLeft: 10, marginBottom: 16 }}>
                Học vấn
              </div>
              {education!.map(edu => (
                <div key={edu.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{edu.school}</div>
                      <div style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>{[edu.degree, edu.field].filter(Boolean).join(' — ')}</div>
                      {edu.gpa && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>GPA: {edu.gpa}</div>}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap', marginTop: 2 }}>
                      {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                    </div>
                  </div>
                  {edu.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasContent(projects) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#1e3a5f', borderLeft: '3px solid #2563eb', paddingLeft: 10, marginBottom: 16 }}>
                Dự án
              </div>
              {projects!.map(proj => (
                <div key={proj.id} style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {proj.name}
                    {proj.url && <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 400, marginLeft: 8 }}>{proj.url}</span>}
                  </div>
                  {proj.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{proj.description}</p>
                  )}
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                      {proj.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 11, background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="cv-sidebar" style={{ padding: '24px 28px 40px', background: '#f8fafc' }}>
          {hasContent(skills) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#1e3a5f', borderLeft: '3px solid #2563eb', paddingLeft: 10, marginBottom: 16 }}>
                Kỹ năng
              </div>
              {skills!.map(skill => (
                <div key={skill.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: '#1e293b' }}>{skill.name}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{LEVEL_LABELS[skill.level]}</span>
                  </div>
                  <div style={{ height: 5, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(skill.level / 5) * 100}%`, background: '#1e3a5f', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasContent(languages) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#1e3a5f', borderLeft: '3px solid #2563eb', paddingLeft: 10, marginBottom: 16 }}>
                Ngôn ngữ
              </div>
              {languages!.map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ fontWeight: 500 }}>{lang.language}</span>
                  <span style={{ fontSize: 11, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: 4 }}>
                    {LANG_LEVELS[lang.level]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {hasContent(certs) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#1e3a5f', borderLeft: '3px solid #2563eb', paddingLeft: 10, marginBottom: 16 }}>
                Chứng chỉ
              </div>
              {certs!.map(cert => (
                <div key={cert.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{cert.name}</div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{cert.issuer}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{cert.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!data.fullName && !hasContent(experience) && !hasContent(skills) && (
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
          Điền thông tin ở panel bên trái để xem preview CV của bạn
        </div>
      )}
    </div>
  )
}
